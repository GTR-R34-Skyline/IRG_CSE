import React from 'react';
import { Cpu, ShieldCheck, Zap } from 'lucide-react';
import type { HealthResponse } from '../types/api';

interface NavbarProps {
  health: HealthResponse | null;
  loading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ health, loading }) => {
  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Zap className="w-5 h-5 text-white animate-pulse" />
              <div className="absolute -inset-0.5 rounded-xl bg-cyan-400 blur-sm opacity-30 group-hover:opacity-100 transition duration-500"></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-wider text-white">WAAM AI</span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-mono font-semibold">
                  DIGITAL TWIN
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide font-mono uppercase">Industrial Process Analytics</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#hero" className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
              <span>Overview</span>
            </a>
            <a href="#predict" className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
              <span>Predictor</span>
            </a>
            <a href="#dashboard" className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
              <span>Analytics</span>
            </a>
            <a href="#about" className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
              <span>Architecture</span>
            </a>
          </div>

          {/* System Status Indicator */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Model Engine:</span>
              {loading ? (
                <span className="text-amber-400 font-mono animate-pulse">CONNECTING...</span>
              ) : health?.model_loaded ? (
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-badge"></span>
                  <span className="text-emerald-400 font-mono font-semibold">ONLINE v1.0</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span className="text-rose-400 font-mono">OFFLINE</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-[11px]">NVIDIA / Siemens Spec</span>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};
