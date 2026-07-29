import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PredictionForm } from './components/PredictionForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { getHealth, getSchema, predictWAAM } from './services/api';
import type { HealthResponse, SchemaResponse, PredictRequest, PredictResponse } from './types/api';
import { CheckCircle2, X } from 'lucide-react';

export const App: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [schema, setSchema] = useState<SchemaResponse | null>(null);
  const [loadingSchema, setLoadingSchema] = useState<boolean>(true);
  const [prediction, setPrediction] = useState<PredictResponse | null>(null);
  const [lastInputs, setLastInputs] = useState<PredictRequest | null>(null);
  const [predicting, setPredicting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial load: check health & fetch dynamic schema
  useEffect(() => {
    const init = async () => {
      try {
        setLoadingSchema(true);
        const healthData = await getHealth();
        setHealth(healthData);

        const schemaData = await getSchema();
        setSchema(schemaData);
        setError(null);
      } catch (err: any) {
        console.error("Initialization error:", err);
        setError(err?.response?.data?.detail || "Could not connect to FastAPI backend on http://127.0.0.1:8000");
      } finally {
        setLoadingSchema(false);
      }
    };

    init();
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
      const res = await predictWAAM(formData);
      setPrediction(res);
      setLastInputs(formData);
      showNotification("WAAM AI prediction calculated successfully!");
      
      // Smooth scroll to results
      setTimeout(() => {
        const el = document.getElementById('dashboard');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error("Prediction error:", err);
      const errMsg = err?.response?.data?.detail || "Failed to execute prediction. Please verify backend is running.";
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
      <Navbar health={health} loading={loadingSchema} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <Hero />

        {/* Form and Predictor Section */}
        <div className="grid grid-cols-1 gap-12">
          <PredictionForm
            schema={schema}
            loadingSchema={loadingSchema}
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

        {/* Architecture Section */}
        <About />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
