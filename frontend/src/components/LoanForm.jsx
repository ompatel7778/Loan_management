import React, { useState } from 'react';
import { Sparkles, Briefcase, DollarSign, CreditCard, ShieldCheck, RotateCcw, User, UserCheck, Zap, AlertCircle } from 'lucide-react';
import { sounds } from '../utils/soundEngine';

const PERSONAS = [
  {
    id: 'prime',
    name: 'Prime Executive',
    desc: '$135k Income, 790 FICO, 15% DTI',
    badge: 'Low Risk',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    data: {
      Age: 40,
      Income: 135000,
      LoanAmount: 30000,
      CreditScore: 790,
      MonthsEmployed: 84,
      NumCreditLines: 2,
      InterestRate: 5.25,
      LoanTerm: 36,
      DTIRatio: 0.15,
      Education: "Master's",
      EmploymentType: 'Full-time',
      MaritalStatus: 'Married',
      HasMortgage: 'Yes',
      HasDependents: 'Yes',
      LoanPurpose: 'Home',
      HasCoSigner: 'Yes'
    }
  },
  {
    id: 'moderate',
    name: 'Balanced Homebuyer',
    desc: '$68k Income, 665 FICO, 35% DTI',
    badge: 'Moderate Risk',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    data: {
      Age: 32,
      Income: 68000,
      LoanAmount: 25000,
      CreditScore: 665,
      MonthsEmployed: 42,
      NumCreditLines: 3,
      InterestRate: 9.5,
      LoanTerm: 48,
      DTIRatio: 0.35,
      Education: "Bachelor's",
      EmploymentType: 'Full-time',
      MaritalStatus: 'Single',
      HasMortgage: 'No',
      HasDependents: 'No',
      LoanPurpose: 'Auto',
      HasCoSigner: 'No'
    }
  },
  {
    id: 'gig_worker',
    name: 'Gig Worker / Freelancer',
    desc: '$45k Income, 620 FICO, 48% DTI',
    badge: 'Moderate-High',
    badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/40 shadow-[0_0_10px_rgba(249,115,22,0.2)]',
    data: {
      Age: 28,
      Income: 45000,
      LoanAmount: 22000,
      CreditScore: 620,
      MonthsEmployed: 20,
      NumCreditLines: 4,
      InterestRate: 14.8,
      LoanTerm: 36,
      DTIRatio: 0.48,
      Education: "Bachelor's",
      EmploymentType: 'Self-employed',
      MaritalStatus: 'Single',
      HasMortgage: 'No',
      HasDependents: 'No',
      LoanPurpose: 'Business',
      HasCoSigner: 'No'
    }
  },
  {
    id: 'subprime',
    name: 'Subprime Applicant',
    desc: '$24k Income, 490 FICO, 72% DTI',
    badge: 'High Risk',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
    data: {
      Age: 22,
      Income: 24000,
      LoanAmount: 38000,
      CreditScore: 490,
      MonthsEmployed: 8,
      NumCreditLines: 4,
      InterestRate: 21.5,
      LoanTerm: 60,
      DTIRatio: 0.72,
      Education: 'High School',
      EmploymentType: 'Unemployed',
      MaritalStatus: 'Single',
      HasMortgage: 'No',
      HasDependents: 'Yes',
      LoanPurpose: 'Other',
      HasCoSigner: 'No'
    }
  }
];

