
import React, { useState, useEffect } from 'react';
import { UserProfile, SubscriptionPlan, BillingInterval } from '../types.ts';
import ComplianceAnalyzer from './ComplianceAnalyzer.tsx';
import PolicyGenerator from './PolicyGenerator.tsx';
import ComplianceFeed from './ComplianceFeed.tsx';
import LegalOverlay from './LegalOverlay.tsx';
import DeploymentHub from './DeploymentHub.tsx';
import SettingsHub from './SettingsHub.tsx';
import SecretScanner from './SecretScanner.tsx';
import LiveComplianceOfficer from './LiveComplianceOfficer.tsx';
import Logo from './Logo.tsx';
import { generateStoreRiskScore, generateBadgeSerial } from '../services/complianceEngine.ts';
import { supabase, isConfigured } from '../services/supabase.ts';

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onUpgrade?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onUpgrade }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analyze' | 'policies' | 'deploy' | 'settings' | 'repo'>('overview');
  const [activeLegalTab, setActiveLegalTab] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState('');
  const [isShielded, setIsShielded] = useState(user.onboarded || false);
  const [lastSyncTime, setLastSyncTime] = useState('2 minutes ago');

  const isPaid = user.isPaid;
  const currentScoreValue = generateStoreRiskScore(user.storeUrl, isShielded && isPaid);
  const badgeSerial = generateBadgeSerial(user.storeUrl);

  const handleVerifyShield = async () => {
    if (!isPaid) return;
    setIsVerifying(true);
    const verificationSteps = [
      "Connecting to store endpoint...",
      "Locating Shop Shielder Serial: " + badgeSerial,
      "Validating Privacy Policy hash integrity...",
      "Syncing with Federal Law Registry...",
      "Shield Handshake Complete."
    ];
    
    for (let i = 0; i < verificationSteps.length; i++) {
      setVerifyStep(verificationSteps[i]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsShielded(true);
    setIsVerifying(false);
    
    if (isConfigured) {
      await supabase.auth.updateUser({
        data: { onboarded: true }
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row selection:bg-emerald-100">
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col shadow-sm">
        <div className="p-10 flex flex-col h-full">
          <Logo className="mb-12" size="md" />
          <nav className="space-y-2 flex-1">
            <SidebarLink icon="🏠" label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <SidebarLink icon="🛡️" label="Repo Guard" active={activeTab === 'repo'} onClick={() => setActiveTab('repo')} />
            <SidebarLink icon="🔍" label="AI Analyzer" active={activeTab === 'analyze'} onClick={() => setActiveTab('analyze')} />
            <SidebarLink icon="📄" label="Policy Engine" active={activeTab === 'policies'} onClick={() => setActiveTab('policies')} />
            <SidebarLink icon="🚀" label="Deployment" active={activeTab === 'deploy'} onClick={() => setActiveTab('deploy')} />
            <SidebarLink icon="⚙️" label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </nav>
          <button onClick={onLogout} className="mt-auto flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors px-6 py-4">
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto min-h-screen relative pb-20 lg:pb-0">
        <header className="h-20 lg:h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div>
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
              {activeTab === 'repo' ? 'Repo Guard' : activeTab}
            </h1>
            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest hidden lg:block">Store: {user.storeUrl}</p>
          </div>
          <div className="flex items-center space-x-4 lg:space-x-6">
            {!isPaid && (
              <button onClick={onUpgrade} className="bg-emerald-600 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">
                <span className="hidden sm:inline">Activate Shield</span>
                <span className="sm:hidden">Shield</span>
              </button>
            )}
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm lg:text-xl shadow-xl uppercase italic">
              {user.firstName?.[0] || 'U'}{user.lastName?.[0] || 'M'}
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto flex-1 w-full relative">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="lg:col-span-2 space-y-8">
                {/* Dynamic Security Card */}
                {!isPaid ? (
                  <div className="bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center space-x-6 relative z-10">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl shadow-inner">🔒</div>
                      <div>
                        <h4 className="font-black text-2xl tracking-tight uppercase italic leading-none">Protection Offline</h4>
                        <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">Registry License Required</p>
                      </div>
                    </div>
                    <button onClick={onUpgrade} className="bg-emerald-600 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all relative z-10">Upgrade Now</button>
                  </div>
                ) : isVerifying ? (
                  <div className="bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] text-white flex flex-col items-center justify-center space-y-6 shadow-2xl border-2 border-emerald-500/30">
                    <div className="w-16 h-16 relative">
                       <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                       <div className="absolute inset-4 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">🛡️</div>
                    </div>
                    <div className="text-center">
                       <h4 className="font-black text-xl uppercase italic">Protocol Initializing</h4>
                       <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-[0.3em] animate-pulse mt-2">{verifyStep}</p>
                    </div>
                  </div>
                ) : !isShielded ? (
                  <div className="bg-emerald-600 border border-emerald-500 p-8 lg:p-10 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center space-x-6 relative z-10">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/10 animate-bounce">⚡</div>
                      <div>
                        <h4 className="font-black text-2xl tracking-tight uppercase italic leading-none">License Validated</h4>
                        <p className="text-emerald-50 text-sm font-medium opacity-90 mt-1 italic">Ready to secure your storefront.</p>
                      </div>
                    </div>
                    <button onClick={handleVerifyShield} className="bg-white text-emerald-900 px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl relative z-10">Secure My Store</button>
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                  </div>
                ) : (
                  <div className="bg-emerald-600 border border-emerald-500 p-8 lg:p-10 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center space-x-6 relative z-10">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/10">🛡️</div>
                      <div>
                        <h4 className="font-black text-2xl tracking-tight uppercase italic leading-none">Security Active</h4>
                        <p className="text-emerald-50 text-sm font-medium opacity-90 mt-1">Registry Handshake engaged.</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 bg-slate-900/40 px-4 py-2 rounded-xl border border-white/10">
                       <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                       <span className="text-[10px] font-black uppercase tracking-widest">Live Syncing</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <StatCard label="Post-Scan Health" value={`${currentScoreValue}%`} icon="🛡️" />
                   <StatCard label="Leaks Blocked" value={isShielded ? "14" : "0"} icon="🚫" />
                   <StatCard label="Active Guard" value="v2.4" icon="🤖" />
                </div>
                <ComplianceFeed />
              </div>
              <div className="space-y-8">
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl text-center">
                   <h3 className="text-xl font-black mb-2 tracking-tight uppercase italic">Compliance Trust</h3>
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-6">Serial: {badgeSerial}</div>
                   <button 
                     disabled={!isShielded}
                     className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isShielded ? 'bg-white text-slate-900 hover:bg-emerald-400 shadow-xl' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                   >
                     {isShielded ? 'Download Trust Badge' : 'Unlock After Verification'}
                   </button>
                   <p className="text-[9px] text-slate-500 mt-4 uppercase font-bold tracking-widest leading-relaxed">
                     Digital certificate for use on checkout and footer sections.
                   </p>
                </div>
                
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                   <h4 className="text-sm font-black uppercase italic mb-4">Merchant Credentials</h4>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-slate-50">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store URL</span>
                         <span className="text-[10px] font-bold text-slate-900 truncate max-w-[120px]">{user.storeUrl}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-slate-50">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan</span>
                         <span className="text-[10px] font-bold text-slate-900">{user.plan || 'Standard'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shield Status</span>
                         <span className={`text-[10px] font-bold ${isShielded ? 'text-emerald-600' : 'text-red-500'}`}>{isShielded ? 'VERIFIED' : 'PENDING'}</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'repo' && <SecretScanner />}
          {activeTab === 'analyze' && <ComplianceAnalyzer />}
          {activeTab === 'policies' && <PolicyGenerator user={user} storeName={user.storeName} isPaid={user.isPaid} onUpgrade={onUpgrade} />}
          {activeTab === 'deploy' && <DeploymentHub user={user} isPaid={user.isPaid} onUpgrade={onUpgrade} />}
          {activeTab === 'settings' && <SettingsHub user={user} />}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-200 lg:hidden flex items-center justify-around px-4 z-[60]">
        <MobileNavLink icon="🏠" label="Home" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <MobileNavLink icon="🛡️" label="Repo" active={activeTab === 'repo'} onClick={() => setActiveTab('repo')} />
        <MobileNavLink icon="📄" label="Legal" active={activeTab === 'policies'} onClick={() => setActiveTab('policies')} />
        <MobileNavLink icon="⚙️" label="More" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </nav>

      {isPaid && <LiveComplianceOfficer />}
      {activeLegalTab && <LegalOverlay type={activeLegalTab} onClose={() => setActiveLegalTab(null)} />}
    </div>
  );
};

const SidebarLink = ({ icon, label, active, onClick }: { icon: string; label: string; active?: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 ${active ? 'bg-slate-900 text-white font-black shadow-xl scale-105' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}>
    <div className="flex items-center space-x-4">
      <span className="text-xl">{icon}</span>
      <span className="uppercase text-[10px] tracking-[0.2em] font-black italic">{label}</span>
    </div>
  </button>
);

const MobileNavLink = ({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center space-y-1 transition-all ${active ? 'text-emerald-600 scale-110' : 'text-slate-400'}`}>
    <span className="text-xl">{icon}</span>
    <span className="text-[9px] font-black uppercase tracking-widest italic">{label}</span>
  </button>
);

const StatCard = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
    <div className="text-xl mb-2">{icon}</div>
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-3xl font-black tracking-tighter text-slate-900">{value}</div>
  </div>
);

export default Dashboard;
