import type { SchemaResponse, PredictRequest, PredictResponse } from '../types/api';

declare global {
  interface Window {
    loadPyodide?: (config: any) => Promise<any>;
  }
}

let pyodideInstance: any = null;
let isInitializing = false;
let initPromise: Promise<any> | null = null;

export interface PyodideInitStatus {
  stage: 'loading_pyodide' | 'loading_packages' | 'fetching_model' | 'deserializing_model' | 'ready' | 'error';
  message: string;
  progress: number;
}

export const initializePyodideEngine = async (
  onStatusUpdate?: (status: PyodideInitStatus) => void
): Promise<any> => {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (isInitializing && initPromise) {
    return initPromise;
  }

  isInitializing = true;

  initPromise = (async () => {
    try {
      // Stage 1: Load Pyodide WebAssembly runtime
      onStatusUpdate?.({
        stage: 'loading_pyodide',
        message: 'Initializing Pyodide WebAssembly engine in browser...',
        progress: 20,
      });

      if (!window.loadPyodide) {
        throw new Error('Pyodide script tag not found on window object. Verify index.html CDN script.');
      }

      pyodideInstance = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
      });

      // Stage 2: Load scientific packages (numpy, pandas, scikit-learn, joblib)
      onStatusUpdate?.({
        stage: 'loading_packages',
        message: 'Loading Python ML packages (numpy, pandas, scikit-learn, joblib) in WebAssembly...',
        progress: 50,
      });

      await pyodideInstance.loadPackage(['numpy', 'pandas', 'scikit-learn', 'joblib']);

      // Stage 3: Fetch WAAM_AI_Model.pkl from public/model/
      onStatusUpdate?.({
        stage: 'fetching_model',
        message: 'Fetching WAAM_AI_Model.pkl from public/model/...',
        progress: 75,
      });

      const response = await fetch('/model/WAAM_AI_Model.pkl');
      if (!response.ok) {
        throw new Error(`Failed to fetch model from /model/WAAM_AI_Model.pkl (HTTP ${response.status})`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const byteArray = new Uint8Array(arrayBuffer);

      // Write model file directly into Pyodide virtual filesystem
      pyodideInstance.FS.writeFile('WAAM_AI_Model.pkl', byteArray);

      // Stage 4: Recreate WAAMAI class and deserialize model in Python
      onStatusUpdate?.({
        stage: 'deserializing_model',
        message: 'Recreating WAAMAI class & deserializing joblib model in Pyodide memory...',
        progress: 90,
      });

      const setupPythonScript = `
import sys
import joblib
import pandas as pd
import numpy as np
import sklearn
import sklearn.compose._column_transformer
import sklearn.impute._base

# Recreate exact WAAMAI class required for joblib deserialization
class WAAMAI:
    pass

sys.modules['__main__'].WAAMAI = WAAMAI

# Compatibility Patch 1: ColumnTransformer remainder columns list
if not hasattr(sklearn.compose._column_transformer, '_RemainderColsList'):
    class _RemainderColsList(list):
        pass
    sklearn.compose._column_transformer._RemainderColsList = _RemainderColsList

# Compatibility Patch 2: SimpleImputer _fill_dtype
orig_transform = sklearn.impute._base.SimpleImputer.transform
def patched_transform(self, X):
    if not hasattr(self, '_fill_dtype') and hasattr(self, '_fit_dtype'):
        self._fill_dtype = self._fit_dtype
    return orig_transform(self, X)
sklearn.impute._base.SimpleImputer.transform = patched_transform

# Load model ONCE into global Python memory
try:
    WAAM_MODEL = joblib.load('WAAM_AI_Model.pkl')
    print("SUCCESS: Loaded WAAM_AI_Model.pkl inside browser Pyodide WASM!")
except Exception as e:
    print(f"FAILED to load WAAM_AI_Model.pkl in Pyodide: {e}")
    raise e
`;

      await pyodideInstance.runPythonAsync(setupPythonScript);

      onStatusUpdate?.({
        stage: 'ready',
        message: 'WAAM AI In-Browser WASM Engine Ready!',
        progress: 100,
      });

      return pyodideInstance;
    } catch (err: any) {
      console.error('Pyodide initialization failure:', err);
      onStatusUpdate?.({
        stage: 'error',
        message: `Pyodide Initialization Error: ${err.message || err}`,
        progress: 0,
      });
      isInitializing = false;
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
};

export const getSchemaFromPyodide = async (): Promise<SchemaResponse> => {
  const py = await initializePyodideEngine();
  
  const schemaScript = `
import json

try:
    preprocessor = WAAM_MODEL.regression_model.named_steps['preprocessor']
    cat_encoder = preprocessor.named_transformers_['cat'].named_steps['encoder']
    categories = cat_encoder.categories_
    materials = [str(c) for c in categories[0]]
    shielding_gases = [str(c) for c in categories[1]]
except Exception as e:
    materials = ["AlSi5", "ER5356", "SS316L", "Ti-6Al-4V"]
    shielding_gases = ["Ar+2%O2", "Ar+He", "Argon", "Helium"]

schema_dict = {
    "materials": materials,
    "shielding_gases": shielding_gases,
    "parameter_ranges": {
        "Wire_Diameter_mm": {"min": 0.8, "max": 2.4, "default": 1.2, "step": 0.1, "unit": "mm"},
        "Travel_Speed_mm_s": {"min": 1.0, "max": 20.0, "default": 5.0, "step": 0.5, "unit": "mm/s"},
        "Wire_Feed_Speed_mm_s": {"min": 10.0, "max": 150.0, "default": 50.0, "step": 1.0, "unit": "mm/s"},
        "Voltage_V": {"min": 10.0, "max": 40.0, "default": 20.0, "step": 0.5, "unit": "V"},
        "Current_A": {"min": 50.0, "max": 350.0, "default": 150.0, "step": 5.0, "unit": "A"}
    }
}
json.dumps(schema_dict)
`;

  const schemaJsonStr = await py.runPythonAsync(schemaScript);
  return JSON.parse(schemaJsonStr);
};

export const predictWithPyodide = async (payload: PredictRequest): Promise<PredictResponse> => {
  const py = await initializePyodideEngine();

  // Convert JavaScript payload into Pyodide execution
  const pyCode = `
import pandas as pd
import json

input_payload = ${JSON.stringify(payload)}

# Convert input dictionary into pandas DataFrame
df_in = pd.DataFrame([input_payload])

# Run predictions directly using in-memory model inside Pyodide WASM
reg_preds = WAAM_MODEL.regression_model.predict(df_in)[0]
quality_pred = WAAM_MODEL.quality_model.predict(df_in)[0]
edge_pred = WAAM_MODEL.edge_model.predict(df_in)[0]

reg_names = [
    "MeltPool_Area_mm2",
    "MeltPool_Width_mm",
    "MeltPool_Length_mm",
    "Bead_Width_mm",
    "Bead_Height_mm",
    "Build_Height_mm",
    "Vibration_g",
    "RGB_Brightness",
    "RGB_Contrast",
    "Porosity_pct"
]

res = {}
for name, val in zip(reg_names, reg_preds):
    res[name] = float(round(float(val), 4))

res["Predicted_Bead_Quality"] = str(quality_pred)
res["Edge_Device"] = str(edge_pred)

json.dumps(res)
`;

  const resultJsonStr = await py.runPythonAsync(pyCode);
  return JSON.parse(resultJsonStr);
};
