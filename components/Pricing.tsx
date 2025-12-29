
import React, { useState } from 'react';
import { SubscriptionPlan, BillingInterval } from '../types';

interface PricingProps {
  onSelectPlan: (plan: SubscriptionPlan, interval: BillingInterval) => void;
}

const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [interval, setInterval] = useState<BillingInterval>(BillingInterval.MONTHLY);

  const plans = [
    {
      id: SubscriptionPlan.STANDARD,
      name: 'Store Shield',
      price: interval === BillingInterval.MONTHLY ? 20 : 16,
      description: 'Complete compliance suite for a single E-commerce storefront.',
      features: [
        'Single Store License',
        'Privacy Policy (CCPA/GDPR)',
        'Terms of Service',
        'Return & Refund Policy',
        'ADA Accessibility Statement',
        'AI Product Compliance Scan',
        'Automated Legal Updates'
      ],
      highlight: true
    },
    {
      id: SubscriptionPlan.CUSTOM,
      name: 'Enterprise / Custom',
      price: 'Tailored',
      description: 'Bespoke legal architecture for multi-store brands and complex needs.',
      features: [
        'Multi-Store Support',
        'Everything in Store Shield',
        'White-glove AI Setup',
        'Dedicated Support Rep',
        'Custom Legal Disclosures',
        'API Compliance Monitoring'
      ],
      highlight: false
    }
  ];

  const handleAction = (planId: SubscriptionPlan) => {
    if (planId === SubscriptionPlan.CUSTOM) {
      const subject = encodeURIComponent("Custom Compliance Package Inquiry");
      const body = encodeURIComponent("Hello Shop Shielder Team,\n\nI am interested in a tailored compliance package for my business. Here are my requirements:\n\nStore URL:\nMonthly Order Volume:\nSpecific Needs:");
      window.location.href = `mailto:hello@shopshielder.com?subject=${subject}&body=${body}`;
    } else {
      onSelectPlan(planId, interval);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">One simple plan to protect your brand.</h2>
        <div className="inline-flex items-center p-1.5 bg-slate-200/50 rounded-2xl backdrop-blur">
          <button 
            onClick={() => setInterval(BillingInterval.MONTHLY)}
            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${interval === BillingInterval.MONTHLY ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setInterval(BillingInterval.YEARLY)}
            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${interval === BillingInterval.YEARLY ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Yearly <span className="text-emerald-600 font-black ml-1">-20%</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative p-10 rounded-[3rem] transition-all duration-500 flex flex-col ${
              plan.highlight 
                ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-200 -translate-y-2' 
                : 'bg-white border border-slate-200 hover:border-emerald-200 shadow-xl shadow-slate-200/50'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/30 whitespace-nowrap">
                Single Store Protection
              </div>
            )}
            <div className={`text-xs font-black uppercase tracking-[0.2em] mb-6 ${plan.highlight ? 'text-emerald-200' : 'text-emerald-600'}`}>
              {plan.name}
            </div>
            <div className="flex items-baseline mb-8">
              <span className="text-6xl font-black tracking-tighter">
                {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
              </span>
              {typeof plan.price === 'number' && (
                <span className={`text-sm font-bold ml-2 ${plan.highlight ? 'text-emerald-200' : 'text-slate-400'}`}>
                  /month
                </span>
              )}
            </div>
            <p className={`text-sm leading-relaxed mb-10 font-medium ${plan.highlight ? 'text-emerald-50' : 'text-slate-500'}`}>
              {plan.description}
            </p>
            
            <ul className="space-y-5 mb-12 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center space-x-4 text-sm font-bold">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlight ? 'bg-emerald-400/20 text-emerald-300' : 'bg-emerald-100 text-emerald-600'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="leading-tight">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleAction(plan.id)}
              className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all ${
                plan.highlight 
                  ? 'bg-white text-emerald-900 hover:bg-emerald-50 shadow-lg' 
                  : 'bg-slate-900 text-white hover:bg-emerald-600 shadow-xl shadow-slate-100'
              }`}
            >
              {plan.id === SubscriptionPlan.CUSTOM ? 'Contact Sales' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
