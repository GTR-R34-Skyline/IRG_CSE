import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-slate-800 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white tracking-wide">WAAM AI DIGITAL TWIN</span>
            <p className="text-[11px] text-slate-500">Wire Arc Additive Manufacturing Industrial Suite</p>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-xs text-slate-400 font-mono">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>NVIDIA &amp; Siemens NX Specs</span>
          </span>
          <span>FastAPI + Vite React TS</span>
          <span>v1.0.0 Production</span>
        </div>

      </div>
    </footer>
  );
};
