
import React from 'react';

interface LegalOverlayProps {
  type: string;
  onClose: () => void;
}

const LegalOverlay: React.FC<LegalOverlayProps> = ({ type, onClose }) => {
  const contentMap: Record<string, { title: string; body: string }> = {
    privacy: {
      title: "Privacy Policy",
      body: "Our Privacy Policy outlines how Shop Shielder collects, uses, and protects your data in accordance with CCPA and GDPR regulations. We use enterprise-grade encryption for all store scans and never sell your merchant data to third parties."
    },
    terms: {
      title: "Terms of Service",
      body: "By using Shop Shielder, you agree to our automated compliance auditing terms. We provide tools to assist in legal compliance but recommend a final review by your legal counsel for specific complex business cases."
    },
    cookie: {
      title: "Cookie Policy",
      body: "We use essential cookies to maintain your dashboard session and performance cookies to improve our AI generation speed. You can manage your preferences in your browser settings at any time."
    },
    help: {
      title: "Help Center",
      body: "Need help? Reach out to hello@shopshielder.com. Our typical response time is under 2 hours for Premium members. You can also find setup guides in your Dashboard under the 'Guide' tab."
    },
    guide: {
      title: "Compliance Guide",
      body: "The Shop Shielder Compliance Guide covers US E-commerce requirements including Prop 65 labeling, FTC claim substantiation, and WCAG 2.1 digital accessibility standards. New updates are pushed every Tuesday."
    }
  };

  const content = contentMap[type] || { title: "Legal", body: "Information coming soon." };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in duration-300">
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{content.title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
            </button>
          </div>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 font-medium leading-relaxed mb-6">{content.body}</p>
            <p className="text-slate-500 text-sm italic">For more detailed information, please contact us directly at <a href="mailto:hello@shopshielder.com" className="text-emerald-600 font-bold hover:underline">hello@shopshielder.com</a>.</p>
          </div>
          <div className="mt-10 pt-8 border-t border-slate-100">
            <button onClick={onClose} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalOverlay;
