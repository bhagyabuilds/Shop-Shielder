
import React, { useState } from 'react';
import { SubscriptionPlan, BillingInterval } from '../types';

interface CheckoutProps {
  plan: SubscriptionPlan;
  interval: BillingInterval;
  onCancel: () => void;
  onSuccess: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ plan, interval, onCancel, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const price = plan === SubscriptionPlan.STANDARD ? (interval === BillingInterval.MONTHLY ? 20 : 16) : 250; 

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => onSuccess(), 3000);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-emerald-600 flex items-center justify-center p-6 text-white text-center">
        <div className="max-w-xl animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce shadow-inner">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
          </div>
          <h2 className="text-4xl font-black mb-6 tracking-tight uppercase italic leading-none">Access Unlocked</h2>
          <p className="text-xl font-bold opacity-90 leading-relaxed italic mb-10">
            Vault activation complete. You now have full access to expert-vetted policies, PDF exports, and continuous federal law monitoring.
          </p>
          <div className="mt-12 flex items-center justify-center space-x-3 text-sm font-black uppercase tracking-widest animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Redirecting to Merchant Hub...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <div className="w-full lg:w-[45%] bg-white p-10 lg:p-24 flex flex-col justify-between border-r border-slate-200">
        <div>
          <button onClick={onCancel} className="flex items-center space-x-2 text-slate-400 hover:text-slate-900 mb-12 text-[10px] font-black uppercase tracking-widest transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
            <span>Back to Vault</span>
          </button>
          
          <div className="flex items-center space-x-2 mb-8 opacity-60">
            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-16.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <span className="font-black tracking-tighter text-slate-900 uppercase text-xs italic">Shop Shielder Premium</span>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">{plan} Merchant Shield</div>
            <div className="text-6xl font-black tracking-tighter text-slate-900">
              ${price}<span className="text-2xl text-slate-400 font-bold ml-1">/mo</span>
            </div>
            {interval === BillingInterval.YEARLY && (
              <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest inline-block border border-emerald-100 italic">
                Annual Subscription (20% off)
              </div>
            )}
          </div>

          <div className="mt-16 space-y-6">
            <div className="flex justify-between font-black text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-4">
              <span>Merchant License</span>
              <span className="text-slate-900">${price}.00</span>
            </div>
            <div className="flex justify-between font-black text-2xl text-slate-900 pt-4 uppercase italic">
              <span>Total due</span>
              <span>${price}.00</span>
            </div>
          </div>
          
          <div className="mt-10 space-y-4">
            <FeatureListItem text="Full Policy Framework Access" />
            <FeatureListItem text="Expert Human Review Suite" />
            <FeatureListItem text="PDF Document Exports" />
            <FeatureListItem text="Live Cookie Banner Integration" />
            <FeatureListItem text="24/7 Monitoring Registry" />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-50 flex items-center justify-center p-6 lg:p-24">
        <form onSubmit={handlePay} className="w-full max-w-lg bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight uppercase italic">Secure Checkout</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Merchant Payment Method</label>
              <div className="relative">
                <input required placeholder="1234 5678 1234 5678" className="w-full px-5 py-4 rounded-t-2xl bg-white border border-slate-200 focus:border-emerald-500 outline-none font-bold" />
                <div className="flex">
                  <input required placeholder="MM / YY" className="w-1/2 px-5 py-4 rounded-bl-2xl border-b border-l border-r border-slate-200 focus:border-emerald-500 outline-none font-bold" />
                  <input required placeholder="CVC" className="w-1/2 px-5 py-4 rounded-br-2xl border-b border-r border-slate-200 focus:border-emerald-500 outline-none font-bold" />
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-[9px] font-black text-slate-400 leading-relaxed uppercase tracking-widest italic">
              Note: This is a secure transaction. Dashboard access and policy downloads are provisioned instantly upon validation.
            </div>
            <button type="submit" disabled={isProcessing} className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center space-x-3">
              {isProcessing ? 'Verifying...' : 'Activate Standard Shield'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FeatureListItem = ({ text }: { text: string }) => (
  <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
    </div>
    <span>{text}</span>
  </div>
);

export default Checkout;
