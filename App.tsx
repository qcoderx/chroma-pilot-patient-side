import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import PhoneSimulator from './components/PhoneSimulator';
import Welcome from './pages/Welcome';
import Onboarding from './pages/Onboarding';
import Complete from './pages/Complete';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import HealthProfile from './pages/HealthProfile';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import { initAuth, AuthSession } from './utils/auth';

// Create a context for authentication
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

  // Initialize auth on app load - check for magic link or existing session
  useEffect(() => {
    const authSession = initAuth();
    if (authSession) {
      setSession(authSession);
      console.log('🔐 Session initialized:', authSession.payload.name || authSession.payload.sub);
    }
    setIsInitialized(true);
  }, []);

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session, setSession }}>
      <HashRouter>
        <PhoneSimulator>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/complete" element={<Complete />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/health-profile" element={<HealthProfile />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </PhoneSimulator>
      </HashRouter>
    </AuthContext.Provider>
  );
};

export default App;
