import React, { useState } from 'react';
import { ShieldAlert, Activity, Database, Cpu, Sparkles, Server, Laptop, Volume2, VolumeX, Palette, Zap, Check, Sun, Moon } from 'lucide-react';
import metadata from '../data/modelMetadata.json';
import { sounds } from '../utils/soundEngine';

export default function Navbar({ activeTab, setActiveTab, isBackendOnline, mode, onToggleMode, currentTheme, onChangeTheme }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const tabs = [
    { id: 'assessment', label: 'Loan Assessment', icon: ShieldAlert, badge: 'Live AI' },
    { id: 'explainability', label: 'XAI Risk Factors', icon: Sparkles, badge: 'Shap-like' },
    { id: 'insights', label: 'Model Performance', icon: Cpu, badge: '88.5%' },
    { id: 'batch', label: 'Batch Simulator', icon: Database, badge: 'Stress Test' },
  ];

  const themes = [
    { id: 'viper', name: 'Viper Acid', color: 'from-lime-400 via-emerald-500 to-green-600', desc: 'Acid Lime & Cyber Green' },
    { id: 'nordic', name: 'Nordic Aurora', color: 'from-sky-400 via-teal-400 to-indigo-500', desc: 'Polar Teal & Borealis Blue' },
    { id: 'titanium', name: 'Industrial Titanium', color: 'from-orange-500 via-amber-500 to-red-600', desc: 'Blaze Orange & Matte Carbon' },
    { id: 'synthwave', name: 'Tokyo Synthwave', color: 'from-rose-500 via-fuchsia-500 to-cyan-400', desc: 'Hot Fuchsia & Neon Cyan' },
    { id: 'frost', name: 'Frost Glass (Light)', color: 'from-indigo-600 via-sky-500 to-teal-500', desc: 'Crisp White Light Glass', icon: Sun },
    { id: 'bloodmoon', name: 'Blood Moon', color: 'from-red-500 via-rose-600 to-orange-500', desc: 'Eclipse Crimson & Charcoal' },
  ];

  const handleTabClick = (tabId) => {
    sounds.playClick();
    setActiveTab(tabId);
  };

  const handleSoundToggle = () => {
    const isEnabled = sounds.toggleSound();
    setSoundEnabled(isEnabled);
    if (isEnabled) sounds.playClick();
  };

  const metrics = metadata?.metrics;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/85 border-b border-slate-800/80 shadow-2xl">
      {/* Top Animated Pulse Status Line */}
      <div className="h-1 w-full bg-gradient-to-r from-lime-400 via-sky-400 to-rose-500 animate-shimmer" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Interactive Title */}
          <div 
            className="flex items-center space-x-3.5 cursor-pointer group"
            onClick={() => handleTabClick('assessment')}
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl theme-button-primary p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Activity className="w-5 h-5 theme-text-accent animate-pulse" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  Loan<span className="theme-text-accent">Guard</span> 
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-500/10 theme-text-accent border border-lime-500/40 shadow-sm">
                    VIPER ML 3.0
                  </span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:flex items-center gap-2">
                <span>Credit Risk Intelligence Engine</span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> 88.53% Accuracy
                </span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex space-x-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/90 shadow-inner">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'theme-button-primary text-white font-bold scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white animate-bounce' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded bg-white/20 text-white font-mono">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Audio FX, Theme Switcher & Engine Mode */}
          <div className="flex items-center space-x-2.5">
            
            {/* Audio Toggle */}
            <button
              onClick={handleSoundToggle}
              title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                soundEnabled 
                  ? 'bg-lime-500/10 border-lime-500/30 text-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.2)]' 
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Theme Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => { sounds.playClick(); setShowThemeMenu(!showThemeMenu); }}
                title="Change Color Theme & Palette"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 transition-all cursor-pointer shadow-md"
              >
                <Palette className="w-4 h-4 text-lime-400 animate-pulse" />
                <span className="text-xs font-bold hidden sm:inline">Theme Palette</span>
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl p-2.5 z-50">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1 flex items-center justify-between">
                    <span>Select Color Palette</span>
                    <span className="text-[9px] text-slate-500">6 Themes</span>
                  </div>

                  <div className="space-y-1 mt-1">
                    {themes.map(t => {
                      const isSel = currentTheme === t.id;
                      const Icon = t.icon || Moon;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            sounds.playClick();
                            onChangeTheme(t.id);
                            setShowThemeMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                            isSel 
                              ? 'bg-slate-800 text-white border border-slate-700 shadow-md' 
                              : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${t.color} shadow-sm`} />
                            <div>
                              <span className="block">{t.name}</span>
                              <span className="text-[9px] text-slate-500 font-normal">{t.desc}</span>
                            </div>
                          </span>
                          {isSel && <Check className="w-4 h-4 text-lime-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Backend Engine Switcher */}
            <button
              onClick={() => { sounds.playClick(); onToggleMode(); }}
              title={mode === 'api' ? 'Using Flask Backend API' : 'Using Standalone In-Browser Engine'}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-lime-500/40 transition-all text-slate-300 cursor-pointer shadow-md"
            >
              {mode === 'api' ? (
                <>
                  <Server className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline text-slate-400">Engine:</span>
                  <span className="text-emerald-400 font-bold">Flask API</span>
                  <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                </>
              ) : (
                <>
                  <Laptop className="w-3.5 h-3.5 text-lime-400" />
                  <span className="hidden sm:inline text-slate-400">Engine:</span>
                  <span className="text-lime-400 font-bold">Browser Vector</span>
                  <span className="w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_#a3e635]"></span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden space-x-1.5 pb-3 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  isActive
                    ? 'theme-button-primary text-white font-bold shadow-md'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
