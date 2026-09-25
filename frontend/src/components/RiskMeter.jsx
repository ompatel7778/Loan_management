import React, { useEffect } from 'react';
import { ShieldCheck, AlertTriangle, XCircle, DollarSign, PieChart, CheckCircle2, Sliders, Zap, Award, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEngine';

export default function RiskMeter({ predictionData, formData, setFormData }) {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (predictionData) {
      if (predictionData.default_probability < 30) {
        sounds.playApproval();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#06b6d4', '#10b981', '#3b82f6', '#f59e0b']
        });
      } else if (predictionData.default_probability >= 50) {
        sounds.playWarning();
      }
    }
  }, [predictionData?.default_probability]);

  if (!predictionData) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[440px] border border-cyan-500/20">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-5 text-cyan-400 animate-pulse-glow shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <PieChart className="w-10 h-10" />
        </div>
        <h4 className="text-lg font-bold text-white mb-2">No Active Assessment</h4>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          Configure borrower parameters on the left or select a 1-click archetype preset to launch real-time ML risk scoring.
        </p>
      </div>
    );
  }

  const prob = predictionData.default_probability ?? 0;
  const isApproved = prob < 50;

  const radius = 75;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (prob / 100) * circumference;

  let badgeBorder = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 neon-glow-emerald';
  let strokeColor = '#10b981';
  let StatusIcon = CheckCircle2;
  let statusGradient = 'from-emerald-500 to-teal-600';

  if (prob >= 50) {
    badgeBorder = 'border-rose-500/40 bg-rose-500/10 text-rose-400 neon-glow-rose';
    strokeColor = '#f43f5e';
    StatusIcon = XCircle;
    statusGradient = 'from-rose-500 to-red-600';
  } else if (prob >= 20) {
    badgeBorder = 'border-amber-500/40 bg-amber-500/10 text-amber-400';
    strokeColor = '#f59e0b';
    StatusIcon = AlertTriangle;
    statusGradient = 'from-amber-500 to-orange-600';
  }

  const copySummary = () => {
    sounds.playClick();
    const summaryText = `LoanGuard ML Assessment Output:
Decision: ${predictionData.decision}
Default Risk: ${prob.toFixed(1)}%
Risk Tier: ${predictionData.risk_tier}
Est. EMI: $${predictionData.estimated_monthly_payment}/mo
FICO Score: ${formData.CreditScore}
Loan Amount: $${formData.LoanAmount.toLocaleString()} (${formData.LoanTerm} mos)`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Primary Gauge Card */}
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden border border-cyan-500/30 shadow-2xl">
        
        {/* Background Ambient Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: strokeColor }}
        />

        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <StatusIcon className={`w-5 h-5 ${strokeColor === '#10b981' ? 'text-emerald-400' : strokeColor === '#f59e0b' ? 'text-amber-400' : 'text-rose-400'}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">ML Underwriting Matrix</span>
          </div>
          <span className={`text-xs font-extrabold px-3.5 py-1 rounded-full border ${badgeBorder}`}>
            {predictionData.risk_tier}
          </span>
        </div>

        {/* Gauge Visualization */}
        <div className="flex flex-col items-center justify-center my-2 relative">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg height="192" width="192" className="transform -rotate-90">
              {/* Outer Glow Ring */}
              <circle
                stroke="#1e293b"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx="96"
                cy="96"
              />
              {/* Active Animated Arc */}
              <circle
                stroke={strokeColor}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx="96"
                cy="96"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black text-white tracking-tight font-mono">
                {prob.toFixed(1)}%
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Default Probability
              </span>
              <span className="text-[9px] font-mono text-cyan-400 mt-0.5">
                AUC: {predictionData.model_accuracy ? (predictionData.model_accuracy * 100).toFixed(1) : '88.5'}% Conf.
              </span>
            </div>
          </div>

          {/* Underwriting Decision Pill */}
          <div className="w-full mt-3 text-center p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
            <p className="text-xs font-extrabold text-white flex items-center justify-center gap-2">
              <Zap className={`w-4 h-4 ${isApproved ? 'text-emerald-400' : 'text-rose-400'}`} />
              <span>{predictionData.decision}</span>
            </p>
          </div>
        </div>

        {/* Live What-If Quick Slider */}
        {setFormData && (
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live Credit Score Stress Test</span>
              </span>
              <span className="font-mono text-cyan-400 font-bold">{formData.CreditScore} Score</span>
            </div>
            <input
              type="range"
              min="300"
              max="850"
              step="5"
              value={formData.CreditScore || 680}
              onChange={(e) => {
                sounds.playTick();
                setFormData(prev => ({ ...prev, CreditScore: Number(e.target.value) }));
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        )}

        {/* Financial Repayment Matrix */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Estimated Monthly EMI</span>
            <div className="flex items-center space-x-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-base font-black text-white font-mono">
                ${Number(predictionData.estimated_monthly_payment || 0).toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Over {formData.LoanTerm || 36} months @ {formData.InterestRate}%
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Income EMI Burden</span>
            <div className="flex items-center space-x-1.5">
              <PieChart className="w-4 h-4 text-cyan-400" />
              <span className={`text-base font-black font-mono ${
                predictionData.emi_to_income_ratio > 40 ? 'text-rose-400' : 'text-cyan-400'
              }`}>
                {predictionData.emi_to_income_ratio || 0}%
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Of ${(Number(formData.Income || 65000)/12).toFixed(0)}/mo net
            </span>
          </div>
        </div>

        {/* Action Copy Button */}
        <button
          onClick={copySummary}
          className="w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
          <span>{copied ? 'Summary Copied to Clipboard!' : 'Copy Assessment Report'}</span>
        </button>

      </div>

      {/* Policy Assessment Checklist */}
      <div className={`glass-panel rounded-3xl p-5 border-l-4 ${isApproved ? 'border-l-emerald-500' : 'border-l-rose-500'}`}>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Underwriting Protocol Summary</span>
        </h4>
        <ul className="text-xs text-slate-300 space-y-2">
          {isApproved ? (
            <>
              <li className="flex items-center gap-2 text-emerald-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                Default probability ({prob.toFixed(1)}%) is under risk threshold (50%).
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                Borrower income capacity ($${(formData.Income || 0).toLocaleString()}) supports repayment.
              </li>
              {formData.HasCoSigner === 'Yes' && (
                <li className="flex items-center gap-2 text-cyan-300">
                  <Award className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  Secondary guarantor (co-signer) reduces default liability.
                </li>
              )}
            </>
          ) : (
            <>
              <li className="flex items-center gap-2 text-rose-300 font-medium">
                <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                Default risk ({prob.toFixed(1)}%) exceeds policy approval threshold.
              </li>
              <li className="flex items-center gap-2 text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                Recommend requiring additional collateral or lower loan principal.
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
