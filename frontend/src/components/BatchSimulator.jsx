import React, { useState } from 'react';
import { Play, Sparkles, AlertCircle, CheckCircle2, TrendingUp, Layers, RefreshCw, Search, Download, ArrowUpDown, Eye, DollarSign, ShieldAlert } from 'lucide-react';
import { predictBatchInBrowser } from '../utils/mlEngine';
import { sounds } from '../utils/soundEngine';

export default function BatchSimulator({ onSelectApplicant }) {
  const [batchSize, setBatchSize] = useState(20);
  const [results, setResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('default_probability');
  const [sortAsc, setSortAsc] = useState(false);
  const [inspectedApplicant, setInspectedApplicant] = useState(null);

  const runSimulation = () => {
    sounds.playClick();
    setIsSimulating(true);
    setTimeout(() => {
      const simulatedData = predictBatchInBrowser(batchSize);
      setResults(simulatedData);
      setIsSimulating(false);
      sounds.playApproval();
    }, 450);
  };

  const exportCSV = () => {
    sounds.playClick();
    if (!results) return;
    const headers = ['Applicant ID', 'Income', 'CreditScore', 'LoanAmount', 'LoanTerm', 'InterestRate', 'DTIRatio', 'DefaultProbability', 'RiskTier'];
    const rows = results.map(r => [
      r.id, r.Income, r.CreditScore, r.LoanAmount, r.LoanTerm, r.InterestRate, r.DTIRatio, r.default_probability, r.risk_tier
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `loan_portfolio_batch_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredResults = results?.filter(r => {
    if (filter === 'HIGH' && r.prediction !== 1) return false;
    if (filter === 'MODERATE' && (!r.risk_tier.includes('Moderate'))) return false;
    if (filter === 'LOW' && (r.prediction === 1 || r.risk_tier.includes('Moderate'))) return false;
    if (searchTerm && !r.id.toLowerCase().includes(searchTerm.toLowerCase()) && !r.Income.toString().includes(searchTerm)) return false;
    return true;
  })?.sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  const highRiskCount = results ? results.filter(r => r.prediction === 1).length : 0;
  const defaultRate = results ? ((highRiskCount / results.length) * 100).toFixed(1) : 0;
  const totalExposure = results ? results.reduce((sum, r) => sum + r.LoanAmount, 0) : 0;
  const atRiskCapital = results ? results.filter(r => r.prediction === 1).reduce((sum, r) => sum + r.LoanAmount, 0) : 0;

  const toggleSort = (field) => {
    sounds.playClick();
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Simulation Controls Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400 animate-pulse" />
            Portfolio Batch Stress-Tester & Risk Engine
          </h2>
          <p className="text-slate-400 text-xs mt-1 max-w-xl">
            Simulate synthetic borrower cohorts across diverse credit brackets to stress-test portfolio exposure and capital at risk.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Cohort Size:</span>
            <select
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer font-mono"
            >
              <option value={10} className="bg-slate-900">10 Profiles</option>
              <option value={20} className="bg-slate-900">20 Profiles</option>
              <option value={50} className="bg-slate-900">50 Profiles</option>
              <option value={100} className="bg-slate-900">100 Profiles</option>
            </select>
          </div>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-cyan-200" />
                Simulate Portfolio
              </>
            )}
          </button>

          {results && (
            <button
              onClick={exportCSV}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Metrics Overview */}
      {results && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-3xl border border-indigo-500/30">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Simulated Cohort</span>
              <div className="text-3xl font-black text-white font-mono mt-1">{results.length} Profiles</div>
              <span className="text-[10px] text-cyan-400 font-mono">Processed in vector memory</span>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-amber-500/30">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Predicted Default Rate</span>
              <div className="text-3xl font-black text-amber-400 font-mono mt-1">{defaultRate}%</div>
              <span className="text-[10px] text-slate-400 font-mono">{highRiskCount} / {results.length} flagged high-risk</span>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-purple-500/30">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aggregate Capital Exposure</span>
              <div className="text-3xl font-black text-white font-mono mt-1">${(totalExposure / 1000).toFixed(0)}k</div>
              <span className="text-[10px] text-purple-400 font-mono">Total requested principal</span>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-rose-500/30">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Capital at Default Risk</span>
              <div className="text-3xl font-black text-rose-400 font-mono mt-1">${(atRiskCapital / 1000).toFixed(0)}k</div>
              <span className="text-[10px] text-rose-400/80 font-mono">{((atRiskCapital / (totalExposure || 1)) * 100).toFixed(1)}% of total portfolio</span>
            </div>
          </div>

          {/* Filter & Applicant Table */}
          <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {['ALL', 'HIGH', 'MODERATE', 'LOW'].map(t => (
                  <button
                    key={t}
                    onClick={() => { sounds.playClick(); setFilter(t); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      filter === t ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter applicant ID or income..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('id')}>
                      <div className="flex items-center gap-1">Applicant ID <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('Income')}>
                      <div className="flex items-center gap-1">Income / Credit <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('LoanAmount')}>
                      <div className="flex items-center gap-1">Loan Amount <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="px-4 py-3">DTI / Term</th>
                    <th className="px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('default_probability')}>
                      <div className="flex items-center gap-1">Default Risk <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="px-4 py-3">Risk Tier</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredResults.map((r, i) => {
                    const isHigh = r.prediction === 1;
                    return (
                      <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-cyan-300">
                          {r.id}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-white">${r.Income.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-400 font-mono">FICO: {r.CreditScore}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-200 font-medium">
                          <div className="font-bold">${r.LoanAmount.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-400">{r.LoanTerm} mos @ {r.InterestRate}%</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-300 font-bold font-mono">{(r.DTIRatio * 100).toFixed(0)}% DTI</div>
                          <div className="text-[10px] text-slate-400">{r.EmploymentType}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  r.default_probability > 50
                                    ? 'bg-rose-500'
                                    : r.default_probability > 20
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${r.default_probability}%` }}
                              />
                            </div>
                            <span className="font-mono font-bold text-white">
                              {r.default_probability.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            isHigh
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : r.default_probability > 20
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}>
                            {r.risk_tier}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => { sounds.playClick(); onSelectApplicant(r); }}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-800 hover:border-cyan-500"
                          >
                            Inspect &rarr;
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Initial Empty State */}
      {!results && (
        <div className="glass-panel p-12 rounded-3xl border border-dashed border-indigo-500/30 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 animate-bounce">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Generate Instant Cohort Simulation</h3>
          <p className="text-slate-400 text-xs max-w-md mt-1 mb-6">
            Click simulate to execute standalone batch inferences across synthetic credit profiles and review portfolio distribution.
          </p>
          <button
            onClick={runSimulation}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Launch 20-Applicant Test Run
          </button>
        </div>
      )}
    </div>
  );
}
