import React, { useState, useEffect } from 'react';
import { UserProfile, SubscriptionPlan, BillingInterval } from '../types.ts';
import ComplianceAnalyzer from './ComplianceAnalyzer.tsx';
import PolicyGenerator from './PolicyGenerator.tsx';
import ComplianceFeed from './ComplianceFeed.tsx';
import LegalOverlay from './LegalOverlay.tsx';
import DeploymentHub from './DeploymentHub.tsx';
import SettingsHub from './SettingsHub.tsx';
import LiveComplianceOfficer from './LiveComplianceOfficer.tsx';
import { generateStoreRiskScore, generateBadgeSerial } from '../services/complianceEngine.ts';
import { supabase } from '../services/supabase.ts';

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onUpgrade?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onUpgrade }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analyze' | 'policies' | 'deploy' | 'settings'>('overview');
  const [activeLegalTab, setActiveLegalTab] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState('');
  const [isShielded, setIsShielded] = useState(user.onboarded || false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('2 minutes ago');
  const [lastScanTime, setLastScanTime] = useState('4 minutes ago');

  const isPaid = user.isPaid;
  const currentScoreValue = generateStoreRiskScore(user.storeUrl, isShielded && isPaid);
  const badgeSerial = generateBadgeSerial(user.storeUrl);

  const verificationSteps = [
    "Connecting to store endpoint...",
    "Locating Shop Shielder Serial: " + badgeSerial,
    "Validating Privacy Policy hash integrity...",
    "Checking ADA 'Skip to Content' accessibility triggers...",
    "Confirming CCPA Opt-Out link visibility...",
    "Shield Handshake Complete."
  ];

  const handleVerifyShield = async () => {
    if (!isPaid) return;
    setIsVerifying(true);
    for (let i = 0; i < verificationSteps.length; i++) {
      setVerifyStep(verificationSteps[i]);
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));
    }
    setIsShielded(true);
    setIsVerifying(false);
    await supabase.auth.updateUser({
      data: { onboarded: true }
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setLastSyncTime('Just now');
      setTimeout(() => setLastSyncTime('1 minute ago'), 60000);
    }, 120000);
    return () => clearInterval(timer);
  }, []);

  const handleDownloadBadge = () => {
    if (!isPaid) return;
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 800, 800);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(1, '#1e293b');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(0, 0, 800, 800, 160);
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 20;
        ctx.stroke();
        ctx.fillStyle = '#10b981';
        ctx.font = '900 300px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🛡️', 400, 420);
        ctx.fillStyle = 'white';
        ctx.font = '900 48px sans-serif';
        ctx.fillText('SHOP SHIELDER', 400, 520);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText('VERIFIED COMPLIANT', 400, 580);
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 24px monospace';
        ctx.fillText(`SERIAL: ${badgeSerial}`, 400, 640);
        ctx.fillStyle = 'white';
        ctx.font = '900 80px sans-serif';
        ctx.fillText(new Date().getFullYear().toString(), 400, 750);
        const link = document.createElement('a');
        link.download = `ShopShielder-TrustBadge-${badgeSerial}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row selection:bg-emerald-100">
      {/* Sidebar - Desktop */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col shadow-sm">
        <div className="p-10 flex flex-col h-full">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-16.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <span className="font-black tracking-tighter text-xl text-slate-900 uppercase italic">Hub</span>
          </div>
          <nav className="space-y-2 flex-1">
            <SidebarLink icon="🏠" label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
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
              {activeTab}
            </h1>
            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest hidden lg:block">Store: {user.storeUrl}</p>
          </div>
          <div className="flex items-center space-x-4 lg:space-x-6">
            {!isPaid && (
              <button onClick={onUpgrade} className="bg-emerald-600 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center space-x-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
                <span className="hidden sm:inline">Activate Shield</span>
                <span className="sm:hidden">Shield</span>
              </button>
            )}
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm lg:text-xl shadow-xl uppercase italic">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto flex-1 w-full relative">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="lg:col-span-2 space-y-8">
                {!isPaid ? (
                  <div className="bg-slate-900 text-white p-8 lg:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 p-10 hidden sm:block">
                       <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl border border-white/10 animate-pulse text-amber-400">⚠️</div>
                    </div>
                    <div className="max-w-md relative z-10">
                      <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-4">Urgent Attention Required</div>
                      <h4 className="text-3xl font-black tracking-tight mb-4 uppercase italic">Protection Inactive</h4>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                        Our hybrid engine detected <span className="text-white font-bold underline decoration-amber-400 decoration-2 underline-offset-4">critical legal gaps</span> for {user.storeUrl}. You are currently exposed to CCPA and ADA accessibility litigation.
                      </p>
                      <button 
                        onClick={onUpgrade}
                        className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-2xl flex items-center space-x-3"
                      >
                        <span>Activate Full Shield</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                      </button>
                    </div>
                  </div>
                ) : !isShielded ? (
                  <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 hidden sm:block">
                       <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl animate-pulse">⏳</div>
                    </div>
                    <div className="max-w-md">
                      <h4 className="text-slate-900 font-black text-2xl tracking-tight mb-2 uppercase italic">Verification Needed</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">Your account is active. Please complete the verification suite to activate your Trust Badge and 100% monitoring status.</p>
                      {isVerifying ? (
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6 animate-in slide-in-from-top-2">
                           <div className="flex items-center space-x-3 mb-3">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500/20 border-t-emerald-500"></div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 italic">Security Audit in Progress</span>
                           </div>
                           <p className="text-slate-700 font-mono text-[10px] uppercase tracking-wider">{verifyStep}</p>
                        </div>
                      ) : (
                        <button onClick={handleVerifyShield} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl flex items-center space-x-3">
                          <span>Run Handshake Verification</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-600 border border-emerald-500 p-8 lg:p-10 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-emerald-100 animate-in zoom-in relative overflow-hidden">
                    <div className="flex items-center space-x-6 relative z-10">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/10">🛡️</div>
                      <div>
                        <h4 className="font-black text-2xl tracking-tight uppercase italic leading-none">Shield: ACTIVE</h4>
                        <p className="text-emerald-50 text-sm font-medium opacity-90 mt-1">Store URL is verified. Continuous monitoring protocol v2.4 engaged.</p>
                      </div>
                    </div>
                    <div className="px-6 py-2.5 bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/30 backdrop-blur-sm relative z-10">
                      SECURE ID: {badgeSerial}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard label="Security Posture" value={`${currentScoreValue}%`} icon="🛡️" color={isShielded && isPaid ? 'emerald' : 'amber'} />
                  <StatCard label="Policy Integrity" value={isShielded && isPaid ? '100%' : '65%'} icon="📜" color={isShielded && isPaid ? 'emerald' : 'amber'} />
                  <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4">
                        <div className="relative flex h-3 w-3">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </div>
                     </div>
                     <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Engine Pulse</div>
                     <div className="text-2xl font-black text-white tracking-tighter mb-4 italic">Managed v2.4</div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 tracking-widest">
                           <span>Last Sync:</span>
                           <span className="text-white">{lastSyncTime}</span>
                        </div>
                        <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 tracking-widest">
                           <span>Registry:</span>
                           <span className="text-white">OPTIMAL</span>
                        </div>
                     </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-200 shadow-xl shadow-slate-200/50">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black uppercase italic">Protection Registry</h2>
                    <div className="px-4 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest flex items-center space-x-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span className="hidden sm:inline">Continuous Monitoring Active</span>
                       <span className="sm:hidden">Monitoring</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <PolicyStatusItem title="Privacy Policy" status={isShielded && isPaid ? "Synced" : "At Risk"} date={isShielded && isPaid ? `Updated ${lastSyncTime}` : "Needs Review"} type="CCPA/GDPR" />
                    <PolicyStatusItem title="ADA Accessibility" status={isShielded && isPaid ? "Synced" : "At Risk"} date={isShielded && isPaid ? `Verified ${lastScanTime}` : "Gaps Detected"} type="WCAG 2.1" />
                    <PolicyStatusItem title="Terms of Service" status={isShielded && isPaid ? "Synced" : "Template"} date="Latest Engine v2.4" type="FTC Compliant" />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group text-center">
                   <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
                   <div className="w-20 h-20 bg-white/10 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl border border-white/5">
                      <svg className={`w-10 h-10 ${isShielded && isPaid ? 'text-emerald-400' : 'text-amber-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-16.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                   </div>
                   <h3 className="text-xl font-black mb-2 tracking-tight uppercase italic">Trust Badge</h3>
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-6">Serial: {badgeSerial}</div>
                   <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed">Display this badge in your footer to reassure customers and deter predatory legal claims.</p>
                   <button 
                    onClick={handleDownloadBadge} 
                    disabled={isDownloading || !isShielded || !isPaid} 
                    className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2 ${isShielded && isPaid ? 'bg-white text-slate-900 hover:bg-emerald-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                   >
                      {isDownloading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-900/20 border-t-slate-900"></div>
                      ) : (
                        <span>{isShielded && isPaid ? 'Download Badge' : 'Unlock Badge'}</span>
                      )}
                   </button>
                </div>
                <ComplianceFeed />
              </div>
            </div>
          )}
          {activeTab === 'analyze' && <ComplianceAnalyzer />}
          {activeTab === 'policies' && <PolicyGenerator user={user} storeName={user.storeName} isPaid={user.isPaid} onUpgrade={onUpgrade} />}
          {activeTab === 'deploy' && <DeploymentHub user={user} isPaid={user.isPaid} onUpgrade={onUpgrade} />}
          {activeTab === 'settings' && <SettingsHub user={user} />}
        </div>

        <footer className="p-8 lg:p-10 max-w-7xl mx-auto w-full border-t border-slate-200 mt-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 gap-6 mb-4">
            <div className="flex space-x-6">
              <button onClick={() => setActiveLegalTab('privacy')} className="hover:text-slate-900 transition-colors">Privacy</button>
              <button onClick={() => setActiveLegalTab('terms')} className="hover:text-slate-900 transition-colors">Terms</button>
              <button onClick={() => setActiveLegalTab('guide')} className="hover:text-slate-900 transition-colors">Audit Guide</button>
            </div>
            <div className="flex items-center space-x-2">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="hidden sm:inline">System Status: Optimal</span>
               <span className="hidden sm:inline mx-2">•</span>
               <span>ID: {badgeSerial}</span>
            </div>
          </div>
          <div className="text-center sm:text-left text-[9px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
            Shop Shielder is a compliance technology platform. Our hybrid AI-Human review ensures documents are technically aligned with federal statutes. We are not a law firm.
          </div>
        </footer>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-200 lg:hidden flex items-center justify-around px-4 z-[60] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <MobileNavLink icon="🏠" label="Home" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <MobileNavLink icon="🔍" label="Scan" active={activeTab === 'analyze'} onClick={() => setActiveTab('analyze')} />
        <MobileNavLink icon="📄" label="Legal" active={activeTab === 'policies'} onClick={() => setActiveTab('policies')} />
        <MobileNavLink icon="🚀" label="Deploy" active={activeTab === 'deploy'} onClick={() => setActiveTab('deploy')} />
        <MobileNavLink icon="⚙️" label="More" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </nav>

      {isPaid && <LiveComplianceOfficer />}

      {activeLegalTab && <LegalOverlay type={activeLegalTab} onClose={() => setActiveLegalTab(null)} />}
    </div>
  );
};

