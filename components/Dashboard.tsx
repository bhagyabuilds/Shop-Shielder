
import React, { useState, useEffect } from 'react';
import { UserProfile, ComplianceScore, RiskItem, SyncStatus } from '../types';
import ComplianceAnalyzer from './ComplianceAnalyzer';
import PolicyGenerator from './PolicyGenerator';
import ComplianceFeed from './ComplianceFeed';
import LegalOverlay from './LegalOverlay';
import { generateStoreRiskScore, generateBadgeSerial } from '../services/complianceEngine';

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analyze' | 'policies' | 'settings'>('overview');
  const [activeLegalTab, setActiveLegalTab] = useState<string | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: '2 hours ago',
    currentVersion: 'v2.4.1',
    isAutoSyncEnabled: true,
    status: 'optimal'
  });

  // Calculate unique score based on store URL so it's not always 64%
  // We offset it slightly for dashboard vs landing page to show progress
  const baseScore = generateStoreRiskScore(user.storeUrl);
  const dashboardScore = 100 - (100 - baseScore) / 2; // Simulated improvement post-registration
  const badgeSerial = generateBadgeSerial(user.storeUrl);

  const [score] = useState<ComplianceScore>({
    overall: Math.round(dashboardScore),
    privacy: 98,
    accessibility: 92,
    safety: 95,
    policies: 100
  });

  const triggerManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus(prev => ({
        ...prev,
        lastSync: 'Just now',
        currentVersion: 'v2.4.2'
      }));
    }, 2000);
  };

  const handleDownloadBadge = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      // Logic to trigger a real file download would go here.
      // For now, we simulate a successful generation.
      alert(`Trust Badge ${badgeSerial} generated. Your official Shop Shielder shield is ready for implementation.`);
    }, 1500);
  };

  const navigateTo = (tab: any) => {
    setActiveTab(tab);
    setIsMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row selection:bg-emerald-100">
      {/* Desktop Sidebar */}
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
            <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 group cursor-pointer hover:bg-emerald-100 transition-colors" onClick={triggerManualSync}>
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg ${isSyncing ? 'animate-spin' : ''}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                </div>
                <div className="text-[10px] font-black text-emerald-900 uppercase tracking-widest leading-none">
                  {isSyncing ? 'Syncing...' : 'System Optimal'}
                </div>
              </div>
              <p className="text-[10px] font-bold text-emerald-700 leading-relaxed">Documents are current with US Federal Standards.</p>
            </div>
            
            <button onClick={onLogout} className="text-slate-400 hover:text-red-500 flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest transition-colors w-full px-5 py-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Nav Drawer */}
      {isMobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileNavOpen(false)}></div>
          <div className="relative w-72 bg-white h-full flex flex-col p-8 animate-in slide-in-from-left duration-300">
            <div className="flex items-center space-x-3 mb-12">
              <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-16.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
              </div>
              <span className="font-black tracking-tighter text-xl">Shop Shielder</span>
            </div>
            <nav className="space-y-4 flex-1">
              <SidebarLink icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>} label="Overview" active={activeTab === 'overview'} onClick={() => navigateTo('overview')} />
              <SidebarLink icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>} label="Analyzer" active={activeTab === 'analyze'} onClick={() => navigateTo('analyze')} />
              <SidebarLink icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>} label="Policy Engine" active={activeTab === 'policies'} onClick={() => navigateTo('policies')} />
              <SidebarLink icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>} label="Settings" active={activeTab === 'settings'} onClick={() => navigateTo('settings')} />
            </nav>
            <button onClick={onLogout} className="mt-auto py-4 font-black uppercase text-[10px] tracking-widest text-red-500 border-t border-slate-100 text-left">Log Out</button>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-y-auto min-h-screen">
        <header className="h-20 lg:h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsMobileNavOpen(true)} className="lg:hidden p-2 text-slate-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-none">
                {activeTab === 'overview' ? 'Compliance Hub' : 
                 activeTab === 'analyze' ? 'Product Safety Scan' : 
                 activeTab === 'policies' ? 'Policy Center' : 'Store Settings'}
              </h1>
              <p className="hidden md:block text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest truncate max-w-[200px] lg:max-w-none">Store: {user.storeUrl}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 lg:space-x-6">
            <div className="hidden md:flex items-center space-x-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Current Standard</span>
                  <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">US-CCPA-2024.1</span>
               </div>
               <div className="w-px h-6 bg-slate-200"></div>
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Last Email Sent</span>
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{syncStatus.lastSync}</span>
               </div>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg lg:text-xl shadow-xl shadow-slate-200 uppercase">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto flex-1 w-full">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                {/* Auto-Sync Status Card */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                      <div>
                         <div className="flex items-center space-x-2 mb-2">
                            <span className="relative flex h-2 w-2">
                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Autonomous Delivery Active</h2>
                         </div>
                         <p className="text-sm font-medium text-slate-500 max-w-md">Your storefront is synced with federal database updates. Any legal shift triggers an automatic document refresh and email delivery.</p>
                      </div>
                      <div className="flex items-center space-x-4">
                         <div className="text-right">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Store Engine</div>
                            <div className="text-sm font-black text-slate-900">v2.4.2 (LATEST)</div>
                         </div>
                         <button onClick={triggerManualSync} className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg group-hover:scale-105">
                            <svg className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                         </button>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <StatCard label="Overall Security" value={`${score.overall}%`} trend="up" icon="🛡️" />
                  <StatCard label="Privacy Status" value={`${score.privacy}%`} trend="neutral" icon="🔏" />
                  <StatCard label="Accessibility" value={`${score.accessibility}%`} trend="up" icon="👁️" />
                  <StatCard label="Policy Health" value={`${score.policies}%`} trend="up" icon="📜" />
                </div>

                <div className="bg-white rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 border border-slate-200 shadow-xl shadow-slate-200/50">
                  <div className="flex items-center justify-between mb-8 lg:mb-10">
                    <div>
                      <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight mb-2">Policy Health</h2>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time protection status</p>
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

              <div className="space-y-6 lg:space-y-8">
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group text-center">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
                  <div className="relative z-10">
                     <div className="w-20 h-20 bg-white/10 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl border border-white/5">
                        <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-16.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                     </div>
                     <h3 className="text-xl font-black mb-2 tracking-tight">Compliance Shield</h3>
                     <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-6">Serial: {badgeSerial}</div>
                     <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed">Verified protection against web-based legal claims. Embed this shield in your footer to deter predatory lawsuits.</p>
                     <button 
                      onClick={handleDownloadBadge}
                      disabled={isDownloading}
                      className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 hover:text-emerald-900 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2"
                     >
                        {isDownloading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-900/20 border-t-slate-900"></div>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                            <span>Download Badge</span>
                          </>
                        )}
                     </button>
                  </div>
                </div>
                <ComplianceFeed />
              </div>
            </div>
          )}

          {activeTab === 'analyze' && <ComplianceAnalyzer />}
          {activeTab === 'policies' && <PolicyGenerator storeName={user.storeName} />}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-[2.5rem] p-6 lg:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500">
              <h2 className="text-2xl font-black mb-8 tracking-tight">Account & Protection</h2>
              <div className="grid gap-6">
                {/* Automation Toggles */}
                <div className="p-8 bg-slate-900 rounded-[2rem] text-white">
                   <h3 className="text-lg font-black mb-6 flex items-center space-x-2">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                      <span>Autonomous Compliance Settings</span>
                   </h3>
                   <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                         <div>
                            <div className="text-sm font-black uppercase tracking-widest mb-1">Automatic PDF Delivery</div>
                            <p className="text-xs text-slate-400 font-medium">Email the latest version directly to hello@shopshielder.com upon detection.</p>
                         </div>
                         <button 
                            onClick={() => setSyncStatus(s => ({ ...s, isAutoSyncEnabled: !s.isAutoSyncEnabled }))}
                            className={`w-12 h-6 rounded-full transition-colors relative ${syncStatus.isAutoSyncEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                         >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${syncStatus.isAutoSyncEnabled ? 'left-7' : 'left-1'}`}></div>
                         </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                         <div>
                            <div className="text-sm font-black uppercase tracking-widest mb-1">Real-time Legal Monitoring</div>
                            <p className="text-xs text-slate-400 font-medium">Continuously scan federal news feeds for regulation changes.</p>
                         </div>
                         <div className="w-12 h-6 rounded-full bg-emerald-500 relative opacity-50 cursor-not-allowed">
                            <div className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full"></div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-6 lg:p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-1">Active Integration</h4>
                    <p className="text-slate-500 font-bold truncate">Store: {user.storeUrl}</p>
                  </div>
                  <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm hover:text-red-600 transition-colors whitespace-nowrap">Manage Connection</button>
                </div>
                <div className="p-6 lg:p-8 bg-emerald-50 rounded-3xl border border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-black text-emerald-900 uppercase text-[10px] tracking-widest mb-1">Subscription</h4>
                    <p className="text-emerald-700 font-bold">${user.interval === 'YEARLY' ? '16' : '20'}/mo • {user.plan} Plan</p>
                  </div>
                  <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 whitespace-nowrap">Manage Billing</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="p-10 max-w-7xl mx-auto w-full border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 gap-6">
          <div className="flex space-x-8">
            <button onClick={() => setActiveLegalTab('privacy')} className="hover:text-slate-900 transition-colors">Privacy</button>
            <button onClick={() => setActiveLegalTab('terms')} className="hover:text-slate-900 transition-colors">Terms</button>
            <a href="mailto:hello@shopshielder.com" className="hover:text-slate-900 transition-colors">Contact</a>
          </div>
          <div>© 2024 Shop Shielder • Badge: {badgeSerial}</div>
        </footer>
      </main>

      {activeLegalTab && (
        <LegalOverlay type={activeLegalTab} onClose={() => setActiveLegalTab(null)} />
      )}
    </div>
  );
};

const PolicyStatusItem = ({ title, status, date, type, urgent }: { title: string; status: string; date: string; type: string; urgent?: boolean }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl md:rounded-3xl bg-slate-50 border border-transparent hover:border-slate-200 hover:bg-white transition-all gap-4">
    <div className="flex items-center space-x-4 md:space-x-6">
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 ${urgent ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-600'}`}>
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
      </div>
      <div>
        <div className="text-base md:text-lg font-black text-slate-900 tracking-tight leading-none">{title} <span className="hidden sm:inline-block text-[10px] font-black text-slate-300 ml-2 uppercase tracking-widest">{type}</span></div>
        <div className="text-[10px] md:text-xs font-bold text-slate-400 mt-1">{date}</div>
      </div>
    </div>
    <div className={`w-fit px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${urgent ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
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
  <div className="bg-white p-6 md:p-8 rounded-3xl lg:rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{icon}</div>
      <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>{trend === 'up' ? 'Active' : 'Stable'}</div>
    </div>
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">{value}</div>
  </div>
);

export default Dashboard;
