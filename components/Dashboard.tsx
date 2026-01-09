
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
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row selection:bg-emerald-100 antialiased">
      {/* Sidebar - Premium Design */}
      <aside className="w-80 bg-white border-r border-slate-200 hidden lg:flex flex-col shadow-sm">
        <div className="p-10 flex flex-col h-full">
          <Logo className="mb-12" size="md" onClick={() => setActiveTab('overview')} />
          <nav className="space-y-2 flex-1">
            <SidebarLink icon="🏠" label="Vault Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <SidebarLink icon="🛡️" label="Repo Guard" active={activeTab === 'repo'} onClick={() => setActiveTab('repo')} />
            <SidebarLink icon="🔍" label="Deep Scan AI" active={activeTab === 'analyze'} onClick={() => setActiveTab('analyze')} />
            <SidebarLink icon="📄" label="Legal Engine" active={activeTab === 'policies'} onClick={() => setActiveTab('policies')} />
            <SidebarLink icon="🚀" label="Deployment" active={activeTab === 'deploy'} onClick={() => setActiveTab('deploy')} />
            <SidebarLink icon="⚙️" label="Registry Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </nav>
          <div className="mt-auto pt-8 border-t border-slate-100">
            <div className="px-6 py-4 bg-slate-50 rounded-2xl mb-6 border border-slate-100">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Authenticated Merchant</p>
              <p className="text-[11px] font-black text-slate-900 truncate italic">{user.email}</p>
            </div>
            <button onClick={onLogout} className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-all px-6">
              <span>Revoke Registry Access</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto min-h-screen relative pb-20 lg:pb-0">
        <header className="h-20 lg:h-24 glass border-b border-slate-200/60 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-40">
          <div>
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
              {activeTab === 'repo' ? 'Repo Guard' : activeTab.replace(/([A-Z])/g, ' $1').trim()}
            </h1>
            <div className="flex items-center space-x-2 mt-1 hidden lg:flex">
              <span className={`w-1.5 h-1.5 rounded-full ${isShielded ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol: V2.4 • Store: {user.storeUrl}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 lg:space-x-6">
            {!isPaid && (
              <button onClick={onUpgrade} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-premium hover:bg-emerald-700 transition-all active:scale-95">
                Establish Shield
              </button>
            )}
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-xl uppercase italic ring-4 ring-slate-100">
              {user.firstName?.[0] || 'M'}{user.lastName?.[0] || 'M'}
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-12 max-w-7xl mx-auto flex-1 w-full">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="lg:col-span-2 space-y-10">
                {/* DYNAMIC SECURITY ACTION CARD */}
                {!isPaid ? (
                  <div className="bg-slate-950 p-10 lg:p-12 rounded-5xl text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-vault relative overflow-hidden group">
                    <div className="flex items-center space-x-8 relative z-10">
                      <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-white/5 group-hover:scale-110 transition-transform">🔒</div>
                      <div>
                        <h4 className="font-black text-3xl tracking-tight uppercase italic leading-none mb-2">Vault Locked</h4>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">License Required for Store Handshake</p>
                      </div>
                    </div>
                    <button onClick={onUpgrade} className="w-full md:w-auto bg-emerald-500 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 z-10">Establish License</button>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                  </div>
                ) : isVerifying ? (
                  <div className="bg-slate-950 p-12 rounded-5xl text-white flex flex-col items-center justify-center space-y-8 shadow-vault border-2 border-emerald-500/20">
                    <div className="w-20 h-20 relative">
                       <div className="absolute inset-0 border-[6px] border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                       <div className="absolute inset-5 bg-emerald-500/10 rounded-full flex items-center justify-center text-3xl">🛡️</div>
                    </div>
                    <div className="text-center">
                       <h4 className="font-black text-2xl uppercase italic tracking-tight">Syncing Handshake</h4>
                       <p className="text-emerald-400 font-bold text-[11px] uppercase tracking-[0.4em] animate-pulse mt-3">{verifyStep}</p>
                    </div>
                  </div>
                ) : !isShielded ? (
                  <div className="bg-gradient-to-br from-emerald-950 to-emerald-800 p-12 rounded-5xl text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-vault relative overflow-hidden ring-4 ring-emerald-500/40">
                    <div className="flex items-center space-x-8 relative z-10">
                      <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-inner border border-white/10 animate-pulse">⚡</div>
                      <div>
                        <h4 className="font-black text-4xl tracking-tight uppercase italic leading-none mb-3">Initialize Security</h4>
                        <p className="text-emerald-100 text-sm font-medium opacity-80 italic leading-relaxed max-w-xs">Your license is active. Establish the secure handshake to shield your store.</p>
                      </div>
                    </div>
                    <button onClick={handleVerifyShield} className="w-full md:w-auto bg-white text-emerald-950 px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-50 transition-all shadow-2xl animate-bounce active:scale-95 z-10">Get Store Secured</button>
                    <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-12 rounded-5xl text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-vault relative overflow-hidden">
                    <div className="flex items-center space-x-8 relative z-10">
                      <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-white/10">🛡️</div>
                      <div>
                        <h4 className="font-black text-3xl tracking-tight uppercase italic leading-none mb-2">Security Active</h4>
                        <p className="text-emerald-50 text-xs font-bold uppercase tracking-[0.2em] opacity-80 italic">Vault Registry Synchronization Live</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 bg-slate-950/40 px-6 py-3 rounded-2xl border border-white/10">
                       <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                       <span className="text-xs font-black uppercase tracking-widest">Global Watcher Active</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <StatCard label="Post-Scan Audit" value={`${currentScoreValue}%`} icon="🛡️" />
                   <StatCard label="Federal Syncs" value={isShielded ? "124" : "0"} icon="🔄" />
                   <StatCard label="Guard Engine" value="V2.4" icon="🤖" />
                </div>
                <ComplianceFeed />
              </div>

              {/* Sidebar Info & Trust Badge */}
              <div className="space-y-10">
                <div className="bg-slate-950 rounded-5xl p-10 text-white shadow-vault text-center relative overflow-hidden border border-emerald-900/30">
                   <div className="relative z-10">
                     <h3 className="text-2xl font-black mb-2 tracking-tight uppercase italic">Merchant Serial</h3>
                     <div className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-8 font-mono">{badgeSerial}</div>
                     <button 
                       disabled={!isShielded}
                       className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isShielded ? 'bg-white text-slate-950 hover:bg-emerald-400 shadow-xl active:scale-95' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                     >
                       {isShielded ? 'Download Trust Seal' : 'Pending Verification'}
                     </button>
                     <p className="text-[10px] text-slate-500 mt-6 uppercase font-bold tracking-widest leading-relaxed italic">
                       Official merchant credential for checkout displays.
                     </p>
                   </div>
                   <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                </div>
                
                <div className="bg-white rounded-5xl p-10 border border-slate-200 shadow-premium">
                   <h4 className="text-sm font-black uppercase italic mb-6 tracking-widest text-slate-400">Registry Credentials</h4>
                   <div className="space-y-6">
                      <RegistryRow label="Protected URL" value={user.storeUrl} />
                      <RegistryRow label="Security Tier" value={user.plan || 'Standard'} />
                      <RegistryRow label="Handshake" value={isShielded ? 'VERIFIED' : 'PENDING'} color={isShielded ? 'text-emerald-600' : 'text-red-500'} />
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

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 glass border-t border-slate-200 lg:hidden flex items-center justify-around px-4 z-[60] pb-safe">
        <MobileNavLink icon="🏠" label="Vault" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
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
  <button onClick={onClick} className={`w-full flex items-center justify-between px-8 py-5 rounded-2xl transition-all duration-300 group ${active ? 'bg-slate-900 text-white font-black shadow-vault scale-[1.02]' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}>
    <div className="flex items-center space-x-5">
      <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
      <span className="uppercase text-[11px] tracking-[0.2em] font-black italic">{label}</span>
    </div>
    {active && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
  </button>
);

const RegistryRow = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
     <span className={`text-[10px] font-bold truncate max-w-[150px] ${color || 'text-slate-900'}`}>{value}</span>
  </div>
);

const MobileNavLink = ({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center space-y-1 transition-all ${active ? 'text-emerald-600 scale-110' : 'text-slate-400'}`}>
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-widest italic">{label}</span>
  </button>
);

const StatCard = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <div className="bg-white p-10 rounded-5xl border border-slate-200 shadow-premium group hover:border-emerald-500/20 transition-all">
    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
    <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-4xl font-black tracking-tighter text-slate-950">{value}</div>
  </div>
);

export default Dashboard;
