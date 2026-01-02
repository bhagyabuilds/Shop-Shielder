import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase.ts';

interface AuthModalProps {
  onClose: () => void;
  initialEmail?: string;
  initialStoreUrl?: string;
  initialMode?: 'login' | 'signup' | 'forgot' | 'reset';
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, initialEmail, initialStoreUrl, initialMode = 'login' }) => {
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

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length > 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { firstName, lastName, storeUrl, isPaid: false, onboarded: false }
          }
        });
        if (error) throw error;
        setSuccess(true);
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/#type=recovery`,
        });
        if (error) throw error;
        setSuccess(true);
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        alert("Vault Access Key rotated. Log in with your new credentials.");
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-12 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase italic leading-none">Handshake Dispatched</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-10 text-sm italic">
            Check <strong>{email}</strong> to verify your identity and unlock your compliance vault.
          </p>
          <button onClick={onClose} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Acknowledge</button>
        </div>
      </div>
    );
  }

  const strength = getPasswordStrength();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in duration-300">
        <div className="p-10 lg:p-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
                {mode === 'signup' ? 'New Vault' : mode === 'login' ? 'Merchant Login' : mode === 'forgot' ? 'Vault Recovery' : 'Key Rotation'}
              </h2>
              <p className="text-slate-500 font-medium text-[10px] uppercase tracking-widest mt-2 italic">Continuous Compliance Framework v2.4</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 italic">{error}</div>}

            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="First" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-sm" />
                <input required type="text" placeholder="Last" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-sm" />
              </div>
            )}

            {mode === 'signup' && (
              <input required type="text" value={storeUrl} onChange={e => setStoreUrl(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-sm" placeholder="store-url.com" />
            )}

            {mode !== 'reset' && (
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-sm" placeholder="Merchant Email" />
            )}

            {mode !== 'forgot' && (
              <div>
                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-sm" placeholder={mode === 'reset' ? 'New Access Key' : 'Vault Access Key'} />
                
                {(mode === 'reset' || mode === 'signup') && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400 italic">
                       <span>Vault Strength</span>
                       <span className={strength >= 75 ? 'text-emerald-500' : 'text-amber-500'}>{strength === 100 ? 'Optimal' : strength >= 50 ? 'Medium' : 'Weak'}</span>
                    </div>
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-500 ${strength >= 75 ? 'bg-emerald-500' : strength >= 50 ? 'bg-amber-500' : 'bg-red-400'}`} style={{ width: `${strength}%` }} />
                    </div>
                  </div>
                )}
                
                {mode === 'login' && <button type="button" onClick={() => setMode('forgot')} className="mt-3 text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest italic">Forgot Credentials?</button>}
              </div>
            )}

            <button disabled={loading} type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl disabled:opacity-50">
              {loading ? 'Processing Registry...' : mode === 'signup' ? 'Initiate Vault' : mode === 'login' ? 'Unlock Hub' : mode === 'forgot' ? 'Request Recovery' : 'Confirm New Key'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-8">
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-[10px] font-black text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-widest italic">
              {mode === 'signup' ? 'Authorized Merchant? Log In' : 'New Storefront? Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;