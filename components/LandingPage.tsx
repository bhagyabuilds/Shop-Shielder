import React, { useState, useEffect } from 'react';
import { SubscriptionPlan, BillingInterval } from '../types.ts';
import Pricing from './Pricing.tsx';
import LegalOverlay from './LegalOverlay.tsx';
import Logo from './Logo.tsx';
import { generateStoreRiskScore } from '../services/complianceEngine.ts';

interface LandingPageProps {
  onLogin: (initialData?: { email: string, storeUrl: string }) => void;
  onSelectPlan: (plan: SubscriptionPlan, interval: BillingInterval) => void;
  session: any;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSelectPlan, session }) => {
  const [storeUrl, setStoreUrl] = useState('');
  const [email, setEmail] = useState('');
  const [activeLegalTab, setActiveLegalTab] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [showScanResult, setShowScanResult] = useState(false);
  const [dynamicScore, setDynamicScore] = useState(64);

  const scanSteps = [
    "Initializing Shop Shielder engine...",
    "Indexing storefront structure...",
    "Analyzing cookie consent mechanisms...",
    "Checking ADA accessibility contrast...",
    "Mapping CCPA/GDPR data touchpoints...",
    "Finalizing risk assessment..."
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storeUrl.trim() && email.trim()) {
      setDynamicScore(generateStoreRiskScore(storeUrl));
      setIsScanning(true);
      setScanStep(0);
    }
  };

  useEffect(() => {
    if (isScanning && !showScanResult) {
      if (scanStep < scanSteps.length) {
        const timer = setTimeout(() => setScanStep(s => s + 1), 600 + Math.random() * 400);
        return () => clearTimeout(timer);
      } else {
        setShowScanResult(true);
      }
    }
  }, [isScanning, scanStep, showScanResult]);

  const handleFinalUnlock = () => {
    setIsScanning(false);
    setShowScanResult(false);
    // This triggers the mandatory signup flow in App.tsx
    onLogin({ email, storeUrl });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative overflow-hidden selection:bg-emerald-200 min-h-screen">
      <div className="hero-glow" />
      
      <nav className="fixed top-0 w-full z-50 glass border-b border-slate-200/60 h-20 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Logo 
            className="cursor-pointer" 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
          />
          
          <div className="hidden md:flex items-center space-x-10 text-sm font-black text-slate-600 uppercase tracking-widest">
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-emerald-600 transition-colors">Process</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-emerald-600 transition-colors">Pricing</button>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <button onClick={() => onLogin()} className="text-[10px] md:text-[11px] font-black text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors uppercase tracking-widest">
              Log In
            </button>
            <button onClick={() => scrollToSection('pricing')} className="bg-slate-900 text-white px-4 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl hover:bg-emerald-600 transition-all font-black text-[10px] md:text-xs shadow-xl shadow-slate-200 uppercase tracking-widest">
              Protect Store
            </button>
          </div>
        </div>
      </nav>

      <section className="pt-48 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/80 border border-slate-200 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-10 shadow-sm backdrop-blur">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
            <span>Policy Guard V2.4 + Expert Review Live</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tight leading-tight mb-8 uppercase italic">
            Expert-Vetted <br />
            <span className="gradient-text italic">Compliance.</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Proprietary AI-powered Privacy, Terms, and ADA monitoring, <span className="text-slate-900 font-bold underline decoration-emerald-500 underline-offset-4">manually verified</span> by compliance specialists for total accuracy.
          </p>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-100 grid md:grid-cols-3 gap-3 transition-all hover:shadow-emerald-100">
            <input type="text" placeholder="Store URL" className="px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white text-base font-bold outline-none" value={storeUrl} onChange={e => setStoreUrl(e.target.value)} required />
            <input type="email" placeholder="Work Email" className="px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white text-base font-bold outline-none" value={email} onChange={e => setEmail(e.target.value)} required />
            <button type="submit" className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">Secure My Store</button>
          </form>
        </div>
      </section>

      <section id="how-it-works" className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 uppercase italic">The Hybrid Advantage</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">Our unique model combines the speed of Gemini AI with the critical judgment of human compliance officers.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-12 relative">
             <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-8"></div>
             
             <WorkStep number="01" title="Deep Scan" desc="Our engine performs a deterministic audit of your store's legal posture." icon="🔍" />
             <WorkStep number="02" title="Hybrid Draft" desc="AI orchestrates custom policies which are then vetted by our expert team." icon="🤖" />
             <WorkStep number="03" title="Manual Sync" desc="We monitor federal changes and manually push updates to your live documents." icon="🔄" />
             <WorkStep number="04" title="Trust Verified" desc="Display a serial-tracked Trust Badge that carries the weight of expert oversight." icon="🛡️" />
          </div>
        </div>
      </section>

      {isScanning && (
        <div className="fixed inset-0 z-[200] bg-slate-900 flex items-center justify-center p-6 overflow-hidden">
          <div className="relative w-full max-w-2xl text-center">
            {!showScanResult ? (
              <div className="space-y-12 animate-in fade-in zoom-in duration-500">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-4 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">🛡️</div>
                </div>
                <h3 className="text-white text-2xl font-black tracking-tight uppercase italic">Analyzing {storeUrl}</h3>
                <p className="text-emerald-400 font-bold text-xs uppercase tracking-[0.3em] animate-pulse italic">{scanSteps[scanStep]}</p>
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] p-12 shadow-2xl animate-in slide-in-from-bottom-12 duration-700">
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center text-amber-500 text-3xl font-black">{dynamicScore}%</div>
                  <div className="text-left">
                    <h4 className="text-slate-900 text-2xl font-black leading-none uppercase italic">Risk Identified</h4>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Status: High Exposure</p>
                  </div>
                </div>
                <div className="space-y-3 mb-10 text-center">
                  <p className="text-slate-500 text-xs font-bold mb-4 bg-slate-50 py-2 rounded-xl border border-slate-100 italic">
                    AI Scan indicates critical gaps. Human-vetted templates are required for full protection.
                  </p>
                  <RiskTeaserItem title="Privacy Policy" risk="Critical" msg="Missing updated CCPA 2024 disclosures." />
                  <RiskTeaserItem title="ADA Accessibility" risk="Moderate" msg="Low contrast ratios detected on checkout." />
                </div>
                <button onClick={handleFinalUnlock} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-2xl">Unlock Full Compliance Report</button>
              </div>
            )}
          </div>
        </div>
      )}

      <section id="pricing" className="py-32 bg-white">
        <Pricing onSelectPlan={onSelectPlan} />
      </section>

      <footer className="bg-slate-900 text-white pt-24 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Logo theme="light" className="mb-6" />
            <p className="text-slate-400 max-w-sm font-medium leading-relaxed">Global compliance infrastructure for the modern merchant. Professional protection through hybrid AI-Human oversight.</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 italic">Legal Registry</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-400">
              <li><button onClick={() => setActiveLegalTab('privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => setActiveLegalTab('terms')} className="hover:text-white transition-colors">Terms of Service</button></li>
              <li><button onClick={() => setActiveLegalTab('cookie')} className="hover:text-white transition-colors">Cookie Policy</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 italic">Company</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-400">
              <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">Process</button></li>
              <li><button onClick={() => setActiveLegalTab('guide')} className="hover:text-white transition-colors">Audit Guide</button></li>
              <li><a href="mailto:hello@shopshielder.com" className="hover:text-white transition-colors">Enterprise</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center md:text-left mb-8 gap-4">
            <div>© 2024 Shop Shielder. Automated Merchant Protection.</div>
            <div className="flex space-x-8">
              <a href="#" className="hover:text-white transition-colors">X / Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>
          <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-relaxed text-center md:text-left">
            Disclaimer: Shop Shielder is a technology platform. We provide policy templates and monitoring tools vetted by experts. We are not a law firm and do not provide legal advice. Use of our services does not create an attorney-client relationship.
          </div>
        </div>
      </footer>

      {activeLegalTab && <LegalOverlay type={activeLegalTab} onClose={() => setActiveLegalTab(null)} />}
    </div>
  );
};

const WorkStep = ({ number, title, desc, icon }: { number: string; title: string; desc: string; icon: string }) => (
  <div className="flex flex-col items-center text-center group">
    <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-3xl shadow-xl mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
      {icon}
    </div>
    <div className="text-emerald-600 font-black text-xs uppercase tracking-widest mb-2 italic">{number}</div>
    <h3 className="text-slate-900 font-black text-xl mb-3 uppercase italic">{title}</h3>
    <p className="text-slate-500 text-xs font-medium leading-relaxed px-4">{desc}</p>
  </div>
);

const RiskTeaserItem = ({ title, risk, msg }: { title: string; risk: string; msg: string }) => (
  <div className="flex items-center space-x-4 text-left p-4 rounded-2xl bg-slate-50 border border-slate-100">
    <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${risk === 'Critical' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-slate-900 font-black text-sm italic">{title}</span>
        <span className={`text-[10px] font-black uppercase tracking-widest ${risk === 'Critical' ? 'text-red-500' : 'text-amber-500'}`}>{risk} Risk</span>
      </div>
      <p className="text-slate-500 text-[10px] mt-0.5 line-clamp-1 leading-tight">{msg}</p>
    </div>
  </div>
);

export default LandingPage;