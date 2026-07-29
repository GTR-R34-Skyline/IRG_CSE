import React from 'react';
import { Cpu, Layers, Server } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-16 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-widest block mb-2">
            100% In-Browser Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Pyodide WebAssembly Engine Architecture
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Zero server dependencies. The original <code className="text-cyan-400 font-mono">WAAM_AI_Model.pkl</code> runs directly inside your browser memory using Pyodide WASM.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Direct PKL Deserialization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fetches the original <code className="text-cyan-400 font-mono">WAAM_AI_Model.pkl</code> binary file from <code className="text-cyan-400 font-mono">/model/</code> and unpickles it into WebAssembly memory using Pyodide's <code className="text-cyan-400 font-mono">joblib</code>.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Zero Backend Network Latency</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No API calls or remote server roundtrips. React forms pass input objects directly to the WebAssembly Python runtime, completing predictions instantly in browser RAM.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">In-Memory Model Caching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pyodide runtime and the <code className="text-cyan-400 font-mono">WAAMAI</code> model instance are loaded once on page load and cached globally in browser state for subsequent predictions.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
