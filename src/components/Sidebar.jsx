import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Wallet, Users, Settings as SettingsIcon, LogOut, FileText } from 'lucide-react';
import { storage } from '../utils/storage';
import { auth } from '../utils/firebaseClient';
import { signOut } from 'firebase/auth';

const Sidebar = () => {
  const [systemName, setSystemName] = useState('Gestão Gleicy Rocha');

  useEffect(() => {
    const settings = storage.getSettings();
    if (settings.systemName) {
      setSystemName(settings.systemName);
    }
  }, []);

  const nameParts = systemName.split(' ');
  const firstPart = nameParts[0];
  const restPart = nameParts.slice(1).join(' ');

  const handleLogout = async () => {
    if (auth) {
      if (window.confirm('Deseja realmente sair da sua conta? Os dados locais serão limpos para sua segurança.')) {
        await signOut(auth);
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  return (
    <aside className="sidebar glass-panel">
      <div style={{ marginBottom: '40px', padding: '10px' }}>
        <h2 style={{ color: 'var(--accent-color)', fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
          {firstPart} <span style={{ color: 'var(--text-primary)' }}>{restPart}</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '4px' }}>Workplace Profissional</p>
      </div>

      <nav style={{ flex: 1 }}>
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/os" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <ClipboardList size={20} />
          <span>Ordens de Serviço</span>
        </NavLink>

        <NavLink to="/orcamentos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <FileText size={20} />
          <span>Orçamentos</span>
        </NavLink>

        <NavLink to="/financas" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <Wallet size={20} />
          <span>Finanças</span>
        </NavLink>

        <NavLink to="/clientes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <Users size={20} />
          <span>Clientes</span>
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--panel-border)', paddingTop: '20px' }}>
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <SettingsIcon size={20} />
          <span>Configurações</span>
        </NavLink>
        {auth && (
          <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
