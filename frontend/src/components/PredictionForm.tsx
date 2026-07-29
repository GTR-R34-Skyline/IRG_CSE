import React, { useState, useEffect } from 'react';
import { Sliders, Zap, Play, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import type { SchemaResponse, PredictRequest } from '../types/api';

interface PredictionFormProps {
  schema: SchemaResponse | null;
  loadingSchema: boolean;
  onPredict: (data: PredictRequest) => void;
  predicting: boolean;
  error: string | null;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({
  schema,
  loadingSchema,
  onPredict,
  predicting,
  error,
}) => {
  const [formData, setFormData] = useState<PredictRequest>({
    Material: 'ER5356',
    Wire_Diameter_mm: 1.2,
    Shielding_Gas: 'Argon',
    Travel_Speed_mm_s: 5.0,
    Wire_Feed_Speed_mm_s: 50.0,
    Voltage_V: 20.0,
    Current_A: 150.0,
    Arc_Power_kW: 3.0,
  });

  // Populate dynamic options once schema loads
  useEffect(() => {
    if (schema) {
      setFormData(prev => ({
        ...prev,
        Material: schema.materials[0] || prev.Material,
        Shielding_Gas: schema.shielding_gases[0] || prev.Shielding_Gas,
        Wire_Diameter_mm: schema.parameter_ranges.Wire_Diameter_mm?.default ?? prev.Wire_Diameter_mm,
        Travel_Speed_mm_s: schema.parameter_ranges.Travel_Speed_mm_s?.default ?? prev.Travel_Speed_mm_s,
        Wire_Feed_Speed_mm_s: schema.parameter_ranges.Wire_Feed_Speed_mm_s?.default ?? prev.Wire_Feed_Speed_mm_s,
        Voltage_V: schema.parameter_ranges.Voltage_V?.default ?? prev.Voltage_V,
        Current_A: schema.parameter_ranges.Current_A?.default ?? prev.Current_A,
        Arc_Power_kW: Number(((schema.parameter_ranges.Voltage_V?.default ?? prev.Voltage_V) * (schema.parameter_ranges.Current_A?.default ?? prev.Current_A) / 1000).toFixed(3)),
      }));
    }
  }, [schema]);

  // Recalculate Arc Power whenever Voltage or Current changes
  const handleNumericChange = (field: keyof PredictRequest, value: number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'Voltage_V' || field === 'Current_A') {
        const voltage = field === 'Voltage_V' ? value : prev.Voltage_V;
        const current = field === 'Current_A' ? value : prev.Current_A;
        updated.Arc_Power_kW = Number(((voltage * current) / 1000).toFixed(3));
      }
      return updated;
    });
  };

  const handleSelectChange = (field: keyof PredictRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (schema) {
      setFormData({
        Material: schema.materials[0] || 'ER5356',
        Wire_Diameter_mm: schema.parameter_ranges.Wire_Diameter_mm?.default ?? 1.2,
        Shielding_Gas: schema.shielding_gases[0] || 'Argon',
        Travel_Speed_mm_s: schema.parameter_ranges.Travel_Speed_mm_s?.default ?? 5.0,
        Wire_Feed_Speed_mm_s: schema.parameter_ranges.Wire_Feed_Speed_mm_s?.default ?? 50.0,
        Voltage_V: schema.parameter_ranges.Voltage_V?.default ?? 20.0,
        Current_A: schema.parameter_ranges.Current_A?.default ?? 150.0,
        Arc_Power_kW: Number(((schema.parameter_ranges.Voltage_V?.default ?? 20.0) * (schema.parameter_ranges.Current_A?.default ?? 150.0) / 1000).toFixed(3)),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict(formData);
  };

  if (loadingSchema) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 animate-pulse text-center">
        <div className="flex justify-center mb-4">
          <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
        <p className="text-slate-400 font-mono text-sm">Inspecting trained preprocessing schema from FastAPI backend...</p>
      </div>
    );
  }

  return (
    <div id="predict" className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">Process Parameter Input</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Populated dynamically from trained model preprocessing categories.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Categorical Selections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Material */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">
              Wire Material (Substrate / Alloy)
            </label>
            <select
              value={formData.Material}
              onChange={(e) => handleSelectChange('Material', e.target.value)}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-cyan-500"
            >
              {schema?.materials.map((mat) => (
                <option key={mat} value={mat} className="bg-slate-900 text-white">
                  {mat}
                </option>
              ))}
            </select>
          </div>

          {/* Shielding Gas */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">
              Shielding Gas Mixture
            </label>
            <select
              value={formData.Shielding_Gas}
              onChange={(e) => handleSelectChange('Shielding_Gas', e.target.value)}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-cyan-500"
            >
              {schema?.shielding_gases.map((gas) => (
                <option key={gas} value={gas} className="bg-slate-900 text-white">
                  {gas}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Sliders and Numeric Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

          {/* Wire Diameter */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800/80">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-slate-300">Wire Diameter (mm)</label>
              <input
                type="number"
                step={schema?.parameter_ranges.Wire_Diameter_mm?.step || 0.1}
                min={schema?.parameter_ranges.Wire_Diameter_mm?.min || 0.8}
                max={schema?.parameter_ranges.Wire_Diameter_mm?.max || 2.4}
                value={formData.Wire_Diameter_mm}
                onChange={(e) => handleNumericChange('Wire_Diameter_mm', parseFloat(e.target.value) || 0)}
                className="w-20 glass-input text-right px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-cyan-400"
              />
            </div>
            <input
              type="range"
              step={schema?.parameter_ranges.Wire_Diameter_mm?.step || 0.1}
              min={schema?.parameter_ranges.Wire_Diameter_mm?.min || 0.8}
              max={schema?.parameter_ranges.Wire_Diameter_mm?.max || 2.4}
              value={formData.Wire_Diameter_mm}
              onChange={(e) => handleNumericChange('Wire_Diameter_mm', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Travel Speed */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800/80">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-slate-300">Travel Speed (mm/s)</label>
              <input
                type="number"
                step={schema?.parameter_ranges.Travel_Speed_mm_s?.step || 0.5}
                min={schema?.parameter_ranges.Travel_Speed_mm_s?.min || 1.0}
                max={schema?.parameter_ranges.Travel_Speed_mm_s?.max || 20.0}
                value={formData.Travel_Speed_mm_s}
                onChange={(e) => handleNumericChange('Travel_Speed_mm_s', parseFloat(e.target.value) || 0)}
                className="w-20 glass-input text-right px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-cyan-400"
              />
            </div>
            <input
              type="range"
              step={schema?.parameter_ranges.Travel_Speed_mm_s?.step || 0.5}
              min={schema?.parameter_ranges.Travel_Speed_mm_s?.min || 1.0}
              max={schema?.parameter_ranges.Travel_Speed_mm_s?.max || 20.0}
              value={formData.Travel_Speed_mm_s}
              onChange={(e) => handleNumericChange('Travel_Speed_mm_s', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Wire Feed Speed */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800/80">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-slate-300">Wire Feed Speed (mm/s)</label>
              <input
                type="number"
                step={schema?.parameter_ranges.Wire_Feed_Speed_mm_s?.step || 1.0}
                min={schema?.parameter_ranges.Wire_Feed_Speed_mm_s?.min || 10.0}
                max={schema?.parameter_ranges.Wire_Feed_Speed_mm_s?.max || 150.0}
                value={formData.Wire_Feed_Speed_mm_s}
                onChange={(e) => handleNumericChange('Wire_Feed_Speed_mm_s', parseFloat(e.target.value) || 0)}
                className="w-20 glass-input text-right px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-cyan-400"
              />
            </div>
            <input
              type="range"
              step={schema?.parameter_ranges.Wire_Feed_Speed_mm_s?.step || 1.0}
              min={schema?.parameter_ranges.Wire_Feed_Speed_mm_s?.min || 10.0}
              max={schema?.parameter_ranges.Wire_Feed_Speed_mm_s?.max || 150.0}
              value={formData.Wire_Feed_Speed_mm_s}
              onChange={(e) => handleNumericChange('Wire_Feed_Speed_mm_s', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Voltage */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800/80">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-slate-300">Voltage (V)</label>
              <input
                type="number"
                step={schema?.parameter_ranges.Voltage_V?.step || 0.5}
                min={schema?.parameter_ranges.Voltage_V?.min || 10.0}
                max={schema?.parameter_ranges.Voltage_V?.max || 40.0}
                value={formData.Voltage_V}
                onChange={(e) => handleNumericChange('Voltage_V', parseFloat(e.target.value) || 0)}
                className="w-20 glass-input text-right px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-cyan-400"
              />
            </div>
            <input
              type="range"
              step={schema?.parameter_ranges.Voltage_V?.step || 0.5}
              min={schema?.parameter_ranges.Voltage_V?.min || 10.0}
              max={schema?.parameter_ranges.Voltage_V?.max || 40.0}
              value={formData.Voltage_V}
              onChange={(e) => handleNumericChange('Voltage_V', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Current */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800/80">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-slate-300">Current (A)</label>
              <input
                type="number"
                step={schema?.parameter_ranges.Current_A?.step || 5.0}
                min={schema?.parameter_ranges.Current_A?.min || 50.0}
                max={schema?.parameter_ranges.Current_A?.max || 350.0}
                value={formData.Current_A}
                onChange={(e) => handleNumericChange('Current_A', parseFloat(e.target.value) || 0)}
                className="w-20 glass-input text-right px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-cyan-400"
              />
            </div>
            <input
              type="range"
              step={schema?.parameter_ranges.Current_A?.step || 5.0}
              min={schema?.parameter_ranges.Current_A?.min || 50.0}
              max={schema?.parameter_ranges.Current_A?.max || 350.0}
              value={formData.Current_A}
              onChange={(e) => handleNumericChange('Current_A', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Calculated Arc Power (Read-Only) */}
          <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-cyan-300 flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Calculated Arc Power (kW)</span>
              </label>
              <span className="text-[10px] text-cyan-400/80 font-mono">READ-ONLY (V × A / 1000)</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400">P_arc</span>
              <span className="text-lg font-mono font-extrabold text-amber-400">{formData.Arc_Power_kW} kW</span>
            </div>
          </div>

        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={predicting}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wider uppercase shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {predicting ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Evaluating WAAM AI Neural Pipelines...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-slate-950" />
                <span>Run Process Prediction</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
