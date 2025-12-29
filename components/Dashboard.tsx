
import React, { useState } from 'react';
import { UserProfile, ComplianceScore, RiskItem } from '../types';
import ComplianceAnalyzer from './ComplianceAnalyzer';
import PolicyGenerator from './PolicyGenerator';
import ComplianceFeed from './ComplianceFeed';

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analyze' | 'policies' | 'settings'>('overview');
  
  const [score] = useState<ComplianceScore>({
    overall: 96,
    privacy: 98,
    accessibility: 92,
    safety: 95,
    policies: 100
  });

  return (
    <div className="min-h-screen bg-slate-50 flex selection:bg-emerald-100">
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col shadow-sm">
        <div className="p-10 flex flex-col h-full">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-16.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <span className="font-black tracking-tighter text-xl text-slate-900">Shop Shielder</span>
          </div>
          
          <nav className="space-y-2 flex-1">
            <SidebarLink icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <SidebarLink icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>} label="AI Risk Analyzer" active={activeTab === 'analyze'} onClick={() => setActiveTab('analyze')} />
            <SidebarLink icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>} label="Policy Engine" active={activeTab === 'policies'} onClick={() => setActiveTab('policies')} />
            <SidebarLink icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </nav>

          <div className="mt-auto space-y-6">
            <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                </div>
                <div className="text-xs font-black text-emerald-900 uppercase tracking-widest leading-none">Protection Active</div>
              </div>
              <p className="text-xs font-bold text-emerald-700 leading-relaxed">AI is monitoring your core policies and product safety.</p>
            </div>
            
            <button onClick={onLogout} className="text-slate-400 hover:text-red-500 flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest transition-colors w-full px-5 py-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === 'overview' ? 'Compliance Hub' : 
               activeTab === 'analyze' ? 'Product Safety Scan' : 
               activeTab === 'policies' ? 'Policy Center' : 'Store Settings'}
            </h1>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Store: {user.storeUrl}</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-black text-slate-900">{user.firstName} {user.lastName}</span>
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{user.plan}</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Protection Active</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-xl shadow-slate-200 uppercase">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto flex-1">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <StatCard label="Overall Security" value={`${score.overall}%`} trend="up" icon="🛡️" />
                  <StatCard label="Privacy Status" value={`${score.privacy}%`} trend="neutral" icon="🔏" />
                  <StatCard label="Accessibility" value={`${score.accessibility}%`} trend="up" icon="👁️" />
                  <StatCard label="Policy Health" value={`${score.policies}%`} trend="up" icon="📜" />
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl shadow-slate-200/50">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Policy Health</h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time protection status</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <PolicyStatusItem title="Privacy Policy" status="Active" date="Updated today" type="CCPA/GDPR" />
                    <PolicyStatusItem title="Terms of Service" status="Active" date="Generated recently" type="Standard" />
                    <PolicyStatusItem title="Return & Refund" status="Review" date="Action recommended" type="Custom" urgent />
                    <PolicyStatusItem title="ADA Accessibility" status="Active" date="Scanned 1h ago" type="WCAG 2.1" />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <ComplianceFeed />
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  <h3 className="text-xl font-black mb-4 relative z-10">Compliance Shield</h3>
                  <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed relative z-10">Verified protection against CCPA/GDPR and ADA Accessibility web-based legal claims.</p>
                  <button className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 hover:text-emerald-900 transition-all shadow-xl relative z-10">Download Badge</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analyze' && <ComplianceAnalyzer />}
          {activeTab === 'policies' && <PolicyGenerator storeName={user.storeName} />}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500">
              <h2 className="text-2xl font-black mb-8 tracking-tight">Account & Protection</h2>
              <div className="grid gap-8">
                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-1">Active Integration</h4>
                    <p className="text-slate-500 font-bold">Store: {user.storeUrl}</p>
                  </div>
                  <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm hover:text-red-600 transition-colors">Manage Connection</button>
                </div>
                <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-emerald-900 uppercase text-[10px] tracking-widest mb-1">Subscription</h4>
                    <p className="text-emerald-700 font-bold">${user.interval === 'YEARLY' ? '16' : '20'}/mo • {user.plan} Plan</p>
                  </div>
                  <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">Manage Billing</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="p-10 max-w-7xl mx-auto w-full border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 gap-4">
          <div className="flex space-x-8">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="mailto:hello@shopshielder.com" className="hover:text-slate-900 transition-colors">Contact</a>
          </div>
          <div>© 2024 Shop Shielder</div>
        </footer>
      </main>
    </div>
  );
};

const PolicyStatusItem = ({ title, status, date, type, urgent }: { title: string; status: string; date: string; type: string; urgent?: boolean }) => (
  <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-transparent hover:border-slate-200 hover:bg-white transition-all">
    <div className="flex items-center space-x-6">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${urgent ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-600'}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
      </div>
      <div>
        <div className="text-lg font-black text-slate-900 tracking-tight">{title} <span className="text-[10px] font-black text-slate-300 ml-2 uppercase tracking-widest">{type}</span></div>
        <div className="text-xs font-bold text-slate-400">{date}</div>
      </div>
    </div>
    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${urgent ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
      {status}
    </div>
  </div>
);

const SidebarLink = ({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 ${active ? 'bg-slate-900 text-white font-black shadow-xl' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}>
    <div className={active ? 'text-emerald-400' : 'text-slate-400'}>{icon}</div>
    <span className="uppercase text-[10px] tracking-[0.2em] font-black">{label}</span>
  </button>
);

const StatCard = ({ label, value, trend, icon }: { label: string; value: string; trend: 'up' | 'down' | 'neutral'; icon: string }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{icon}</div>
      <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>{trend === 'up' ? 'Active' : 'Stable'}</div>
    </div>
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-3xl font-black text-slate-900 tracking-tighter">{value}</div>
  </div>
);

export default Dashboard;
