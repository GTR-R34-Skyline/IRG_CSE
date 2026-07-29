const { loadPyodide } = require('pyodide');
const fs = require('fs');

async function test() {
    console.log('Loading Pyodide in Node...');
    const pyodide = await loadPyodide();
    console.log('Loading packages: numpy, pandas, scikit-learn, joblib...');
    await pyodide.loadPackage(['numpy', 'pandas', 'scikit-learn', 'joblib']);
    console.log('Packages loaded successfully in WASM!');

    const pklBytes = fs.readFileSync('public/model/WAAM_AI_Model.pkl');
    pyodide.FS.writeFile('WAAM_AI_Model.pkl', pklBytes);

    const pythonScript = [
        "import sys, joblib, pandas as pd",
        "import sklearn",
        "import sklearn.compose._column_transformer",
        "import sklearn.impute._base",
        "",
        "print('Pyodide scikit-learn version:', sklearn.__version__)",
        "",
        "class WAAMAI:",
        "    pass",
        "",
        "# Patch 1: _RemainderColsList for ColumnTransformer compatibility",
        "if not hasattr(sklearn.compose._column_transformer, '_RemainderColsList'):",
        "    class _RemainderColsList(list):",
        "        pass",
        "    sklearn.compose._column_transformer._RemainderColsList = _RemainderColsList",
        "",
        "# Patch 2: SimpleImputer _fill_dtype compatibility between scikit-learn 1.6.1 and 1.8.0",
        "orig_transform = sklearn.impute._base.SimpleImputer.transform",
        "def patched_transform(self, X):",
        "    if not hasattr(self, '_fill_dtype') and hasattr(self, '_fit_dtype'):",
        "        self._fill_dtype = self._fit_dtype",
        "    return orig_transform(self, X)",
        "sklearn.impute._base.SimpleImputer.transform = patched_transform",
        "",
        "sys.modules['__main__'].WAAMAI = WAAMAI",
        "",
        "try:",
        "    model = joblib.load('WAAM_AI_Model.pkl')",
        "    print('SUCCESS: Model loaded successfully inside Pyodide WASM!')",
        "    ",
        "    sample_df = pd.DataFrame([{",
        "        'Material': 'ER5356',",
        "        'Wire_Diameter_mm': 1.2,",
        "        'Shielding_Gas': 'Argon',",
        "        'Travel_Speed_mm_s': 5.0,",
        "        'Wire_Feed_Speed_mm_s': 50.0,",
        "        'Voltage_V': 20.0,",
        "        'Current_A': 150.0,",
        "        'Arc_Power_kW': 3.0",
        "    }])",
        "    ",
        "    reg_preds = model.regression_model.predict(sample_df)[0]",
        "    quality_pred = model.quality_model.predict(sample_df)[0]",
        "    edge_pred = model.edge_model.predict(sample_df)[0]",
        "    ",
        "    print('PREDICTIONS GENERATED IN BROWSER WASM PYODIDE:')",
        "    print('Regression outputs (10 targets):', reg_preds.tolist())",
        "    print('Quality prediction:', str(quality_pred))",
        "    print('Edge prediction:', str(edge_pred))",
        "except Exception as e:",
        "    print('Error inside Pyodide:', e)",
        "    import traceback",
        "    traceback.print_exc()"
    ].join("\n");

    await pyodide.runPythonAsync(pythonScript);
}

test().catch(console.error);
