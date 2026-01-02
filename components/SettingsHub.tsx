import React, { useState } from 'react';
import { UserProfile } from '../types.ts';
import { supabase } from '../services/supabase.ts';

interface SettingsHubProps {
  user: UserProfile;
}

const SettingsHub: React.FC<SettingsHubProps> = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [storeUrl, setStoreUrl] = useState(user.storeUrl || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { firstName, lastName, storeUrl }
      });
      if (error) throw error;
      setMsg({ type: 'success', text: 'Merchant profile updated successfully.' });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black tracking-tight uppercase italic leading-none">Settings Hub</h2>
          <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">Account v2.4</div>
        </div>

        <form onSubmit={handleUpdateProfile} className="max-w-2xl space-y-6">
          {msg && (
            <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border italic ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
              {msg.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 italic">First Name</label>
              <input 
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-bold text-sm" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 italic">Last Name</label>
              <input 
                type="text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-bold text-sm" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 italic">Verified Store URL</label>
            <input 
              type="text" 
              value={storeUrl} 
              onChange={(e) => setStoreUrl(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-bold text-sm" 
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? 'Saving Changes...' : 'Update Merchant Credentials'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-black uppercase italic mb-6">Security & Billing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Plan</div>
              <div className="text-lg font-black text-slate-900 uppercase italic mb-4">{user.plan || 'Standard Shield'}</div>
              <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline italic">Manage Subscription</button>
           </div>
           <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Password</div>
              <div className="text-lg font-black text-slate-900 uppercase italic mb-4">••••••••••••</div>
              <button className="text-[10px] font-black text-slate-900 uppercase tracking-widest hover:underline italic">Rotate Security Key</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsHub;