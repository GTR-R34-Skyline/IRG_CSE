import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Cpu, ArrowDown, Sparkles, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium mb-6 backdrop-blur-md shadow-lg shadow-cyan-500/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>WAAM AI Industrial Digital Twin Engine</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
          >
            Wire Arc Additive <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
              Manufacturing Intelligence
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed font-normal"
          >
            Predict melt pool dimensions, bead geometry, porosity, structural quality, and edge compute hardware requirements in real-time using pre-trained multi-output Random Forest models.
          </motion.p>

          {/* Action CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#predict"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Launch Parameter Predictor</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </a>

            <a
              href="#about"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-slate-600 font-semibold text-sm transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Architecture</span>
            </a>
          </motion.div>

        </div>

        {/* Feature Grid Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-slate-800 flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">10 Regression Targets</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Melt pool area/width/length, bead geometry, build height, vibration, optical contrast & porosity.
              </p>
            </div>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-slate-800 flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Quality Classification</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Real-time bead quality evaluation categorized as Optimal, Good, Fair, or Poor.
              </p>
            </div>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-slate-800 flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-500/30 text-blue-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Edge AI Device Spec</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Automated hardware deployment recommendation (NVIDIA Jetson Xavier vs. Jetson Nano).
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
