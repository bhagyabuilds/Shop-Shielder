
import React, { useState } from 'react';
import { analyzeProductCompliance, analyzeAccessibilitySource } from '../services/geminiService';

const ComplianceAnalyzer: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'product' | 'accessibility'>('product');
  const [inputData, setInputData] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!inputData) return;
    setLoading(true);
    setResults(null);
    try {
      const data = activeMode === 'product' 
        ? await analyzeProductCompliance(inputData)
        : await analyzeAccessibilitySource(inputData);
      setResults(data);
    } catch (error) {
      console.error(error);
      alert('Analysis failed. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-black uppercase italic">Compliance Audit Hub</h2>
            <p className="text-slate-500 text-sm italic">Deep-scanning storefront endpoints for federal violations.</p>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => { setActiveMode('product'); setResults(null); setInputData(''); }}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'product' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
            >
              Product/Label Scan
            </button>
            <button 
              onClick={() => { setActiveMode('accessibility'); setResults(null); setInputData(''); }}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'accessibility' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
            >
              ADA Code Audit
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <textarea
            className="w-full h-48 p-6 rounded-3xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-mono text-xs leading-relaxed"
            placeholder={activeMode === 'product' 
              ? "Paste product descriptions, materials, or labeling claims..." 
              : "Paste HTML source code from your homepage or checkout page..."}
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          />
          
          <button
            onClick={handleAnalyze}
            disabled={loading || !inputData}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center space-x-3"
          >
            {loading ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div><span>Processing Federal Registry...</span></>
            ) : (
              <><span>Initialize Deep Audit</span><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg></>
            )}
          </button>
        </div>
      </div>

      {results && (
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-200 shadow-xl animate-in zoom-in duration-300">
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black uppercase italic">Official Audit Results</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Compliance Standard: {activeMode === 'product' ? 'FTC/CPSC' : 'WCAG 2.1 AA'}</p>
            </div>
            <div className={`px-8 py-4 rounded-2xl font-black text-2xl shadow-inner ${results.score >= 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              {results.score}% <span className="text-[10px] uppercase ml-1 opacity-60">Pass Rate</span>
            </div>
          </div>

          <div className="grid gap-6">
            {(activeMode === 'product' ? results.risks : results.issues).map((item: any, i: number) => (
              <div key={i} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-slate-300 transition-all">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                    item.severity.toLowerCase() === 'high' || item.severity.toLowerCase() === 'critical' 
                      ? 'bg-red-50 text-red-600 border-red-100' 
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {item.severity} Risk
                  </span>
                  {item.level && (
                    <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                      WCAG {item.level}
                    </span>
                  )}
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic font-mono">
                    {activeMode === 'product' ? item.category : item.element}
                  </span>
                </div>
                <div className="font-black text-slate-900 text-sm mb-4 italic leading-tight">
                  {activeMode === 'product' ? item.message : item.violation}
                </div>
                <div className="text-xs text-slate-500 font-medium leading-relaxed bg-white p-5 rounded-xl border border-slate-100">
                  <span className="text-slate-900 font-black uppercase text-[9px] tracking-widest block mb-2 underline decoration-emerald-500 decoration-2 underline-offset-4">Technical Fix Required:</span>
                  <div className="font-mono text-[11px] bg-slate-50 p-3 rounded-lg border border-slate-100 mb-2">
                    {item.fix}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceAnalyzer;
