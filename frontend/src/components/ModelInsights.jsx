import React, { useState } from 'react';
import { Cpu, Award, BarChart3, Database, Layers, CheckCircle, Search, Activity, Sliders, Play, Zap } from 'lucide-react';
import metadata from '../data/modelMetadata.json';
import { sounds } from '../utils/soundEngine';

export default function ModelInsights() {
  const [threshold, setThreshold] = useState(0.50);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const { metrics, training_samples, testing_samples, coefficients } = metadata;
  const sortedCoeffs = [...(coefficients || [])].sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient));

  const filteredCoeffs = sortedCoeffs.filter(c => {
    if (searchTerm && !c.feature.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedCategory === 'RISK' && c.coefficient <= 0) return false;
    if (selectedCategory === 'SAFE' && c.coefficient > 0) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <span>Machine Learning Architecture & Performance Cockpit</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Scikit-Learn Pipeline
                </span>
              </h3>
              <p className="text-xs text-slate-400 max-w-xl mt-0.5">
                Trained and validated on 255,347 real-world credit applicant profiles using Logistic Regression with Standard Scaler.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-purple-500/30 text-xs font-mono font-bold text-purple-300">
              AUC: {((metrics?.roc_auc || 0.7531) * 100).toFixed(1)}%
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-300">
              Accuracy: {((metrics?.accuracy || 0.8853) * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-3xl p-5 border border-cyan-500/30 hover:border-cyan-500/50 transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Model Accuracy Score</span>
          <span className="text-3xl font-black text-cyan-400 font-mono neon-text-cyan">
            {((metrics?.accuracy || 0.8853) * 100).toFixed(2)}%
          </span>
          <p className="text-[10px] text-slate-400 mt-1">Global prediction correctness</p>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-blue-500/30 hover:border-blue-500/50 transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">ROC-AUC Discrimination</span>
          <span className="text-3xl font-black text-blue-400 font-mono">
            {((metrics?.roc_auc || 0.7531) * 100).toFixed(2)}%
          </span>
          <p className="text-[10px] text-slate-400 mt-1">Area Under ROC Curve</p>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-purple-500/30 hover:border-purple-500/50 transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Training Corpus</span>
          <span className="text-3xl font-black text-purple-400 font-mono">
            {(training_samples || 204277).toLocaleString()}
          </span>
          <p className="text-[10px] text-slate-400 mt-1">80% Stratified Training Split</p>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-emerald-500/30 hover:border-emerald-500/50 transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Validation Holdout</span>
          <span className="text-3xl font-black text-emerald-400 font-mono">
            {(testing_samples || 51070).toLocaleString()}
          </span>
          <p className="text-[10px] text-slate-400 mt-1">20% Unseen Test Matrix</p>
        </div>
      </div>

      {/* ROC-AUC Interactive Visualizer & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ROC Curve SVG Visualization */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>ROC-AUC Discriminative Diagnostic Curve</span>
            </h4>
            <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
              AUC = 0.753
            </span>
          </div>

          <div className="relative w-full h-56 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between">
            {/* SVG ROC Plot */}
            <svg viewBox="0 0 300 150" className="w-full h-full">
              {/* Grid Lines */}
              <line x1="30" y1="20" x2="280" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="30" y1="60" x2="280" y2="60" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="30" y1="100" x2="280" y2="100" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="105" y1="10" x2="105" y2="130" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="180" y1="10" x2="180" y2="130" stroke="#1e293b" strokeDasharray="3 3" />

              {/* Diagonal Random Guessing Baseline */}
              <line x1="30" y1="130" x2="280" y2="10" stroke="#475569" strokeDasharray="4 4" strokeWidth="1.5" />

              {/* ROC Curve Path */}
              <path
                d="M 30 130 C 50 60, 100 25, 280 10"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3.5"
                className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              />

              {/* Area Shading under ROC Curve */}
              <path
                d="M 30 130 C 50 60, 100 25, 280 10 L 280 130 Z"
                fill="url(#rocGradient)"
                opacity="0.25"
              />

              <defs>
                <linearGradient id="rocGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Active Threshold Dot */}
              <circle
                cx={30 + threshold * 250}
                cy={130 - Math.pow(threshold, 0.45) * 120}
                r="6"
                fill="#38bdf8"
                stroke="#ffffff"
                strokeWidth="2"
                className="animate-ping"
              />
              <circle
                cx={30 + threshold * 250}
                cy={130 - Math.pow(threshold, 0.45) * 120}
                r="5"
                fill="#06b6d4"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </svg>

            <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
              <span>0.0 (False Pos Rate)</span>
              <span>0.5 FPR</span>
              <span>1.0 FPR</span>
            </div>
          </div>

          {/* Interactive Threshold Slider */}
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Decision Cutoff Threshold:</span>
              </span>
              <span className="font-mono font-bold text-cyan-400">{(threshold * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              value={threshold}
              onChange={(e) => { sounds.playTick(); setThreshold(Number(e.target.value)); }}
              className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Confusion Matrix Breakdown */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Confusion Matrix (Holdout Evaluation)</span>
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-center">
              <span className="text-xs text-slate-400 block mb-1 font-semibold">True Negatives (TN)</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {metrics?.confusion_matrix ? metrics.confusion_matrix[0][0].toLocaleString() : '45,100'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Correct Non-Defaults</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/30 text-center">
              <span className="text-xs text-slate-400 block mb-1 font-semibold">False Positives (FP)</span>
              <span className="text-2xl font-black text-rose-400 font-mono">
                {metrics?.confusion_matrix ? metrics.confusion_matrix[0][1].toLocaleString() : '131'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Non-default flagged</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-center">
              <span className="text-xs text-slate-400 block mb-1 font-semibold">False Negatives (FN)</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                {metrics?.confusion_matrix ? metrics.confusion_matrix[1][0].toLocaleString() : '5,720'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Defaults missed</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-center">
              <span className="text-xs text-slate-400 block mb-1 font-semibold">True Positives (TP)</span>
              <span className="text-2xl font-black text-cyan-400 font-mono">
                {metrics?.confusion_matrix ? metrics.confusion_matrix[1][1].toLocaleString() : '204'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Correct Defaults</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Beta Coefficients Table with Search */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span>Trained Model Feature Coefficients (Beta Vector Weights)</span>
          </h4>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter beta vector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-2">
          {filteredCoeffs.map((c, idx) => {
            const isIncreaser = c.coefficient > 0;
            return (
              <div key={idx} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">{c.feature}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Mean: {c.mean.toFixed(2)} | Std: {c.scale.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center space-x-2.5">
                  <span className={`text-xs font-mono font-black ${isIncreaser ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isIncreaser ? '+' : ''}{c.coefficient.toFixed(4)}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                    isIncreaser ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {isIncreaser ? '+ Risk' : '- Risk'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