export default function LoanForm({ formData, setFormData, onPredict, isLoading, onReset }) {
  const [selectedPersona, setSelectedPersona] = useState(null);

  const handleChange = (field, value) => {
    sounds.playTick();
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyPersona = (persona) => {
    sounds.playClick();
    setSelectedPersona(persona.id);
    setFormData(persona.data);
  };

  const getCreditScoreLabel = (score) => {
    if (score >= 740) return { label: 'Exceptional (Prime)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 670) return { label: 'Good Credit', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' };
    if (score >= 580) return { label: 'Fair Credit', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'Subprime Credit', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const creditLabel = getCreditScoreLabel(formData.CreditScore || 660);

  return (
    <div className="space-y-6">
      
      {/* 1-Click Persona Quick Presets */}
      <div className="glass-panel rounded-3xl p-5 border border-cyan-500/20 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">1-Click Archetype Presets</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Auto-populates risk vectors</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PERSONAS.map(persona => {
            const isSelected = selectedPersona === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => applyPersona(persona)}
                type="button"
                className={`text-left p-3.5 rounded-2xl border transition-all duration-300 group cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-[1.02]'
                    : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                    <User className="w-3 h-3 text-cyan-400" />
                    {persona.name}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${persona.badgeClass}`}>
                    {persona.badge}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono line-clamp-1">{persona.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Form */}
      <form onSubmit={(e) => { e.preventDefault(); sounds.playClick(); if (onPredict) onPredict(); }} className="space-y-6">
        
        {/* Section 1: Financial & Employment Profile */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Employment & Financial Capacity</h3>
                <p className="text-xs text-slate-400">Borrower income stream, employment stability, and debt load</p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800">
              Section 1 of 4
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Annual Income */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-300">Annual Income ($)</label>
                <span className="text-cyan-400 font-mono font-bold text-base bg-cyan-500/10 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
                  ${Number(formData.Income || 65000).toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="15000"
                max="150000"
                step="1000"
                value={formData.Income || 65000}
                onChange={(e) => handleChange('Income', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>$15,000 (Min)</span>
                <span className="text-slate-500">Est. ${(Number(formData.Income || 65000)/12).toFixed(0)}/mo</span>
                <span>$150,000 (Max)</span>
              </div>
            </div>

            {/* Debt-to-Income (DTI) */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-300">Debt-to-Income (DTI) Ratio</label>
                <span className={`font-mono font-bold text-base px-2.5 py-0.5 rounded-lg border ${
                  formData.DTIRatio > 0.5 ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                }`}>
                  {(Number(formData.DTIRatio || 0.35) * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.01"
                value={formData.DTIRatio || 0.35}
                onChange={(e) => handleChange('DTIRatio', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>5% (Healthy)</span>
                <span className="text-slate-500">48% Benchmark</span>
                <span>95% (Extreme Risk)</span>
              </div>
            </div>

            {/* Employment Type Selector Buttons */}
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-300">Employment Classification</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {['Full-time', 'Part-time', 'Self-employed', 'Unemployed'].map(type => {
                  const isSel = formData.EmploymentType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChange('EmploymentType', type)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all duration-200 text-center cursor-pointer ${
                        isSel
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Months Employed */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 col-span-1 md:col-span-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-300">Workplace Tenure (Months Employed)</label>
                <span className="text-cyan-400 font-mono font-bold text-sm bg-cyan-500/10 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
                  {formData.MonthsEmployed || 36} mos ({((formData.MonthsEmployed || 36)/12).toFixed(1)} yrs)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                step="1"
                value={formData.MonthsEmployed || 36}
                onChange={(e) => handleChange('MonthsEmployed', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0 Mos (New Job)</span>
                <span>58 Mos (Market Avg)</span>
                <span>120 Mos (10 Years)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Loan Request Requirements */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Requested Loan Structuring</h3>
                <p className="text-xs text-slate-400">Principal amount, APR interest rate, duration, and purpose</p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-emerald-400 border border-slate-800">
              Section 2 of 4
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Loan Amount */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-300">Requested Loan Principal ($)</label>
                <span className="text-emerald-400 font-mono font-bold text-base bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                  ${Number(formData.LoanAmount || 50000).toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="250000"
                step="2500"
                value={formData.LoanAmount || 50000}
                onChange={(e) => handleChange('LoanAmount', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>$5,000</span>
                <span>$131,800 Avg</span>
                <span>$250,000</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-300">Annual Interest Rate (%)</label>
                <span className={`font-mono font-bold text-base px-2.5 py-0.5 rounded-lg border ${
                  formData.InterestRate > 15 ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                }`}>
                  {Number(formData.InterestRate || 8.5).toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="25.0"
                step="0.25"
                value={formData.InterestRate || 8.5}
                onChange={(e) => handleChange('InterestRate', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1.0% Prime</span>
                <span>13.5% Avg</span>
                <span>25.0% Subprime</span>
              </div>
            </div>

            {/* Loan Term Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Loan Duration (Months)</label>
              <div className="grid grid-cols-5 gap-2">
                {[12, 24, 36, 48, 60].map(term => {
                  const isSel = formData.LoanTerm === term;
                  return (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleChange('LoanTerm', term)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        isSel
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {term}m
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Loan Purpose Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Loan Purpose Category</label>
              <div className="grid grid-cols-5 gap-1.5">
                {['Auto', 'Business', 'Education', 'Home', 'Other'].map(p => {
                  const isSel = formData.LoanPurpose === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleChange('LoanPurpose', p)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        isSel
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Credit Profile & Demographics */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Credit History & Demographics</h3>
                <p className="text-xs text-slate-400">FICO score, active credit lines, education level, and age</p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-purple-400 border border-slate-800">
              Section 3 of 4
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Credit Score Slider with Live Badge */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 col-span-1 md:col-span-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-300">FICO Credit Score (300 - 850)</label>
                <div className="flex items-center space-x-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${creditLabel.bg} ${creditLabel.color}`}>
                    {creditLabel.label}
                  </span>
                  <span className={`font-mono font-black text-lg px-3 py-0.5 rounded-xl border bg-slate-950 ${creditLabel.color}`}>
                    {formData.CreditScore || 680}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="300"
                max="850"
                step="5"
                value={formData.CreditScore || 680}
                onChange={(e) => handleChange('CreditScore', Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>300 (Poor)</span>
                <span>580 (Fair Cutoff)</span>
                <span>670 (Good)</span>
                <span>740 (Prime)</span>
                <span>850 (Exceptional)</span>
              </div>
            </div>

            {/* Applicant Age */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-300">Applicant Age</label>
                <span className="text-purple-400 font-mono font-bold text-base bg-purple-500/10 px-2.5 py-0.5 rounded-lg border border-purple-500/30">
                  {formData.Age || 35} yrs
                </span>
              </div>
              <input
                type="range"
                min="18"
                max="75"
                step="1"
                value={formData.Age || 35}
                onChange={(e) => handleChange('Age', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-purple-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>18 yrs</span>
                <span>43 yrs Avg</span>
                <span>75 yrs</span>
              </div>
            </div>

            {/* Education Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Education Level</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['High School', "Bachelor's", "Master's", 'PhD'].map(edu => {
                  const isSel = formData.Education === edu;
                  return (
                    <button
                      key={edu}
                      type="button"
                      onClick={() => handleChange('Education', edu)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        isSel
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {edu}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Marital Status & Credit Lines */}
            <div className="grid grid-cols-2 gap-3 col-span-1 md:col-span-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Marital Status</label>
                <select
                  value={formData.MaritalStatus || 'Single'}
                  onChange={(e) => handleChange('MaritalStatus', e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-semibold focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Active Credit Lines</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map(num => {
                    const isSel = formData.NumCreditLines === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleChange('NumCreditLines', num)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                          isSel
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Collateral & Guarantees */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Collateral & Guarantees</h3>
                <p className="text-xs text-slate-400">Security mitigators, secondary guarantors, and liabilities</p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-amber-400 border border-slate-800">
              Section 4 of 4
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Existing Mortgage Toggle */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between hover:border-amber-500/40 transition-all">
              <div>
                <span className="text-xs font-bold text-slate-200 block">Existing Mortgage?</span>
                <span className="text-[11px] text-slate-400">Active property loan</span>
              </div>
              <button
                type="button"
                onClick={() => handleChange('HasMortgage', formData.HasMortgage === 'Yes' ? 'No' : 'Yes')}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  formData.HasMortgage === 'Yes' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'bg-slate-800'
                }`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  formData.HasMortgage === 'Yes' ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Has Dependents Toggle */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between hover:border-blue-500/40 transition-all">
              <div>
                <span className="text-xs font-bold text-slate-200 block">Has Dependents?</span>
                <span className="text-[11px] text-slate-400">Children / household</span>
              </div>
              <button
                type="button"
                onClick={() => handleChange('HasDependents', formData.HasDependents === 'Yes' ? 'No' : 'Yes')}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  formData.HasDependents === 'Yes' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'bg-slate-800'
                }`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  formData.HasDependents === 'Yes' ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Has Co-Signer Toggle */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between hover:border-emerald-500/40 transition-all">
              <div>
                <span className="text-xs font-bold text-slate-200 block">Co-Signer Present?</span>
                <span className="text-[11px] text-slate-400">Secondary guarantor</span>
              </div>
              <button
                type="button"
                onClick={() => handleChange('HasCoSigner', formData.HasCoSigner === 'Yes' ? 'No' : 'Yes')}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  formData.HasCoSigner === 'Yes' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-slate-800'
                }`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  formData.HasCoSigner === 'Yes' ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.01] flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer border border-cyan-400/40"
          >
            <Sparkles className="w-5 h-5 text-cyan-200 animate-pulse" />
            <span>{isLoading ? 'Computing Quantum Vector Matrix...' : 'Run Quantum ML Risk Inference'}</span>
          </button>

          <button
            type="button"
            onClick={() => { sounds.playClick(); onReset(); }}
            className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>

      </form>
    </div>
  );
}
