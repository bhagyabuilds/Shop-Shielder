
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
  const [pendingCheckout, setPendingCheckout] = useState<{ plan: SubscriptionPlan; interval: BillingInterval } | null>(null);
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

    const initSession = async () => {
      try {
        if (!isConfigured) {
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

    if (isConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setSession(session);
        if (session?.user) {
          mapSupabaseUser(session.user);
        } else {
          setUser(null);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (user && pendingCheckout) {
      setIsCheckingOut(pendingCheckout);
      setPendingCheckout(null);
      setIsAuthModalOpen(false);
    }
  }, [user, pendingCheckout]);

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
    if (!user) {
      setPendingCheckout({ plan, interval });
      setAuthMode('signup');
      setIsAuthModalOpen(true);
    } else {
      setIsCheckingOut({ plan, interval });
    }
  };

  const handleCompleteCheckout = async () => {
    setIsLoading(true);
    try {
      const targetPlan = isCheckingOut?.plan || SubscriptionPlan.STANDARD;
      const targetInterval = isCheckingOut?.interval || BillingInterval.YEARLY;

      if (isConfigured && session?.user) {
        await supabase.auth.updateUser({
          data: {
            isPaid: true,
            plan: targetPlan,
            interval: targetInterval
          }
        });
      }
      
      if (user) {
        setUser({
          ...user,
          isPaid: true,
          plan: targetPlan,
          interval: targetInterval
        });
      }
      
      setIsCheckingOut(null);
    } catch (err) {
      console.error("Critical Registry Update Error:", err);
      alert("Compliance record sync failed. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenLogin = (data?: { email: string, storeUrl: string }) => {
    setInitialAuthData(data);
    setAuthMode(data ? 'signup' : 'login');
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      if (isConfigured) await supabase.auth.signOut();
    } catch (e) {}
    setUser(null);
    setSession(null);
    setIsCheckingOut(null);
    setPendingCheckout(null);
  };

  const handlePreviewLogin = (userData: UserProfile) => {
    setUser(userData);
    setSession({ user: { email: userData.email }, isMock: true });
  };

  if (publicVerifySerial) {
    return <PublicVerify serial={publicVerifySerial} onBack={() => setPublicVerifySerial(null)} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
          <p className="text-slate-400 font-black text-[10px] animate-pulse tracking-[0.3em] uppercase italic">Syncing with Registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Visual Debug Banner for Production Issues */}
      {!isConfigured && (
        <div className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-[0.2em] py-2 px-4 flex justify-between items-center z-[3000] sticky top-0">
          <span>⚠️ Handshake Connection Incomplete: Keys missing in environment.</span>
          <span className="opacity-70">Check console for details</span>
        </div>
      )}

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
          onClose={() => {
            setIsAuthModalOpen(false);
            setPendingCheckout(null);
          }} 
          /* Extract initial values from the initialAuthData state object */
          initialEmail={initialAuthData?.email}
          initialStoreUrl={initialAuthData?.storeUrl}
          initialMode={authMode}
          onPreviewLogin={handlePreviewLogin}
        />
      )}
    </div>
  );
};

export default App;
