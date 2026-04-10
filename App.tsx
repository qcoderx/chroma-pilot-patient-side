import React, { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import PhoneSimulator from './components/PhoneSimulator';
import Welcome from './pages/Welcome';
import Onboarding from './pages/Onboarding';
import Complete from './pages/Complete';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import HealthProfile from './pages/HealthProfile';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import { initAuth, AuthSession, extractTokenFromURL } from './utils/auth';

export const AuthContext = React.createContext<{
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
}>({
  session: null,
  setSession: () => { },
});

const App: React.FC = () => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVerifyingLink, setIsVerifyingLink] = useState(false);

  const normalizeToHashRouting = () => {
    const { pathname, hash, search } = window.location;
    const normalizedPath = pathname.replace(/\/+$/, '') || '/';

    if (normalizedPath === '/') return;

    const hashRoute = hash.startsWith('#/') ? hash.slice(1) : `${normalizedPath}${search}`;
    window.history.replaceState({}, '', `/#${hashRoute}`);
  };

  useEffect(() => {
    let isCancelled = false;

    const initializeAuth = async () => {
      normalizeToHashRouting();
      const hasMagicLink = !!extractTokenFromURL();
      const isConnectPath = window.location.pathname === '/connect' || window.location.pathname === '/connect/';
      const hashPath = window.location.hash.split('?')[0];
      const isPatientAuthHashPath = hashPath === '#/patient-auth' || hashPath === '#/patient-auth/';

      setIsVerifyingLink(hasMagicLink || isPatientAuthHashPath);

      const authSession = await initAuth();
      if (isCancelled) return;

      if (authSession) {
        setSession(authSession);
        console.log('🔐 Session initialized:', authSession.payload.name || authSession.payload.sub);

        // If we just authenticated via magic link or hit the connect endpoint, redirect to onboarding
        if (hasMagicLink || isConnectPath || isPatientAuthHashPath) {
          window.location.hash = '/onboarding';
        }
      }

      setIsInitialized(true);
      setIsVerifyingLink(false);
    };

    initializeAuth();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-text-secondary text-sm">
          {isVerifyingLink ? 'Verifying secure patient link...' : 'Preparing secure session...'}
        </p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session, setSession }}>
      <HashRouter>
        <PhoneSimulator>
          <Routes>
            <Route path="/" element={<Navigate to="/patient-auth" replace />} />
            <Route path="/patient-auth" element={<Welcome />} />
            <Route
              path="/onboarding"
              element={session ? <Onboarding /> : <Navigate to="/patient-auth" replace />}
            />
            <Route
              path="/complete"
              element={session ? <Complete /> : <Navigate to="/patient-auth" replace />}
            />
            <Route
              path="/dashboard"
              element={session ? <Dashboard /> : <Navigate to="/patient-auth" replace />}
            />
            <Route
              path="/notifications"
              element={session ? <Notifications /> : <Navigate to="/patient-auth" replace />}
            />
            <Route
              path="/health-profile"
              element={session ? <HealthProfile /> : <Navigate to="/patient-auth" replace />}
            />
            <Route
              path="/insights"
              element={session ? <Insights /> : <Navigate to="/patient-auth" replace />}
            />
            <Route
              path="/settings"
              element={session ? <Settings /> : <Navigate to="/patient-auth" replace />}
            />
            <Route path="*" element={<Navigate to="/patient-auth" replace />} />
          </Routes>
        </PhoneSimulator>
      </HashRouter>
    </AuthContext.Provider>
  );
};

export default App;
