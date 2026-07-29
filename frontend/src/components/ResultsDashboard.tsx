import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import {
  Activity, Cpu, ShieldAlert, CheckCircle, Copy, Download, FileSpreadsheet, Sparkles, Eye, Waves
} from 'lucide-react';
import type { PredictResponse, PredictRequest } from '../types/api';

interface ResultsDashboardProps {
  prediction: PredictResponse | null;
  inputs: PredictRequest | null;
  onNotify: (msg: string) => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  prediction,
  onNotify
}) => {
  if (!prediction) {
    return (
      <div className="glass-panel p-12 rounded-3xl border border-slate-800/80 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
          <Activity className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-300">Awaiting Process Parameters</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Fill in the process parameters above and click "Run Process Prediction" to generate real-time AI telemetry.
        </p>
      </div>
    );
  }

  // Quality badge color mappings
  const getQualityBadge = (quality: string) => {
    const q = quality.toLowerCase();
    if (q.includes('optimal') || q.includes('excellent')) {
      return {
        bg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
        dot: 'bg-emerald-400',
        text: 'Optimal / Excellent'
      };
    } else if (q.includes('good')) {
      return {
        bg: 'bg-blue-950/80 border-blue-500/50 text-blue-300',
        dot: 'bg-blue-400',
        text: 'Good Quality'
      };
    } else if (q.includes('fair')) {
      return {
        bg: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
        dot: 'bg-amber-400',
        text: 'Fair Quality'
      };
    } else {
      return {
        bg: 'bg-rose-950/80 border-rose-500/50 text-rose-300',
        dot: 'bg-rose-500',
        text: 'Poor Quality (Alert)'
      };
    }
  };

  const qualityBadge = getQualityBadge(prediction.Predicted_Bead_Quality);

  // Data for Recharts Bar Chart
  const chartData = [
    { name: 'Melt Pool Area', value: prediction.MeltPool_Area_mm2, unit: 'mm²', color: '#00f0ff' },
    { name: 'Bead Width', value: prediction.Bead_Width_mm, unit: 'mm', color: '#3b82f6' },
    { name: 'Bead Height', value: prediction.Bead_Height_mm, unit: 'mm', color: '#10b981' },
    { name: 'Build Height', value: prediction.Build_Height_mm, unit: 'mm', color: '#f59e0b' },
  ];

  // Copy JSON handler
  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(prediction, null, 2));
    onNotify('Prediction JSON copied to clipboard!');
  };

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = Object.keys(prediction).join(',');
    const values = Object.values(prediction).join(',');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${values}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WAAM_Prediction_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify('CSV Report downloaded successfully!');
  };

  // Download PDF simulation report
  const handleDownloadPDF = () => {
    window.print();
    onNotify('Opening print / PDF report dialog...');
  };

  return (
    <div id="dashboard" className="space-y-8">
      
      {/* Top Banner: Quality Badge & Edge Hardware Recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Quality Badge Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`glass-panel p-6 rounded-3xl border flex items-center justify-between ${qualityBadge.bg}`}
        >
          <div>
            <span className="text-xs uppercase font-mono font-bold tracking-wider opacity-80">
              Predicted Bead Quality
            </span>
            <div className="flex items-center space-x-3 mt-2">
              <span className={`w-4 h-4 rounded-full ${qualityBadge.dot} animate-pulse`}></span>
              <span className="text-2xl font-black">{prediction.Predicted_Bead_Quality}</span>
            </div>
            <p className="text-xs opacity-75 mt-1">Multi-class Random Forest Classifier output</p>
          </div>
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10">
            <CheckCircle className="w-8 h-8 opacity-90" />
          </div>
        </motion.div>

        {/* Edge Hardware Recommendation Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-3xl border border-cyan-500/30 bg-cyan-950/20 flex items-center justify-between"
        >
          <div>
            <span className="text-xs uppercase font-mono font-bold text-cyan-400 tracking-wider">
              Edge Hardware Recommendation
            </span>
            <div className="flex items-center space-x-3 mt-2">
              <Cpu className="w-6 h-6 text-cyan-400" />
              <span className="text-2xl font-black text-white">{prediction.Edge_Device}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Optimal edge AI inference platform</p>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
            SPEC OK
          </div>
        </motion.div>

      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-slate-800">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Inference Results Telemetry</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopyJSON}
            className="px-3.5 py-1.5 rounded-xl glass-input text-xs font-medium hover:text-cyan-400 flex items-center space-x-1.5 transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy JSON</span>
          </button>
          
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded-xl glass-input text-xs font-medium hover:text-emerald-400 flex items-center space-x-1.5 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-xs font-medium hover:bg-cyan-900/80 flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* 10 Regression Output Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 glass-panel-hover">
          <span className="text-[11px] font-medium text-slate-400 block uppercase">Melt Pool Area</span>
          <span className="text-xl font-extrabold text-cyan-400 mt-1 block font-mono">
            {prediction.MeltPool_Area_mm2} <span className="text-xs font-normal text-slate-500">mm²</span>
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 glass-panel-hover">
          <span className="text-[11px] font-medium text-slate-400 block uppercase">Melt Pool Width</span>
          <span className="text-xl font-extrabold text-cyan-400 mt-1 block font-mono">
            {prediction.MeltPool_Width_mm} <span className="text-xs font-normal text-slate-500">mm</span>
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 glass-panel-hover">
          <span className="text-[11px] font-medium text-slate-400 block uppercase">Melt Pool Length</span>
          <span className="text-xl font-extrabold text-cyan-400 mt-1 block font-mono">
            {prediction.MeltPool_Length_mm} <span className="text-xs font-normal text-slate-500">mm</span>
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 glass-panel-hover">
          <span className="text-[11px] font-medium text-slate-400 block uppercase">Bead Width</span>
          <span className="text-xl font-extrabold text-emerald-400 mt-1 block font-mono">
            {prediction.Bead_Width_mm} <span className="text-xs font-normal text-slate-500">mm</span>
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 glass-panel-hover">
          <span className="text-[11px] font-medium text-slate-400 block uppercase">Bead Height</span>
          <span className="text-xl font-extrabold text-emerald-400 mt-1 block font-mono">
            {prediction.Bead_Height_mm} <span className="text-xs font-normal text-slate-500">mm</span>
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 glass-panel-hover">
          <span className="text-[11px] font-medium text-slate-400 block uppercase">Build Height</span>
          <span className="text-xl font-extrabold text-amber-400 mt-1 block font-mono">
            {prediction.Build_Height_mm} <span className="text-xs font-normal text-slate-500">mm</span>
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 glass-panel-hover">
          <span className="text-[11px] font-medium text-slate-400 block uppercase">Vibration</span>
          <span className="text-xl font-extrabold text-slate-200 mt-1 block font-mono flex items-center space-x-1">
            <Waves className="w-4 h-4 text-cyan-400 inline" />
            <span>{prediction.Vibration_g}</span>
            <span className="text-xs font-normal text-slate-500">g</span>
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 glass-panel-hover">
          <span className="text-[11px] font-medium text-slate-400 block uppercase">RGB Brightness</span>
          <span className="text-xl font-extrabold text-slate-200 mt-1 block font-mono flex items-center space-x-1">
            <Eye className="w-4 h-4 text-amber-400 inline" />
            <span>{prediction.RGB_Brightness}</span>
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 glass-panel-hover">
          <span className="text-[11px] font-medium text-slate-400 block uppercase">RGB Contrast</span>
          <span className="text-xl font-extrabold text-slate-200 mt-1 block font-mono">
            {prediction.RGB_Contrast}
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 glass-panel-hover">
          <span className="text-[11px] font-medium text-slate-400 block uppercase">Porosity</span>
          <span className={`text-xl font-extrabold mt-1 block font-mono ${prediction.Porosity_pct > 4 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {prediction.Porosity_pct} <span className="text-xs font-normal text-slate-500">%</span>
          </span>
        </div>

      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recharts Bar Chart: Melt Pool & Bead Geometry */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Geometry & Dimension Metrics Chart</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(val: any, _name: any, item: any) => [`${val} ${item.payload.unit}`, item.payload.name]}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Porosity Circular Gauge & Status */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Porosity Integrity Meter</span>
            </h3>
            <p className="text-xs text-slate-400">Target threshold: &lt; 3.0%</p>
          </div>

          <div className="my-6 flex flex-col items-center justify-center relative">
            {/* SVG Arc Gauge */}
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="60"
                stroke="#1e293b"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="60"
                stroke={prediction.Porosity_pct > 4 ? '#f43f5e' : prediction.Porosity_pct > 2 ? '#f59e0b' : '#10b981'}
                strokeWidth="12"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * Math.min(prediction.Porosity_pct, 10)) / 10}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black font-mono text-white">
                {prediction.Porosity_pct}%
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-mono mt-1">Porosity</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-xs text-slate-400">
              Status:{' '}
              <strong className={prediction.Porosity_pct > 4 ? 'text-rose-400' : 'text-emerald-400'}>
                {prediction.Porosity_pct > 4 ? 'HIGH POROSITY RISK' : 'ACCEPTABLE DENSITY'}
              </strong>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
