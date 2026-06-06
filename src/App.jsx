import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ServiceOrders from './pages/ServiceOrders';
import Finance from './pages/Finance';
import Clients from './pages/Clients';
import Settings from './pages/Settings';
import Budgets from './pages/Budgets';
import Login from './pages/Login';
import { storage } from './utils/storage';
import { auth } from './utils/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Apply local theme on load
    const settings = storage.getSettings();
    document.documentElement.setAttribute('data-theme', settings.theme || 'dark');

    if (!auth) {
      setInitializing(false);
      return;
    }

    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setSyncing(true);
        await storage.syncWithCloud();
        
        // Apply settings/theme after sync
        const settingsAfterSync = storage.getSettings();
        document.documentElement.setAttribute('data-theme', settingsAfterSync.theme || 'dark');
        
        setSyncing(false);
      }
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const isCloudConfigured = auth !== null;

  if (isCloudConfigured && initializing) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: 'var(--bg-color)',
        backgroundImage: 'var(--bg-gradient)'
      }}>
        <div className="glass-panel" style={{ padding: '40px 30px', textAlign: 'center', maxWidth: '350px' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Carregando sistema...</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Preparando ambiente de trabalho...</p>
        </div>
      </div>
    );
  }

  if (isCloudConfigured && syncing) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: 'var(--bg-color)',
        backgroundImage: 'var(--bg-gradient)'
      }}>
        <div className="glass-panel" style={{ padding: '40px 30px', textAlign: 'center', maxWidth: '350px' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Sincronizando nuvem...</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Buscando seus dados salvos online...</p>
        </div>
      </div>
    );
  }

  if (isCloudConfigured && !user) {
    return <Login />;
  }

  return (
    <Router>
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/os" element={<ServiceOrders />} />
            <Route path="/orcamentos" element={<Budgets />} />
            <Route path="/financas" element={<Finance />} />
            <Route path="/clientes" element={<Clients />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
