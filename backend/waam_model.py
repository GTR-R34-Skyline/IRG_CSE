import os
import sys
import joblib
import pandas as pd
import numpy as np

# Recreate the exact WAAMAI class required for joblib deserialization
class WAAMAI:
    """
    WAAM AI Model wrapper class containing regression_model, quality_model, and edge_model.
    """
    def __init__(self):
        self.regression_model = None
        self.quality_model = None
        self.edge_model = None

# Register WAAMAI in __main__ so joblib can deserialize objects serialized from __main__
sys.modules['__main__'].WAAMAI = WAAMAI

MODEL_INSTANCE = None

def load_waam_model(model_path: str = None):
    global MODEL_INSTANCE
    if MODEL_INSTANCE is not None:
        return MODEL_INSTANCE

    if model_path is None:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, 'WAAM_AI_Model.pkl')
        if not os.path.exists(model_path):
            # Fallback to root directory if not found in backend/
            root_path = os.path.join(base_dir, '..', 'WAAM_AI_Model.pkl')
            if os.path.exists(root_path):
                model_path = root_path

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}")

    print(f"Loading WAAM AI Model from: {model_path}")
    MODEL_INSTANCE = joblib.load(model_path)
    print("WAAM AI Model loaded successfully!")
    return MODEL_INSTANCE

def get_model_schema():
    model = load_waam_model()
    
    # Inspect preprocessing pipeline dynamically
    try:
        preprocessor = model.regression_model.named_steps['preprocessor']
        cat_encoder = preprocessor.named_transformers_['cat'].named_steps['encoder']
        categories = cat_encoder.categories_
        materials = [str(c) for c in categories[0]]
        shielding_gases = [str(c) for c in categories[1]]
    except Exception as e:
        print(f"Warning: Could not dynamically extract categories: {e}")
        materials = ["AlSi5", "ER5356", "SS316L", "Ti-6Al-4V"]
        shielding_gases = ["Ar+2%O2", "Ar+He", "Argon", "Helium"]

    schema = {
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
    return schema

def predict_waam(input_data: dict) -> dict:
    model = load_waam_model()
    
    # Convert input into Pandas DataFrame
    df = pd.DataFrame([input_data])
    
    # Perform predictions across all 3 sub-models
    reg_preds = model.regression_model.predict(df)[0]
    quality_pred = model.quality_model.predict(df)[0]
    edge_pred = model.edge_model.predict(df)[0]
    
    # Exact regression output names specified by project requirements
    reg_output_names = [
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
    
    result = {}
    for name, val in zip(reg_output_names, reg_preds):
        # Convert NumPy types to native Python floats rounded to 4 decimals
        result[name] = float(round(float(val), 4))
        
    result["Predicted_Bead_Quality"] = str(quality_pred)
    result["Edge_Device"] = str(edge_pred)
    
    return result
