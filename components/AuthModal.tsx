import React, { useState, useEffect } from 'react';
import { supabase, isConfigured, SUPABASE_URL_VAL, API_KEY_VAL } from '../services/supabase.ts';
import { UserProfile } from '../types.ts';

interface AuthModalProps {
  onClose: () => void;
  initialEmail?: string;
  initialStoreUrl?: string;
  initialMode?: 'login' | 'signup' | 'forgot' | 'reset';
  onPreviewLogin?: (user: UserProfile) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, initialEmail, initialStoreUrl, initialMode = 'login', onPreviewLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
    if (initialStoreUrl) setStoreUrl(initialStoreUrl);
    setMode(initialMode);
  }, [initialEmail, initialStoreUrl, initialMode]);

  const triggerPreviewBypass = () => {
    if (onPreviewLogin) {
      onPreviewLogin({
        id: 'dev-' + Math.random().toString(36).substr(2, 9),
        email: email || 'demo@merchant.com',
        firstName: firstName || 'Store',
        lastName: lastName || 'Owner',
        storeUrl: storeUrl || 'demo-store.com',
        storeName: (storeUrl || 'DEMO STORE').split('.')[0].toUpperCase(),
        onboarded: false,
        isPaid: false
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Only bypass if we are CERTAIN we have no database URL
    if (!isConfigured) {
      console.warn("Vault Unconfigured: Entering Preview Mode.");
      setTimeout(() => {
        setLoading(false);
        triggerPreviewBypass();
      }, 800);
      return;
    }

    try {
      let result;
      if (mode === 'signup') {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { firstName, lastName, storeUrl, isPaid: false, onboarded: false }
          }
        });
      } else if (mode === 'login') {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else if (mode === 'forgot') {
        result = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/#type=recovery`,
        });
      } else if (mode === 'reset') {
        result = await supabase.auth.updateUser({ password });
      }

      if (result?.error) throw result.error;

      if (mode === 'signup' || mode === 'forgot') {
        setSuccess(true);
      } else if (mode === 'login') {
        onClose();
      }
    } catch (err: any) {
      console.error("Vault Handshake Failed:", err);
      setError(err.message || "The merchant registry is currently unreachable.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-12 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase italic leading-none">Registration Sent</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-10 text-sm italic">
            Please check your email <strong>{email}</strong> to verify your account and activate your compliance vault.
          </p>
          <button onClick={onClose} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Acknowledge</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in duration-300">
        <div className="p-10 lg:p-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase italic mb-6">
            {mode === 'signup' ? 'Secure Vault Registration' : mode === 'login' ? 'Merchant Registry' : 'Access Recovery'}
          </h2>

          {!isConfigured && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
              <p className="text-[10px] font-black uppercase text-amber-700 leading-tight">
                🧪 Preview Mode Active
                <span className="block mt-1 font-bold text-slate-400 normal-case italic">Vault credentials not detected. Signing up will enter a simulated merchant session.</span>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase border border-red-100 italic">
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <input required type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-sm" />
                <input required type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-sm" />
              </div>
            )}

            {mode === 'signup' && (
              <input required type="text" value={storeUrl} onChange={e => setStoreUrl(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-sm" placeholder="store-url.com" />
            )}

            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-sm" placeholder="Registry Email" />

            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-sm" placeholder="Access Key" />

            <button disabled={loading} type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl disabled:opacity-50">
              {loading ? 'Authenticating...' : isConfigured ? 'Establish Vault Access' : 'Launch Preview Mode'}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-slate-100 flex flex-col space-y-4">
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-[10px] font-black text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-widest italic">
              {mode === 'signup' ? 'Existing Merchant? Establish Access' : 'New Merchant? Open Vault'}
            </button>
            
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className={`w-1.5 h-1.5 rounded-full ${SUPABASE_URL_VAL ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Registry</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-1.5 h-1.5 rounded-full ${API_KEY_VAL ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">AI Engine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;