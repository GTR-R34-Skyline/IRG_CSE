export interface ParameterRange {
  min: number;
  max: number;
  default: number;
  step: number;
  unit: string;
}

export interface SchemaResponse {
  materials: string[];
  shielding_gases: string[];
  parameter_ranges: Record<string, ParameterRange>;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  version: string;
}

export interface PredictRequest {
  Material: string;
  Wire_Diameter_mm: number;
  Shielding_Gas: string;
  Travel_Speed_mm_s: number;
  Wire_Feed_Speed_mm_s: number;
  Voltage_V: number;
  Current_A: number;
  Arc_Power_kW: number;
}

export interface PredictResponse {
  MeltPool_Area_mm2: number;
  MeltPool_Width_mm: number;
  MeltPool_Length_mm: number;
  Bead_Width_mm: number;
  Bead_Height_mm: number;
  Build_Height_mm: number;
  Vibration_g: number;
  RGB_Brightness: number;
  RGB_Contrast: number;
  Porosity_pct: number;
  Predicted_Bead_Quality: 'Optimal' | 'Good' | 'Fair' | 'Poor' | string;
  Edge_Device: string;
}
