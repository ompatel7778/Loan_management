import React, { useState } from 'react';
import { Sparkles, TrendingUp, TrendingDown, Search, Filter, ShieldCheck, HelpCircle, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { sounds } from '../utils/soundEngine';

export default function FeatureImpact({ predictionData }) {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  if (!predictionData || !predictionData.top_risk_factors) {
    return (
      <div className="glass-panel rounded-3xl p-10 text-center text-slate-400 border border-cyan-500/20 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white">No Active Feature Attribution Data</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Perform a loan default assessment first to generate Explainable AI (XAI) feature importance vectors.
        </p>
      </div>
    );
  }

  const factors = predictionData.top_risk_factors;

  const filteredFactors = factors.filter(f => {
    const isRiskIncreaser = f.direction === 'increases_risk';
    if (filter === 'INCREASE' && !isRiskIncreaser) return false;
    if (filter === 'REDUCE' && isRiskIncreaser) return false;
    if (searchTerm && !f.feature.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalRiskIncrease = factors.filter(f => f.direction === 'increases_risk').reduce((sum, f) => sum + Math.abs(f.impact), 0);
  const totalRiskReduction = factors.filter(f => f.direction !== 'increases_risk').reduce((sum, f) => sum + Math.abs(f.impact), 0);

  return (
    <div className="space-y-6">
      
      {/* Explainability Overview Banner */}
      <div className="glass-panel rounded-3xl p-6 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <span>Explainable AI (XAI) Feature Attribution</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Shapley Vector Matrix
                </span>
              </h3>
              <p className="text-xs text-slate-400 max-w-xl mt-0.5">
                Mathematical decomposition of model decision showing exact weight contributions increasing or decreasing default probability.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-rose-500/30 text-center">
              <span className="text-[10px] text-slate-400 font-medium block">Risk Push Forces</span>
              <span className="text-xs font-mono font-bold text-rose-400">+{totalRiskIncrease.toFixed(2)}</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-center">
              <span className="text-[10px] text-slate-400 font-medium block">Risk Pull Forces</span>
              <span className="text-xs font-mono font-bold text-emerald-400">-{totalRiskReduction.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Factors Card */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        
        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            {['ALL', 'INCREASE', 'REDUCE'].map(mode => {
              const isActive = filter === mode;
              return (
                <button
                  key={mode}
                  onClick={() => { sounds.playClick(); setFilter(mode); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {mode === 'ALL' ? 'All Attributes' : mode === 'INCREASE' ? '+ Risk Factors' : '- Risk Mitigators'}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search feature vector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Factors List */}
        <div className="space-y-4">
          {filteredFactors.map((f, idx) => {
            const isRiskIncreaser = f.direction === 'increases_risk';
            const impactPct = Math.min(100, Math.abs(f.impact) * 45);

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl bg-slate-900/80 border transition-all duration-300 space-y-2.5 ${
                  isRiskIncreaser
                    ? 'border-rose-500/20 hover:border-rose-500/40'
                    : 'border-emerald-500/20 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl ${isRiskIncreaser ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
                      {isRiskIncreaser ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-white block tracking-wide">
                        {f.feature.replace('_', ': ')}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Input Value: <span className="font-mono text-cyan-300 font-bold">{String(f.raw_value)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-lg border ${
                      isRiskIncreaser ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    }`}>
                      {isRiskIncreaser ? '+ Risk' : '- Risk'} ({Math.abs(f.impact).toFixed(3)})
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Weight (Beta): {f.coefficient > 0 ? '+' : ''}{f.coefficient.toFixed(3)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isRiskIncreaser 
                        ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-[0_0_10px_rgba(244,63,94,0.5)]' 
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    }`}
                    style={{ width: `${Math.max(10, impactPct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
