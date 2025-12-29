
import React, { useState } from 'react';
import { generatePrivacyPolicy } from '../services/geminiService';

interface PolicyGeneratorProps {
  storeName: string;
}

const PolicyGenerator: React.FC<PolicyGeneratorProps> = ({ storeName }) => {
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [policy, setPolicy] = useState('');
  const [selectedType, setSelectedType] = useState('Privacy Policy');

  const types = [
    'Privacy Policy (CCPA/GDPR)',
    'Terms of Service',
    'Return & Refund Policy',
    'ADA Accessibility Statement'
  ];

  const handleGenerate = async () => {
    if (!details) return;
    setLoading(true);
    try {
      const result = await generatePrivacyPolicy(`Type: ${selectedType}. Store: ${storeName}. Context: ${details}`);
      setPolicy(result);
    } catch (error) {
      console.error(error);
      alert('Generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-black mb-4 tracking-tight">AI Policy Engine</h2>
        <p className="text-slate-500 mb-8 text-sm font-medium leading-relaxed">Select the policy type and provide minimal details. Our AI generates legally-aligned drafts for US and International compliance.</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Policy Type</label>
            <div className="grid grid-cols-2 gap-3">
              {types.map(t => (
                <button 
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedType === t ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-emerald-500 hover:text-emerald-600'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Context Details</label>
            <textarea
              className="w-full h-32 p-5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 text-sm font-medium"
              placeholder={`Enter specific details for your ${selectedType}...`}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !details}
            className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-xl shadow-emerald-100"
          >
            {loading ? 'Processing Draft...' : `Generate ${selectedType.split(' ')[0]}`}
          </button>
        </div>
      </div>

      {policy && (
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm animate-in zoom-in duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Draft Preview: {selectedType}</h3>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(policy);
                alert('Copied to clipboard!');
              }}
              className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors"
            >
              Copy Policy
            </button>
          </div>
          <div className="prose prose-sm max-w-none bg-slate-50 p-8 rounded-3xl border border-slate-100 h-[32rem] overflow-y-auto font-mono text-xs whitespace-pre-wrap leading-loose">
            {policy}
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyGenerator;
