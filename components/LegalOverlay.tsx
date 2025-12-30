
import React from 'react';

interface LegalOverlayProps {
  type: string;
  onClose: () => void;
}

const LegalOverlay: React.FC<LegalOverlayProps> = ({ type, onClose }) => {
  const contentMap: Record<string, { title: string; body: string }> = {
    privacy: {
      title: "Privacy Policy",
      body: "Our Privacy Policy outlines how Shop Shielder collects, uses, and protects your data in accordance with CCPA and GDPR frameworks. Our scanning algorithms and policy templates are built to ensure technical alignment with current federal statutes, with manual oversight for complex data-sharing disclosures."
    },
    terms: {
      title: "Terms of Service",
      body: "By using Shop Shielder, you agree to our automated compliance auditing terms. All generated documentation is based on proprietary templates designed for high-volume E-commerce and built upon expert legal frameworks. Our team provides an additional layer of manual review for all high-risk storefronts."
    },
    cookie: {
      title: "Cookie Policy",
      body: "We use essential cookies to maintain your dashboard session and performance cookies to improve our AI generation speed. All tracking disclosures generated for your store are designed to meet current transparency requirements and are verified against live cookie scans."
    },
    help: {
      title: "Help Center",
      body: "Need help? Reach out to hello@shopshielder.com. Our typical response time is under 2 hours for Premium members. Our compliance team is ready to assist with any technical or document configuration inquiries involving manual edge-cases."
    },
    guide: {
      title: "How Shop Shielder Works",
      body: "Shop Shielder is a hybrid compliance-as-a-service platform. We begin with a deterministic store scan to identify risks. Our AI then utilizes proprietary templates to generate bespoke policies. Crucially, before final dispatch, a compliance officer validates the AI's output to ensure contextual accuracy. Once active, our engine monitors federal law 24/7 and automatically updates your store documents with manual validation for every version release."
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
          <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
            <button onClick={onClose} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors">
              Close
            </button>
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-1"></span>
              <span>Policy Guard V2.4 + Manual Review</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalOverlay;
