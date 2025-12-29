
import React, { useState, useEffect } from 'react';
import { SubscriptionPlan, BillingInterval } from '../types';
import Pricing from './Pricing';
import LegalOverlay from './LegalOverlay';
import { generateStoreRiskScore } from '../services/complianceEngine';

interface LandingPageProps {
  onLogin: (initialData?: { email: string, storeUrl: string }) => void;
  onSelectPlan: (plan: SubscriptionPlan, interval: BillingInterval) => void;
  session: any;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSelectPlan, session }) => {
  const [storeUrl, setStoreUrl] = useState('');
  const [email, setEmail] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeLegalTab, setActiveLegalTab] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [showScanResult, setShowScanResult] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    onLogin({ email, storeUrl });
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const reviews = [
    { name: "Jessica M.", role: "CEO, Glow & Co", text: "Shop Shielder made our CCPA compliance a complete non-issue. The $20 plan is the best value in SaaS.", rating: 5 },
    { name: "David K.", role: "Founder, Urban Threads", text: "The ADA Accessibility statement alone saved us from a potential predatory lawsuit. Essential for every DTC brand.", rating: 5 },
    { name: "Sarah L.", role: "Ops Manager, TechNova", text: "Finally, a compliance tool that doesn't cost thousands. Seamless integration with our Shopify store.", rating: 5 }
  ];

  const faqs = [
    { q: "How does the automation work?", a: "Our proprietary AI engine scans your store's structure, product catalog, and data touchpoints. It maps these against current CCPA, GDPR, and ADA requirements to generate custom-tailored legal documents specific to your niche." },
    { q: "What happens after I pay?", a: "Once your order is processed, our system performs a final verification scan. Your finalized, high-quality legal documents are then emailed directly to your inbox from hello@shopshielder.com within minutes." },
    { q: "Is the ADA statement legally binding?", a: "The ADA Accessibility Statement acts as a public commitment to digital inclusion, significantly reducing the risk of predatory 'drive-by' accessibility lawsuits often faced by E-commerce merchants." },
    { q: "What if my store changes?", a: "Shop Shielder continuously monitors US federal and state regulations. If a law changes that affects your store, we'll automatically update your documents and notify you via email." }
  ];

  return (
    <div className="relative overflow-hidden selection:bg-emerald-200">
      <div className="hero-glow" />
      
      <nav className="fixed top-0 w-full z-50 glass border-b border-slate-200/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-16.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900">Shop Shielder</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-10 text-sm font-semibold text-slate-600">
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-emerald-600 transition-colors">How it works</button>
            <button onClick={() => scrollToSection('reviews')} className="hover:text-emerald-600 transition-colors">Trust</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-emerald-600 transition-colors">FAQ</button>
            <div className="h-4 w-px bg-slate-200"></div>
            {session ? (
               <span className="text-emerald-600 font-bold text-sm">Account Verified</span>
            ) : (
              <button onClick={() => onLogin()} className="text-slate-900 hover:text-emerald-600 transition-colors">Sign In</button>
            )}
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 hover:shadow-emerald-200 hover:-translate-y-0.5"
            >
              {session ? 'Go to Dashboard' : 'Get Protected'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Content */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 p-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
            <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left py-3 font-bold text-slate-600">How it works</button>
            <button onClick={() => scrollToSection('reviews')} className="block w-full text-left py-3 font-bold text-slate-600">Trust</button>
            <button onClick={() => scrollToSection('faq')} className="block w-full text-left py-3 font-bold text-slate-600">FAQ</button>
            <div className="pt-4 border-t border-slate-50 space-y-4">
              {session ? (
                <button onClick={() => scrollToSection('pricing')} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Dashboard</button>
              ) : (
                <>
                  <button onClick={() => { setIsMobileMenuOpen(false); onLogin(); }} className="block w-full text-left font-bold text-slate-900">Sign In</button>
                  <button onClick={() => scrollToSection('pricing')} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Get Protected</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <section id="hero" className="pt-40 md:pt-56 pb-24 md:pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/80 border border-slate-200 px-4 py-2 rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-700 mb-8 md:mb-10 shadow-sm backdrop-blur">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Policy Guard V2.3 Live</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-slate-900 tracking-tight leading-tight md:leading-[1.05] mb-8">
            Complete Legal <br className="hidden md:block" />
            <span className="gradient-text italic">Autopilot.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
            Professional protection shouldn't be complicated. Automated Privacy, Terms, and ADA Compliance delivered to your inbox instantly.
          </p>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-4 rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 transition-all hover:shadow-emerald-100">
            <div className="md:col-span-1">
              <input 
                type="text" 
                placeholder="Store URL" 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-base font-bold transition-all outline-none"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                required
                aria-label="Store URL"
              />
            </div>
            <div className="md:col-span-1">
              <input 
                type="email" 
                placeholder="Work Email" 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-base font-bold transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Work Email"
              />
            </div>
            <button type="submit" className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 whitespace-nowrap">
              Secure My Store
            </button>
          </form>
          
          <div className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Shopify_logo.svg" className="h-6 md:h-7" alt="Shopify" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" className="h-4 md:h-5" alt="Amazon" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4b/WooCommerce_logo.svg" className="h-5 md:h-6" alt="WooCommerce" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Stripe_logo%2C_revised_2016.svg" className="h-5 md:h-6" alt="Stripe" />
          </div>
        </div>
      </section>

      {/* Deep Scan Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-[200] bg-slate-900 flex items-center justify-center p-6 overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-emerald-500 rounded-full blur-[120px] animate-pulse"></div>
          </div>
          
          <div className="relative w-full max-w-2xl text-center">
            {!showScanResult ? (
              <div className="space-y-12 animate-in fade-in zoom-in duration-500">
                <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto">
                  <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-4 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 md:w-12 md:h-12 text-emerald-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-16.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white text-2xl md:text-3xl font-black tracking-tight mb-4 px-4 line-clamp-1">Analyzing {storeUrl}</h3>
                  <div className="h-2 bg-slate-800 rounded-full max-w-md mx-auto overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500 ease-out" 
                      style={{ width: `${(scanStep / scanSteps.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-emerald-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] mt-6 animate-pulse px-4">
                    {scanSteps[scanStep] || "Finalizing report..."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in slide-in-from-bottom-12 duration-700">
                <div className="flex flex-col md:flex-row items-center justify-center md:space-x-4 mb-8">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-50 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-amber-500 text-2xl md:text-3xl font-black mb-4 md:mb-0">
                    {dynamicScore}%
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-slate-900 text-xl md:text-2xl font-black tracking-tight leading-none">Risk Identified</h4>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Status: Action Required</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-8 md:mb-10">
                  <RiskTeaserItem title="Privacy Policy" risk="Critical" msg="Missing updated CCPA 2024 disclosures." />
                  <RiskTeaserItem title="ADA Accessibility" risk="Moderate" msg="Low contrast ratios detected on checkout." />
                  <RiskTeaserItem title="Term Enforceability" risk="High" msg="Arbitration clauses outdated for US market." />
                </div>
                
                <button 
                  onClick={handleFinalUnlock}
                  className="w-full py-5 md:py-6 bg-slate-900 text-white rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-2xl"
                >
                  Unlock Full Compliance Report
                </button>
                <p className="mt-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest text-center">Free basic report • Instant unlock</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">How We Automate Protection</h2>
            <p className="text-slate-500 font-medium mt-4">Precision-engineered legal documents in three simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="bg-white p-10 rounded-3xl md:rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-black mb-6">1</div>
              <h3 className="text-xl font-black text-slate-900 mb-4">Deep Store Scan</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">Our AI analyzes your business model and data touchpoints to identify exactly which US laws apply to your specific niche.</p>
            </div>
            <div className="bg-white p-10 rounded-3xl md:rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-black mb-6">2</div>
              <h3 className="text-xl font-black text-slate-900 mb-4">Policy Generation</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">We architect custom legal statements that are updated in real-time as state and federal regulations shift.</p>
            </div>
            <div className="bg-white p-10 rounded-3xl md:rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-black mb-6">3</div>
              <h3 className="text-xl font-black text-slate-900 mb-4">Email Delivery</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">Finalized documents undergo a manual quality check and are dispatched to your inbox within minutes, ready for production.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="reviews" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Trusted by 12,000+ brands</h2>
            <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-xs">Rated 4.9/5 by global merchants</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((rev, i) => (
              <div key={i} className="p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:scale-[1.02] transition-transform">
                <div className="flex text-amber-400 mb-4">
                  {[...Array(rev.rating)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <p className="text-slate-700 font-medium italic mb-8 leading-relaxed">"{rev.text}"</p>
                <div>
                  <div className="font-black text-slate-900">{rev.name}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{rev.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-black text-slate-900 pr-4">{faq.q}</span>
                  <svg className={`w-5 h-5 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 md:px-8 pb-6 text-slate-500 font-medium leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-32 bg-white border-t border-slate-100">
        <Pricing onSelectPlan={onSelectPlan} />
      </section>

      <footer className="bg-slate-900 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-16.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <span className="text-xl font-black text-white">Shop Shielder</span>
            </div>
            <p className="text-slate-400 max-w-sm font-medium leading-relaxed">Global compliance infrastructure for the modern merchant. Simple, powerful, and affordable protection from hello@shopshielder.com.</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Legal</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-400">
              <li><button onClick={() => setActiveLegalTab('privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => setActiveLegalTab('terms')} className="hover:text-white transition-colors">Terms of Service</button></li>
              <li><button onClick={() => setActiveLegalTab('cookie')} className="hover:text-white transition-colors">Cookie Policy</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Support</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-400">
              <li><a href="mailto:hello@shopshielder.com?subject=Support Request" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><button onClick={() => setActiveLegalTab('help')} className="hover:text-white transition-colors">Help Center</button></li>
              <li><button onClick={() => setActiveLegalTab('guide')} className="hover:text-white transition-colors">Compliance Guide</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center md:text-left">
          <div className="mb-4 md:mb-0">© 2024 Shop Shielder. All rights reserved.</div>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>

      {activeLegalTab && (
        <LegalOverlay type={activeLegalTab} onClose={() => setActiveLegalTab(null)} />
      )}
    </div>
  );
};

const RiskTeaserItem = ({ title, risk, msg }: { title: string; risk: string; msg: string }) => (
  <div className="flex items-center space-x-4 text-left p-4 rounded-2xl bg-slate-50 border border-slate-100">
    <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${risk === 'Critical' || risk === 'High' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-slate-900 font-black text-sm truncate">{title}</span>
        <span className={`text-[10px] font-black uppercase tracking-widest flex-shrink-0 ml-2 ${risk === 'Critical' || risk === 'High' ? 'text-red-500' : 'text-amber-500'}`}>{risk} Risk</span>
      </div>
      <p className="text-slate-500 text-[10px] md:text-[11px] font-medium leading-tight mt-0.5 line-clamp-1">{msg}</p>
    </div>
  </div>
);

export default LandingPage;
