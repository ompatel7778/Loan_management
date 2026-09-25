import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoanForm from './components/LoanForm';
import RiskMeter from './components/RiskMeter';
import FeatureImpact from './components/FeatureImpact';
import ModelInsights from './components/ModelInsights';
import BatchSimulator from './components/BatchSimulator';
import { predictInBrowser } from './utils/mlEngine';
import { sounds } from './utils/soundEngine';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? (import.meta.env.VITE_API_BASE_URL.endsWith('/api') ? import.meta.env.VITE_API_BASE_URL : `${import.meta.env.VITE_API_BASE_URL}/api`)
  : (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');


const DEFAULT_FORM_DATA = {
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
};

export default function App() {
  const [activeTab, setActiveTab] = useState('assessment');
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [predictionResult, setPredictionResult] = useState(null);
  const [apiConnected, setApiConnected] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [mode, setMode] = useState('browser'); // 'api' or 'browser'
  const [theme, setTheme] = useState('viper'); // 'viper', 'nordic', 'titanium', 'synthwave', 'frost', 'bloodmoon'

  // Apply theme attribute to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check Flask API health on mount
  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      if (res.ok) {
        setApiConnected(true);
      } else {
        setApiConnected(false);
      }
    } catch {
      setApiConnected(false);
    }
  };

  const toggleMode = () => {
    if (mode === 'browser') {
      if (apiConnected) {
        setMode('api');
      } else {
        checkApiHealth();
        setMode('api');
      }
    } else {
      setMode('browser');
    }
  };

  // Run prediction whenever formData or mode changes
  useEffect(() => {
    evaluateApplicant(formData);
  }, [formData, mode, apiConnected]);

  const evaluateApplicant = async (data) => {
    setIsEvaluating(true);
    if (mode === 'api' && apiConnected) {
      try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (response.ok) {
          const resJson = await response.json();
          setPredictionResult(resJson);
          setIsEvaluating(false);
          return;
        }
      } catch (err) {
        console.warn('API call failed, falling back to in-browser ML engine:', err);
      }
    }

    // In-browser fallback
    const res = predictInBrowser(data);
    setPredictionResult(res);
    setIsEvaluating(false);
  };

  const handleReset = () => {
    setFormData(DEFAULT_FORM_DATA);
  };

  const handleBatchSelectApplicant = (applicantData) => {
    setFormData({
      Age: applicantData.Age,
      Income: applicantData.Income,
      LoanAmount: applicantData.LoanAmount,
      CreditScore: applicantData.CreditScore,
      MonthsEmployed: applicantData.MonthsEmployed,
      NumCreditLines: applicantData.NumCreditLines,
      InterestRate: applicantData.InterestRate,
      LoanTerm: applicantData.LoanTerm,
      DTIRatio: applicantData.DTIRatio,
      Education: applicantData.Education,
      EmploymentType: applicantData.EmploymentType,
      MaritalStatus: applicantData.MaritalStatus,
      HasMortgage: applicantData.HasMortgage,
      HasDependents: applicantData.HasDependents,
      LoanPurpose: applicantData.LoanPurpose,
      HasCoSigner: applicantData.HasCoSigner
    });
    setActiveTab('assessment');
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans bg-cyber-grid transition-colors duration-500">
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isBackendOnline={apiConnected}
          mode={mode}
          onToggleMode={toggleMode}
          currentTheme={theme}
          onChangeTheme={setTheme}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Engine Mode Banner */}
          <div className="mb-6 px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg backdrop-blur-xl">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${mode === 'api' && apiConnected ? 'bg-emerald-400' : 'bg-lime-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${mode === 'api' && apiConnected ? 'bg-emerald-500' : 'bg-lime-500'}`}></span>
              </span>
              <span className="text-slate-300">
                Active Inference Engine:{' '}
                <strong className="text-white font-mono">
                  {mode === 'api' && apiConnected
                    ? 'Flask REST API (Live Scikit-Learn Logistic Regression Pipeline)'
                    : 'Client Standalone Vector Engine (Zero-Latency Instant Inference)'}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => { sounds.playClick(); checkApiHealth(); }}
                className="text-lime-400 hover:text-lime-300 underline cursor-pointer font-bold"
              >
                Check Backend API
              </button>
              <span className="text-slate-700">|</span>
              <span className="text-slate-400 font-mono">255,347 Records</span>
              <span className="text-slate-700">|</span>
              <span className="text-lime-400 font-bold font-mono">ROC-AUC: 0.753</span>
            </div>
          </div>

          {/* Tab 1: Live Interactive Loan Assessment */}
          {activeTab === 'assessment' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Multi-Factor Form */}
              <div className="lg:col-span-7">
                <LoanForm
                  formData={formData}
                  setFormData={setFormData}
                  onPredict={() => evaluateApplicant(formData)}
                  isLoading={isEvaluating}
                  onReset={handleReset}
                />
              </div>

              {/* Right Column: AI Risk Meter & Quick Factor Impact */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                <RiskMeter
                  predictionData={predictionResult}
                  formData={formData}
                  setFormData={setFormData}
                />

                {predictionResult && (
                  <FeatureImpact predictionData={predictionResult} />
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Explainable AI (XAI) Factor Attribution */}
          {activeTab === 'explainability' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <FeatureImpact predictionData={predictionResult} />
            </div>
          )}

          {/* Tab 3: Model Performance & Architecture Insights */}
          {activeTab === 'insights' && (
            <ModelInsights />
          )}

          {/* Tab 4: Batch Portfolio Simulator */}
          {activeTab === 'batch' && (
            <BatchSimulator onSelectApplicant={handleBatchSelectApplicant} />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-900 bg-slate-950/95 py-6 text-center text-xs text-slate-500 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="font-medium text-slate-400">
              LoanGuard Viper ML 3.0 &bull; Credit Risk Intelligence Cockpit
            </span>
            <div className="flex items-center gap-4 font-mono text-slate-500">
              <span>255,347 Trained Records</span>
              <span>&bull;</span>
              <span>Scikit-Learn Logistic Regression</span>
              <span>&bull;</span>
              <span className="text-lime-400 font-bold">Accuracy: 88.53%</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
