
import React, { useState, useEffect } from 'react';

const ComplianceFeed: React.FC = () => {
  const [updates, setUpdates] = useState([
    { id: 1, type: 'AUTO-SYNC', message: 'New CCPA v2.4 detected. Privacy policy updated and emailed to user.', time: 'Just now' },
    { id: 2, type: 'POLICY', message: 'Standard Terms of Service generated for US market.', time: '12m ago' },
    { id: 3, type: 'ADA', message: 'Accessibility statement verified for WCAG 2.1.', time: '1h ago' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const types = ['AUTO-SYNC', 'POLICY', 'SAFETY', 'ADA'];
      const msgs = [
        'Federal legal update detected. Syncing store policies...',
        'Policy v2.4.2 dispatched to user mailbox successfully.',
        'Accessibility scan: 99/100 for mobile checkout view.',
        'Privacy patch applied for 2024 California Privacy Rights.',
        'ADA font contrast check completed: Passed.'
      ];
      const selectedType = types[Math.floor(Math.random() * types.length)];
      const newUpdate = {
        id: Date.now(),
        type: selectedType,
        message: msgs[Math.floor(Math.random() * msgs.length)],
        time: 'Just now'
      };
      setUpdates(prev => [newUpdate, ...prev.slice(0, 4)]);
    }, 15000);
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
          <span>Automated Delivery</span>
        </h3>
        <button className="text-[10px] font-black uppercase text-slate-400 hover:text-emerald-600 transition-colors">History</button>
      </div>
      
      <div className="space-y-6">
        {updates.map((update) => (
          <div key={update.id} className="flex space-x-4 group animate-in slide-in-from-right-4 duration-500">
            <div className={`w-1 h-12 rounded-full flex-shrink-0 ${
              update.type === 'AUTO-SYNC' ? 'bg-emerald-500' : 
              update.type === 'POLICY' ? 'bg-blue-400' : 
              update.type === 'SAFETY' ? 'bg-red-400' : 'bg-amber-400'
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

      <div className="mt-12 p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-emerald-800 mb-1">Legal Engine</div>
          <div className="text-emerald-600 font-black text-sm">v2.4 (Active)</div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
        </div>
      </div>
    </div>
  );
};

export default ComplianceFeed;
