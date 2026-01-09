
import React, { useState } from 'react';
import { ai } from '../services/geminiService.ts';
import { Type } from "@google/genai";
import { isConfigured } from '../services/supabase.ts';

const SecretScanner: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleScan = async () => {
    if (!input) return;
    setLoading(true);
    setResults(null);

    if (!isConfigured) {
      setTimeout(() => {
        setResults({
          leaksFound: 1,
          findings: [{
            file: '.env',
            type: 'Environment File',
            severity: 'Critical',
            description: '[DEMO MODE] Sensitive configuration file detected in source control.',
            fixCommand: `git rm --cached .env\necho ".env" >> .gitignore\ngit commit -m "Remove committed env file"`
          }]
        });
        setLoading(false);
      }, 1500);
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze the following code for committed secrets. Identify the secret type and provide a remediation git command. Input: ${input}`,
        config: {
          thinkingConfig: { thinkingBudget: 2000 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              leaksFound: { type: Type.NUMBER },
              findings: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    file: { type: Type.STRING },
                    type: { type: Type.STRING },
                    severity: { type: Type.STRING },
                    description: { type: Type.STRING },
                    fixCommand: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["leaksFound", "findings"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setResults(data);
    } catch (err) {
      console.error(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-200 shadow-sm">
        <div className="mb-8">
          <h2 className="text-xl font-black uppercase italic">Repo Guard: Secret Shield</h2>
          <p className="text-slate-500 text-sm italic">Analyze repository files for leaked credentials and committed secrets.</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <textarea
              className="w-full h-48 p-6 rounded-3xl bg-slate-900 text-emerald-400 border border-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono text-xs leading-relaxed"
              placeholder="Paste code or file lists here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="absolute top-4 right-4 text-[8px] font-black text-slate-700 uppercase tracking-widest">Security Terminal v1.0</div>
          </div>
          
          <button
            onClick={handleScan}
            disabled={loading || !input}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center space-x-3"
          >
            {loading ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div><span>Analyzing Registry...</span></>
            ) : (
              <><span>Initialize Guard Scan</span><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg></>
            )}
          </button>
        </div>
      </div>

      {results && (
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-200 shadow-xl animate-in zoom-in duration-300">
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black uppercase italic">Audit Log</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Status: {results.leaksFound > 0 ? 'Exposed' : 'Secure'}</p>
            </div>
            <div className={`px-8 py-4 rounded-2xl font-black text-2xl shadow-inner ${results.leaksFound === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {results.leaksFound} <span className="text-[10px] uppercase ml-1 opacity-60">Leaks</span>
            </div>
          </div>

          <div className="grid gap-6">
            {results.findings.map((finding: any, i: number) => (
              <div key={i} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-red-200 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {finding.severity}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{finding.type}</span>
                </div>
                <div className="font-black text-slate-900 text-sm mb-4 italic leading-tight">
                  {finding.description}
                </div>
                <div className="space-y-3">
                  <label className="text-slate-900 font-black uppercase text-[9px] tracking-widest block underline decoration-red-500 decoration-2 underline-offset-4">Remediation Protocol:</label>
                  <pre className="font-mono text-[11px] bg-slate-900 text-emerald-400 p-5 rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner">
                    {finding.fixCommand}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SecretScanner;