const SidebarLink = ({ icon, label, active, onClick, locked }: { icon: string; label: string; active?: boolean; onClick: () => void; locked?: boolean }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 ${active ? 'bg-slate-900 text-white font-black shadow-xl scale-105' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}>
    <div className="flex items-center space-x-4">
      <span className="text-xl">{icon}</span>
      <span className="uppercase text-[10px] tracking-[0.2em] font-black italic">{label}</span>
    </div>
    {locked && <div className="text-[10px] opacity-60">🔒</div>}
  </button>
);

const MobileNavLink = ({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center space-y-1 transition-all ${active ? 'text-emerald-600 scale-110' : 'text-slate-400'}`}>
    <span className="text-xl">{icon}</span>
    <span className="text-[9px] font-black uppercase tracking-widest italic">{label}</span>
  </button>
);

const StatCard = ({ label, value, icon, color = 'emerald' }: { label: string; value: string; icon: string; color?: 'emerald' | 'amber' }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{icon}</div>
      <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{color === 'emerald' ? 'Optimal' : 'Exposed'}</div>
    </div>
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className={`text-3xl font-black tracking-tighter ${color === 'emerald' ? 'text-slate-900' : 'text-amber-600'}`}>{value}</div>
  </div>
);

const PolicyStatusItem = ({ title, status, date, type }: { title: string; status: string; date: string; type: string }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-emerald-200 transition-all">
    <div className="flex items-center space-x-4">
      <div className={`w-2 h-10 rounded-full ${status === 'Synced' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
      <div>
        <div className="text-slate-900 font-black text-sm italic">{title}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{type}</div>
      </div>
    </div>
    <div className="text-right">
      <div className={`text-[10px] font-black uppercase tracking-widest ${status === 'Synced' ? 'text-emerald-600' : 'text-amber-600'}`}>{status}</div>
      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{date}</div>
    </div>
  </div>
);

export default Dashboard;