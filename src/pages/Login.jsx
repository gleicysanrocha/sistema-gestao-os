import React, { useState } from 'react';
import { auth } from '../utils/firebaseClient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Lock, Mail, Database, Terminal, ShieldAlert } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!auth) {
      setErrorMsg('Firebase não configurado no arquivo .env');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      let msg = 'Erro de rede ou conexão. Verifique os dados.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'E-mail ou senha incorretos.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Formato de e-mail inválido.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const isConfigured = auth !== null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      padding: '20px',
      zIndex: 9999,
      backgroundColor: 'var(--bg-color)',
      backgroundImage: 'var(--bg-gradient)'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '420px',
        width: '100%',
        padding: '40px 30px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow decoration */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.15)',
          filter: 'blur(30px)',
          zIndex: 0
        }} />

        <div style={{ textAlign: 'center', marginBottom: '35px', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--accent-color)' }}>
            Gestão <span style={{ color: 'var(--text-primary)' }}>OS</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
            Acesse seus dados em segurança de qualquer lugar (Firebase)
          </p>
        </div>

        {!isConfigured ? (
          /* Setup Warning Wizard */
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '12px',
              padding: '20px',
              color: '#f59e0b',
              marginBottom: '20px',
              fontSize: '0.88rem',
              lineHeight: '1.5'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', marginBottom: '8px' }}>
                <ShieldAlert size={18} />
                <span>Firebase pendente</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                Ainda não detectamos a conexão com o Firebase. Para que o site funcione na nuvem, você deve configurar as variáveis de ambiente no arquivo `.env` ou no painel da Vercel:
              </p>
              <div style={{ 
                background: 'rgba(0,0,0,0.3)', 
                fontFamily: 'monospace', 
                fontSize: '0.75rem', 
                padding: '10px', 
                borderRadius: '8px', 
                marginTop: '10px',
                color: '#f3f4f6',
                border: '1px solid rgba(255,255,255,0.05)',
                whiteSpace: 'nowrap',
                overflowX: 'auto'
              }}>
                <div>VITE_FIREBASE_API_KEY</div>
                <div>VITE_FIREBASE_AUTH_DOMAIN</div>
                <div>VITE_FIREBASE_PROJECT_ID</div>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textAlign: 'center', lineHeight: '1.5' }}>
              Para rodar o sistema offline enquanto não configura o Firebase, remova os placeholders do seu arquivo `.env` para pular a autenticação.
            </p>
          </div>
        ) : (
          /* Actual Login Form */
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 1 }}>
            {errorMsg && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'var(--danger-color)',
                fontSize: '0.85rem',
                fontWeight: '500'
              }}>
                {errorMsg}
              </div>
            )}

            <div>
              <label className="label" style={{ fontSize: '0.75rem' }}>E-mail de Acesso</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="email"
                  required
                  placeholder="seu-email@exemplo.com"
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label" style={{ fontSize: '0.75rem' }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="password"
                  required
                  placeholder="Sua senha secreta"
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '14px' }}
            >
              {loading ? 'Entrando...' : 'Entrar no Sistema'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
