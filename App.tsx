import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Genetics from './pages/Genetics';
import Nudges from './pages/Nudges';
import Settings from './pages/Settings';
import CollisionAlert from './pages/CollisionAlert';
import Stabilized from './pages/Stabilized';
import BottomNav from './components/BottomNav';

const AppContent: React.FC = () => {
  return (
    <>
      <main className="bg-background-dark min-h-screen text-white pb-safe">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/genetics" element={<Genetics />} />
          <Route path="/nudges" element={<Nudges />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/collision" element={<CollisionAlert />} />
          <Route path="/stabilized" element={<Stabilized />} />
        </Routes>
      </main>
      <BottomNav />
    </>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
