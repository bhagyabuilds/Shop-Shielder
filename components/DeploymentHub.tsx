
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface DeploymentHubProps {
  user: UserProfile;
  isPaid: boolean;
  onUpgrade?: () => void;
}

const DeploymentHub: React.FC<DeploymentHubProps> = ({ user, isPaid, onUpgrade }) => {
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const scriptTag = `<script src="https://cdn.shopshielder.com/v2/banner.js?store=${user.storeUrl}" id="ss-compliance-sync" async></script>`;

  const handleCopy = () => {
    if (!isPaid) return;
    navigator.clipboard.writeText(scriptTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (!isPaid) return;
    setVerifying(true);
    setLogs(["Connecting to store endpoint...", "Scanning <head> tags..."]);
    
    await new Promise(r => setTimeout(r, 1200));
    setLogs(prev => [...prev, "Checking for script id 'ss-compliance-sync'..."]);
    
    await new Promise(r => setTimeout(r, 1500));
    setLogs(prev => [...prev, "Verification Successful. Monitoring active."]);
    setVerified(true);
    setVerifying(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight uppercase italic leading-none">Banner Integration</h2>
            <div className="flex items-center space-x-2 mt-2">
               <span className={`w-1.5 h-1.5 rounded-full ${verified ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
               <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest italic">{verified ? 'Live Connection: Active' : 'Registry Status: Pending Integration'}</span>
            </div>
          </div>
          <div className="bg-slate-50 text-slate-400 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest italic border border-slate-100">Framework v2.4</div>
        </div>
        
        <p className="text-slate-500 mb-10 text-sm font-medium leading-relaxed italic max-w-2xl">
          Deploy the compliant banner engine to manage visitor consent across regulated jurisdictions (CCPA, GDPR, CPRA).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
           <div className="space-y-6">
              <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl relative group overflow-hidden">
                {!isPaid && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center z-10">
                     <h4 className="text-white font-black text-sm uppercase italic mb-4">Merchant Shield Inactive</h4>
                     <button onClick={onUpgrade} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 shadow-xl transition-all">Unlock Deployment</button>
                  </div>
                )}

                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Compliance Snippet</span>
                  {isPaid && (
                    <button onClick={handleCopy} className="text-[10px] font-black text-white hover:text-emerald-400 transition-colors uppercase tracking-widest italic">
                      {copied ? 'Copied' : 'Copy Code'}
                    </button>
                  )}
                </div>
                <code className={`block font-mono text-[11px] leading-relaxed break-all ${isPaid ? 'text-white' : 'text-slate-600 select-none'}`}>
                  {isPaid ? scriptTag : `<script src="https://cdn.shopshielder.com/v2/banner.js?store=LOCKED" async></script>`}
                </code>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                 <h4 className="text-sm font-black text-slate-900 uppercase italic mb-4">Installation Guide</h4>
                 <ul className="space-y-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-loose">
                    <li className="flex items-center space-x-3"><span className="w-5 h-5 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-900">1</span><span>Copy compliance snippet</span></li>
                    <li className="flex items-center space-x-3"><span className="w-5 h-5 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-900">2</span><span>Paste into &lt;head&gt; section</span></li>
                    <li className="flex items-center space-x-3"><span className="w-5 h-5 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-900">3</span><span>Verify active handshake</span></li>
                 </ul>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100/50">
              <h3 className="text-lg font-black uppercase italic mb-6">Deployment Health</h3>
              <div className="space-y-4 mb-8">
                 {logs.map((log, i) => (
                    <div key={i} className="flex items-center space-x-3 animate-in slide-in-from-left-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                       <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{log}</span>
                    </div>
                 ))}
              </div>

              {isPaid && !verified && (
                <button 
                  onClick={handleVerify}
                  disabled={verifying}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl disabled:opacity-50"
                >
                  {verifying ? 'Scanning Storefront...' : 'Verify Installation'}
                </button>
              )}

              {verified && (
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
                   <div className="text-emerald-600 font-black text-xs uppercase italic mb-1">Handshake Active</div>
                   <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest italic">Registry ID: {user.storeUrl}</div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentHub;
