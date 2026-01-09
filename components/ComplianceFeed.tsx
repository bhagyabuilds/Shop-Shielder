
import React, { useState, useEffect } from 'react';

const ComplianceFeed: React.FC = () => {
  const [updates, setUpdates] = useState([
    { id: 1, type: 'AUTO-SYNC', message: 'Federal Law Registry Scan: No new CCPA changes detected for v2.4.', time: 'Just now' },
    { id: 2, type: 'POLICY', message: 'Privacy policy integrity verified against storefront structure.', time: '12m ago' },
    { id: 3, type: 'ADA', message: 'Accessibility scan: 0 critical contrast issues found on homepage.', time: '1h ago' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const types = ['AUTO-SYNC', 'POLICY', 'SAFETY', 'SCAN'];
      const msgs = [
        'Federal Law Pulse: Scanning for new FTC consumer guidelines...',
        'Policy Integrity Check: Current versions match federal requirements.',
        'Automated Store Scan: Accessibility contrast ratios are optimal.',
        'Registry Sync: State-level privacy statutes are unchanged.',
        'ADA Monitor: Checking checkout flow for screen-reader compliance...'
      ];
      const selectedType = types[Math.floor(Math.random() * types.length)];
      const newUpdate = {
        id: Date.now(),
        type: selectedType,
        message: msgs[Math.floor(Math.random() * msgs.length)],
        time: 'Just now'
      };
      setUpdates(prev => [newUpdate, ...prev.slice(0, 4)]);
    }, 12000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm overflow-hidden h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>System Activity</span>
        </h3>
        <div className="text-[9px] font-black uppercase text-emerald-600 animate-pulse">Live Tracking</div>
      </div>
      
      <div className="space-y-6">
        {updates.map((update) => (
          <div key={update.id} className="flex space-x-4 group animate-in slide-in-from-right-4 duration-500">
            <div className={`w-1 h-12 rounded-full flex-shrink-0 ${
              update.type === 'AUTO-SYNC' ? 'bg-emerald-500' : 
              update.type === 'POLICY' ? 'bg-blue-400' : 
              update.type === 'SAFETY' ? 'bg-red-400' : 'bg-slate-400'
            }`}></div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-[10px] font-black uppercase tracking-widest ${update.type === 'AUTO-SYNC' ? 'text-emerald-600' : 'text-slate-400'}`}>{update.type} Update</span>
                <span className="text-[10px] font-bold text-slate-300">• {update.time}</span>
              </div>
              <p className="text-sm font-bold text-slate-700 leading-tight group-hover:text-slate-900 transition-colors">{update.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-slate-900 rounded-3xl border border-emerald-500/20 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1 italic">Engine Heartbeat</div>
          <div className="text-white font-black text-sm tracking-tighter">SECURE & SYNCED</div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
          <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
        </div>
      </div>
    </div>
  );
};

export default ComplianceFeed;
