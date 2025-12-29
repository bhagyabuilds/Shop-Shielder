
import React, { useState } from 'react';
import { analyzeProductCompliance } from '../services/geminiService';

const ComplianceAnalyzer: React.FC = () => {
  const [productInfo, setProductInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!productInfo) return;
    setLoading(true);
    try {
      const data = await analyzeProductCompliance(productInfo);
      setResults(data);
    } catch (error) {
      console.error(error);
      alert('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Analyze Your Product</h2>
        <p className="text-slate-500 mb-6 text-sm">Paste your product description, ingredients, or manufacturing details. Our AI will scan for Prop 65 warnings, FTC claim risks, and safety standards.</p>
        
        <textarea
          className="w-full h-40 p-6 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all mb-4 text-sm"
          placeholder="Example: Silicon baby teething toy made in China. BPA-free claims. 100% natural rubber..."
          value={productInfo}
          onChange={(e) => setProductInfo(e.target.value)}
        />
        
        <button
          onClick={handleAnalyze}
          disabled={loading || !productInfo}
          className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div><span>Analyzing Compliance...</span></>
          ) : (
            <><span>Start Automated Scan</span><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></>
          )}
        </button>
      </div>

      {results && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm animate-in zoom-in duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Analysis Results</h3>
            <div className={`px-4 py-2 rounded-full font-bold text-sm ${results.score >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              Safety Score: {results.score}%
            </div>
          </div>

          <div className="grid gap-6">
            {results.risks.map((risk: any, i: number) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${risk.severity === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                    {risk.severity} Risk
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{risk.category}</span>
                </div>
                <div className="font-bold text-slate-900 mb-1">{risk.message}</div>
                <div className="text-sm text-slate-500 leading-relaxed italic">Recommendation: {risk.recommendation}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceAnalyzer;
