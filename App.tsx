
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Checkout from './components/Checkout';
import AuthModal from './components/AuthModal';
import { UserProfile, SubscriptionPlan, BillingInterval } from './types';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<{ plan: SubscriptionPlan; interval: BillingInterval } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialAuthData, setInitialAuthData] = useState<{ email: string, storeUrl: string } | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        mapSupabaseUser(session.user);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
    const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    const name = cleanUrl.split('.')[0].toUpperCase() || 'MY STORE';

    setUser({
      id: sbUser.id,
      email: sbUser.email || '',
      firstName: meta.firstName || '',
      lastName: meta.lastName || '',
      storeUrl: url,
      storeName: name,
      onboarded: meta.onboarded || false,
      isPaid: meta.isPaid || false,
      plan: meta.plan,
      interval: meta.interval
    });
  };

  const handleStartCheckout = (plan: SubscriptionPlan, interval: BillingInterval) => {
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsCheckingOut({ plan, interval });
  };

  const handleCompleteCheckout = async () => {
    if (user && isCheckingOut) {
      const updatedMeta = {
        ...user,
        isPaid: true,
        plan: isCheckingOut.plan,
        interval: isCheckingOut.interval
      };
      
      await supabase.auth.updateUser({
        data: {
          isPaid: true,
          plan: isCheckingOut.plan,
          interval: isCheckingOut.interval
        }
      });

      setUser(updatedMeta);
      setIsCheckingOut(null);
    }
  };

  const handleOpenLogin = (data?: { email: string, storeUrl: string }) => {
    setInitialAuthData(data);
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsCheckingOut(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
          <p className="text-slate-400 font-bold text-xs animate-pulse tracking-widest uppercase">Shop Shielder Initializing...</p>
        </div>
      </div>
    );
  }

  if (isCheckingOut) {
    return (
      <Checkout 
        plan={isCheckingOut.plan} 
        interval={isCheckingOut.interval}
        onCancel={() => setIsCheckingOut(null)}
        onSuccess={handleCompleteCheckout}
      />
    );
  }

  return (
    <div className="min-h-screen">
      {user?.isPaid ? (
        <Dashboard user={user} onLogout={handleLogout} />
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
        />
      )}
    </div>
  );
};

export default App;
