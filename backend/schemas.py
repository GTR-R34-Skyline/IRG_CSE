from pydantic import BaseModel, Field
from typing import List, Dict, Any

class PredictRequest(BaseModel):
    Material: str = Field(..., example="ER5356")
    Wire_Diameter_mm: float = Field(..., example=1.2)
    Shielding_Gas: str = Field(..., example="Argon")
    Travel_Speed_mm_s: float = Field(..., example=5.0)
    Wire_Feed_Speed_mm_s: float = Field(..., example=50.0)
    Voltage_V: float = Field(..., example=20.0)
    Current_A: float = Field(..., example=150.0)
    Arc_Power_kW: float = Field(..., example=3.0)

class PredictResponse(BaseModel):
    MeltPool_Area_mm2: float
    MeltPool_Width_mm: float
    MeltPool_Length_mm: float
    Bead_Width_mm: float
    Bead_Height_mm: float
    Build_Height_mm: float
    Vibration_g: float
    RGB_Brightness: float
    RGB_Contrast: float
    Porosity_pct: float
    Predicted_Bead_Quality: str
    Edge_Device: str

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str

class ParameterRange(BaseModel):
    min: float
    max: float
    default: float
    step: float
    unit: str

class SchemaResponse(BaseModel):
    materials: List[str]
    shielding_gases: List[str]
    parameter_ranges: Dict[str, ParameterRange]
