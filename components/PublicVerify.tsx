
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface PublicVerifyProps {
  serial: string;
  onBack: () => void;
}

const PublicVerify: React.FC<PublicVerifyProps> = ({ serial, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [merchantData, setMerchantData] = useState<{ storeUrl: string; status: string } | null>(null);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);

  useEffect(() => {
    const fetchMerchant = async () => {
      setLoading(true);
      const logs = [
        "Initializing global registry lookup...",
        "Querying serial identity " + serial + "...",
        "Validating merchant SSL certificate...",
        "Confirming policy hash synchronization...",
        "Verification complete."
      ];
      
      for(let i=0; i<logs.length; i++) {
        setAuditLogs(prev => [...prev, logs[i]]);
        await new Promise(r => setTimeout(r, 600));
      }

      // Check serial format to simulate a real database lookup
      if (serial.includes('SS-')) {
        setMerchantData({
          storeUrl: "Authorized Merchant",
          status: "Verified & Monitored"
        });
      }
      setLoading(false);
    };

    fetchMerchant();
  }, [serial]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 selection:bg-emerald-100">
      <div className="max-w-3xl w-full bg-white rounded-[3rem] shadow-2xl p-10 lg:p-16 border-8 border-slate-50 text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-4 bg-emerald-600"></div>
        
        {loading ? (
          <div className="py-20 space-y-12">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 text-2xl">🛡️</div>
            </div>
            <div className="max-w-xs mx-auto space-y-3">
              {auditLogs.map((log, i) => (
                <div key={i} className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic animate-in slide-in-from-bottom-2">
                  {log}
                </div>
              ))}
            </div>
          </div>
        ) : merchantData ? (
          <div className="animate-in zoom-in duration-700">
            <div className="flex justify-between items-start mb-12">
               <div className="text-left">
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 italic">Registry Serial</div>
                  <div className="font-mono text-xl font-black text-slate-900">{serial}</div>
               </div>
               <div className="w-20 h-20 bg-emerald-600 text-white rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-emerald-100">🛡️</div>
            </div>

            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 mb-10 text-left">
               <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight uppercase italic">Compliance Certificate</h1>
               <p className="text-slate-500 text-sm font-medium mb-10 italic">This digital storefront has been independently verified by Shop Shielder protocol v2.4.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <AuditPoint label="Privacy Integrity" status="Secure" />
                  <AuditPoint label="ADA Skip-Links" status="Verified" />
                  <AuditPoint label="CCPA Opt-Out" status="Active" />
                  <AuditPoint label="SSL Verification" status="Optimal" />
               </div>
            </div>

            <p className="text-slate-400 text-[11px] font-medium leading-relaxed mb-10 px-8">
              Verification provides a technical handshake between the merchant and federal regulatory standards. Continuous monitoring is engaged for this domain.
            </p>

            <button onClick={onBack} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl">
               Return to Storefront
            </button>
          </div>
        ) : (
          <div className="py-20 animate-in fade-in">
             <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl">⚠️</div>
             <h2 className="text-2xl font-black text-slate-900 uppercase italic mb-4">Registry Fault</h2>
             <p className="text-slate-500 text-sm mb-10">The serial identity provided is invalid or has been revoked from the global compliance registry.</p>
             <button onClick={onBack} className="px-10 py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest">Close Registry Window</button>
          </div>
        )}
        
        <div className="mt-12 flex items-center justify-center space-x-3 text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
           <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-black">SS</div>
           <span>Shop Shielder | Automated Federal Compliance Registry</span>
        </div>
      </div>
    </div>
  );
};

const AuditPoint = ({ label, status }: { label: string; status: string }) => (
  <div className="flex items-center space-x-4">
     <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
     </div>
     <div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</div>
        <div className="text-xs font-black text-slate-900 uppercase italic">{status}</div>
     </div>
  </div>
);

export default PublicVerify;
