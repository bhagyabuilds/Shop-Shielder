import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage.tsx';
import Dashboard from './components/Dashboard.tsx';
import Checkout from './components/Checkout.tsx';
import AuthModal from './components/AuthModal.tsx';
import PublicVerify from './components/PublicVerify.tsx';
import { UserProfile, SubscriptionPlan, BillingInterval } from './types.ts';
import { supabase, isConfigured } from './services/supabase.ts';
import { normalizeStoreUrl } from './services/complianceEngine.ts';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<{ plan: SubscriptionPlan; interval: BillingInterval } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialAuthData, setInitialAuthData] = useState<{ email: string, storeUrl: string } | undefined>(undefined);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>('login');
  const [isLoading, setIsLoading] = useState(true);
  const [publicVerifySerial, setPublicVerifySerial] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;

    if (path.startsWith('/verify/')) {
      const serial = path.split('/verify/')[1];
      if (serial) setPublicVerifySerial(serial);
    }

    if (hash && hash.includes('type=recovery')) {
      setAuthMode('reset');
      setIsAuthModalOpen(true);
    }

    // Attempt to initialize session with safety timeout
    const initSession = async () => {
      try {
        if (!isConfigured) {
          console.warn("Vault offline: Waiting for configuration.");
          setIsLoading(false);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        if (session?.user) {
          mapSupabaseUser(session.user);
        }
      } catch (err) {
        console.error("Communication error during vault handshake:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session?.user) {
        mapSupabaseUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUser = (sbUser: any) => {
    const meta = sbUser.user_metadata || {};
    const url = meta.storeUrl || '';
    const cleanUrl = normalizeStoreUrl(url);
    const name = cleanUrl.split('.')[0].toUpperCase() || 'MY STORE';

    setUser({
      id: sbUser.id,
      email: sbUser.email || '',
      firstName: meta.firstName || '',
      lastName: meta.lastName || '',
      storeUrl: cleanUrl,
      storeName: name,
      onboarded: meta.onboarded || false,
      isPaid: meta.isPaid || false,
      plan: meta.plan,
      interval: meta.interval
    });
  };

  const handleStartCheckout = (plan: SubscriptionPlan, interval: BillingInterval) => {
    setIsCheckingOut({ plan, interval });
  };

  const handleCompleteCheckout = async () => {
    if (user && isCheckingOut) {
      try {
        await supabase.auth.updateUser({
          data: {
            isPaid: true,
            plan: isCheckingOut.plan,
            interval: isCheckingOut.interval
          }
        });
        
        setUser({
          ...user,
          isPaid: true,
          plan: isCheckingOut.plan,
          interval: isCheckingOut.interval
        });
        setIsCheckingOut(null);
      } catch (err) {
        console.error("Critical Registry Update Error:", err);
        alert("Compliance record sync failed. Please check your connection.");
      }
    }
  };

  const handleOpenLogin = (data?: { email: string, storeUrl: string }) => {
    setInitialAuthData(data);
    setAuthMode(data ? 'signup' : 'login');
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setUser(null);
    setSession(null);
    setIsCheckingOut(null);
  };

  if (publicVerifySerial) {
    return <PublicVerify serial={publicVerifySerial} onBack={() => setPublicVerifySerial(null)} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
          <p className="text-slate-400 font-black text-[10px] animate-pulse tracking-[0.3em] uppercase italic">Establishing Handshake...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {isCheckingOut ? (
        <Checkout 
          plan={isCheckingOut.plan} 
          interval={isCheckingOut.interval}
          onCancel={() => setIsCheckingOut(null)}
          onSuccess={handleCompleteCheckout}
        />
      ) : session ? (
        <Dashboard 
          user={user!} 
          onLogout={handleLogout} 
          onUpgrade={() => handleStartCheckout(SubscriptionPlan.STANDARD, BillingInterval.MONTHLY)}
        />
      ) : (
        <LandingPage 
          onLogin={handleOpenLogin} 
          onSelectPlan={handleStartCheckout} 
          session={session}
        />
      )}
      
      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)} 
          initialEmail={initialAuthData?.email}
          initialStoreUrl={initialAuthData?.storeUrl}
          initialMode={authMode}
        />
      )}
    </div>
  );
};

export default App;