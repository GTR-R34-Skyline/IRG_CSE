import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PredictionForm } from './components/PredictionForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { About } from './components/About';
import { Footer } from './components/Footer';
import {
  initializePyodideEngine,
  getSchemaFromPyodide,
  predictWithPyodide
} from './services/pyodideService';
import type { PyodideInitStatus } from './services/pyodideService';
import type { SchemaResponse, PredictRequest, PredictResponse } from './types/api';
import { CheckCircle2, Cpu, Sparkles, X, AlertTriangle } from 'lucide-react';

export const App: React.FC = () => {
  const [initStatus, setInitStatus] = useState<PyodideInitStatus>({
    stage: 'loading_pyodide',
    message: 'Starting in-browser WebAssembly Python runtime...',
    progress: 10,
  });
  
  const [schema, setSchema] = useState<SchemaResponse | null>(null);
  const [loadingEngine, setLoadingEngine] = useState<boolean>(true);
  const [prediction, setPrediction] = useState<PredictResponse | null>(null);
  const [lastInputs, setLastInputs] = useState<PredictRequest | null>(null);
  const [predicting, setPredicting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize Pyodide + load WAAM_AI_Model.pkl on startup
  useEffect(() => {
    const startWasmEngine = async () => {
      try {
        setLoadingEngine(true);
        setError(null);
        
        await initializePyodideEngine((status) => {
          setInitStatus(status);
        });

        const schemaData = await getSchemaFromPyodide();
        setSchema(schemaData);
        setLoadingEngine(false);
      } catch (err: any) {
        console.error("Pyodide Engine setup error:", err);
        setError(err.message || String(err));
        setLoadingEngine(false);
      }
    };

    startWasmEngine();
  }, []);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handlePredict = async (formData: PredictRequest) => {
    try {
      setPredicting(true);
      setError(null);

      // Execute prediction directly in Pyodide WASM in browser
      const res = await predictWithPyodide(formData);
      
      setPrediction(res);
      setLastInputs(formData);
      showNotification("In-Browser WASM Prediction calculated!");
      
      // Smooth scroll to results
      setTimeout(() => {
        const el = document.getElementById('dashboard');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error("Pyodide prediction error:", err);
      const errMsg = err.message || "Failed to execute in-browser Python inference.";
      setError(errMsg);
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel border border-cyan-500/40 bg-slate-900/90 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-semibold text-cyan-300 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        health={{ status: 'healthy', model_loaded: !loadingEngine && !error, version: 'Pyodide WASM 1.0' }}
        loading={loadingEngine}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <Hero />

        {/* Loading Overlay while Pyodide & Model load into browser memory */}
        {loadingEngine ? (
          <div className="glass-panel p-12 rounded-3xl border border-cyan-500/30 text-center max-w-2xl mx-auto my-8 space-y-6">
            <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Cpu className="w-8 h-8 animate-pulse text-cyan-400" />
              <Sparkles className="w-4 h-4 absolute top-1 right-1 text-amber-400 animate-spin" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Initializing In-Browser Python WASM Engine
              </h2>
              <p className="text-xs text-cyan-400 font-mono mt-2">
                {initStatus.message}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-800 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${initStatus.progress}%` }}
              ></div>
            </div>

            <p className="text-[11px] text-slate-500 font-mono">
              Loading NumPy, Pandas, Scikit-Learn, Joblib, and WAAM_AI_Model.pkl directly into browser RAM. No backend server involved.
            </p>
          </div>
        ) : error ? (
          <div className="glass-panel p-8 rounded-3xl border border-rose-500/40 bg-rose-950/20 text-center max-w-2xl mx-auto my-8">
            <div className="inline-flex p-3 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-400 mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-rose-200">Pyodide WASM Execution Failure</h3>
            <p className="text-xs text-rose-300 font-mono mt-2 p-3 rounded-xl bg-slate-950/80 border border-rose-900/50 text-left overflow-x-auto">
              {error}
            </p>
          </div>
        ) : (
          /* Form and Predictor Section */
          <div className="grid grid-cols-1 gap-12">
            <PredictionForm
              schema={schema}
              loadingSchema={loadingEngine}
              onPredict={handlePredict}
              predicting={predicting}
              error={error}
            />

            <ResultsDashboard
              prediction={prediction}
              inputs={lastInputs}
              onNotify={showNotification}
            />
          </div>
        )}

        {/* Architecture Section */}
        <About />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
