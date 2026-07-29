import React from 'react';
import { Cpu, Layers, Server } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-16 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-widest block mb-2">
            System Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            WAAM AI Digital Twin Architecture
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Integration specs for high-precision Wire Arc Additive Manufacturing process prediction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Output Estimators</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Consists of a 10-target Random Forest Regressor combined with twin Random Forest Classifiers for real-time weld quality scoring and edge AI hardware recommendation.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">FastAPI Async Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Model parameters are loaded into memory once during application startup. Dynamic schema reflection extracts categorical features without hardcoded frontend assumptions.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Edge AI Deployment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evaluates compute complexity per weld path, matching real-time inferencing requirements to embedded systems like NVIDIA Jetson Xavier and Jetson Nano.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
