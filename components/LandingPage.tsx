
import React, { useState } from 'react';
import { SubscriptionPlan, BillingInterval } from '../types';
import Pricing from './Pricing';

interface LandingPageProps {
  onLogin: () => void;
  onSelectPlan: (plan: SubscriptionPlan, interval: BillingInterval) => void;
  session: any;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSelectPlan, session }) => {
  const [storeUrl, setStoreUrl] = useState('');
  const [email, setEmail] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storeUrl.trim() && email.trim()) {
      onLogin();
    }
  };

  const reviews = [
    { name: "Jessica M.", role: "CEO, Glow & Co", text: "Shop Shielder made our CCPA compliance a complete non-issue. The $20 plan is the best value in SaaS.", rating: 5 },
    { name: "David K.", role: "Founder, Urban Threads", text: "The ADA Accessibility statement alone saved us from a potential predatory lawsuit. Essential for every DTC brand.", rating: 5 },
    { name: "Sarah L.", role: "Ops Manager, TechNova", text: "Finally, a compliance tool that doesn't cost thousands. Seamless integration with our Shopify store.", rating: 5 }
  ];

  const faqs = [
    { q: "How does the automation work?", a: "Our proprietary AI engine scans your store's structure, product catalog, and data touchpoints. It maps these against current CCPA, GDPR, and ADA requirements to generate custom-tailored legal documents specific to your niche." },
    { q: "What happens after I pay?", a: "Once your order is processed, our system performs a final verification scan. Your finalized, high-quality legal documents are then emailed directly to your inbox in multiple formats (HTML, PDF, Markdown) from hello@shopshielder.com within minutes." },
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
            <span className="text-2xl font-black tracking-tighter text-slate-900">Shop Shielder</span>
          </div>
          <div className="hidden lg:flex items-center space-x-10 text-sm font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How it works</a>
            <a href="#reviews" className="hover:text-emerald-600 transition-colors">Trust</a>
            <a href="#faq" className="hover:text-emerald-600 transition-colors">FAQ</a>
            <div className="h-4 w-px bg-slate-200"></div>
            {session ? (
               <span className="text-emerald-600 font-bold text-sm">Welcome Back</span>
            ) : (
              <button onClick={onLogin} className="text-slate-900 hover:text-emerald-600 transition-colors">Sign In</button>
            )}
            <button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} 
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 hover:shadow-emerald-200 hover:-translate-y-0.5"
            >
              {session ? 'Dashboard' : 'Get Protected'}
            </button>
          </div>
        </div>
      </nav>

      <section className="pt-48 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/80 border border-slate-200 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest text-emerald-700 mb-10 shadow-sm backdrop-blur">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Policy Guard V2.3 Live & Active</span>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8">
            Complete Legal <br />
            <span className="gradient-text italic">Autopilot.</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
            Professional protection shouldn't be complicated. Automated Privacy, Terms, and ADA Compliance delivered to your inbox instantly.
          </p>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 transition-all hover:shadow-emerald-100">
            <div className="md:col-span-1">
              <input 
                type="text" 
                placeholder="Store URL (e.g. mystore.com)" 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-base font-bold transition-all outline-none"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                required
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
              />
            </div>
            <button type="submit" className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 whitespace-nowrap">
              Secure My Store
            </button>
          </form>
          
          <div className="mt-12 flex items-center justify-center space-x-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Shopify_logo.svg" className="h-7" alt="Shopify" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" className="h-5" alt="Amazon" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4b/WooCommerce_logo.svg" className="h-6" alt="WooCommerce" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Stripe_logo%2C_revised_2016.svg" className="h-6" alt="Stripe" />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">How We Automate Your Protection</h2>
            <p className="text-slate-500 font-medium mt-4">Precision-engineered legal documents in three simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-black mb-6">1</div>
              <h3 className="text-xl font-black text-slate-900 mb-4">Deep Store Scan</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">Our AI analyzes your business model, data touchpoints, and product risks to identify exactly which US laws apply to your storefront.</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-black mb-6">2</div>
              <h3 className="text-xl font-black text-slate-900 mb-4">Policy Generation</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">We architect custom Privacy, Terms, and ADA statements that are legally bulletproof and updated in real-time as regulations shift.</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-black mb-6">3</div>
              <h3 className="text-xl font-black text-slate-900 mb-4">Email Delivery</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">Finalized documents undergo a quality check and are dispatched to your inbox from hello@shopshielder.com, ready for your store.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="reviews" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Trusted by 12,000+ brands worldwide</h2>
            <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-xs">Rated 4.9/5 by global merchants</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((rev, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:scale-[1.02] transition-transform">
                <div className="flex text-amber-400 mb-4">
                  {[...Array(rev.rating)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <p className="text-slate-700 font-medium italic mb-8 leading-relaxed">"{rev.text}"</p>
                <div>
                  <div className="font-black text-slate-900">{rev.name}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{rev.role}</div>
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
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-black text-slate-900">{faq.q}</span>
                  <svg className={`w-5 h-5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                </button>
                {openFaq === i && (
                  <div className="px-8 pb-6 text-slate-500 font-medium leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-32 bg-white">
        <Pricing onSelectPlan={onSelectPlan} />
      </section>

      <footer className="bg-slate-900 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-16.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <span className="text-xl font-black text-white">Shop Shielder</span>
            </div>
            <p className="text-slate-400 max-w-sm font-medium leading-relaxed">Global compliance infrastructure for the modern merchant. Simple, powerful, and affordable protection from hello@shopshielder.com.</p>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Legal</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Support</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-400">
              <li><a href="mailto:hello@shopshielder.com" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Compliance Guide</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          <div>© 2024 Shop Shielder. All rights reserved.</div>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
