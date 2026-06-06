import React, { useState, useEffect } from 'react';
import { Save, User, CreditCard, Building, Sun, Moon, Database, Download, Upload } from 'lucide-react';
import { storage } from '../utils/storage';

const Settings = () => {
  const [settings, setSettings] = useState({
    businessName: '',
    pixKey: '',
    pixType: '',
    businessDescription: '',
    systemName: '',
    theme: 'dark'
  });
  const [saved, setSaved] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  useEffect(() => {
    setSettings(storage.getSettings());
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    storage.updateSettings(settings);
    setSaved(true);
    
    // Apply theme immediately
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExport = () => {
    try {
      const dataStr = storage.exportData();
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `backup_sistema_os_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      alert('Erro ao exportar dados: ' + error.message);
    }
  };

  const handleImport = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = (event) => {
      const result = storage.importData(event.target.result);
      if (result.success) {
        setImportStatus({ success: true, message: 'Dados importados com sucesso! Recarregando...' });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setImportStatus({ success: false, message: 'Erro ao importar dados: ' + result.error });
      }
    };
    fileReader.readAsText(file);
  };

  return (
    <div style={{ paddingRight: '20px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Configurações</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Personalize as informações do seu sistema e das ordens de serviço.</p>
      </header>

      <form onSubmit={handleSave} style={{ maxWidth: '800px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          <section className="glass-panel" style={{ padding: '25px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building size={20} color="var(--accent-color)" />
              Informações da Empresa
            </h2>
            
            <div style={{ marginBottom: '15px' }}>
              <label className="label">Nome Fantasia (Cabeçalho PDF)</label>
              <input 
                type="text" 
                className="input-field"
                value={settings.businessName}
                onChange={(e) => setSettings({...settings, businessName: e.target.value})}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label className="label">Descrição do Negócio</label>
              <input 
                type="text" 
                className="input-field"
                value={settings.businessDescription}
                onChange={(e) => setSettings({...settings, businessDescription: e.target.value})}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label className="label">Nome do Sistema (Sidebar)</label>
              <input 
                type="text" 
                className="input-field"
                value={settings.systemName}
                onChange={(e) => setSettings({...settings, systemName: e.target.value})}
              />
            </div>
          </section>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <section className="glass-panel" style={{ padding: '25px' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sun size={20} color="var(--warning-color)" />
                Aparência (Tema)
              </h2>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button"
                  className={`btn ${settings.theme === 'light' ? '' : 'btn-secondary'}`}
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setSettings({...settings, theme: 'light'})}
                >
                  <Sun size={18} /> Claro
                </button>
                <button 
                  type="button"
                  className={`btn ${settings.theme === 'dark' ? '' : 'btn-secondary'}`}
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setSettings({...settings, theme: 'dark'})}
                >
                  <Moon size={18} /> Escuro
                </button>
              </div>
            </section>

            <section className="glass-panel" style={{ padding: '25px' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={20} color="var(--success-color)" />
                Dados de Pagamento (Pix)
              </h2>
              
              <div style={{ marginBottom: '15px' }}>
                <label className="label">Tipo de Chave</label>
                <select 
                  className="input-field"
                  value={settings.pixType}
                  onChange={(e) => setSettings({...settings, pixType: e.target.value})}
                >
                  <option value="Celular">Celular</option>
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                  <option value="Email">Email</option>
                  <option value="Chave Aleatória">Chave Aleatória</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label className="label">Chave Pix</label>
                <input 
                  type="text" 
                  className="input-field"
                  value={settings.pixKey}
                  onChange={(e) => setSettings({...settings, pixKey: e.target.value})}
                />
              </div>
            </section>
          </div>

        </div>

        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '15px', alignItems: 'center' }}>
          {saved && <span style={{ color: 'var(--success-color)', fontSize: '0.9rem' }}>Configurações salvas!</span>}
          <button type="submit" className="btn" style={{ padding: '12px 30px' }}>
            <Save size={20} />
            Salvar Alterações
          </button>
        </div>
      </form>

      {/* Seção de Backup e Migração */}
      <section className="glass-panel" style={{ padding: '25px', marginTop: '30px', maxWidth: '800px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Database size={20} color="var(--warning-color)" />
          Backup e Migração de Dados (Computador ➔ Vercel)
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px', lineHeight: '1.6' }}>
          Como os dados do seu sistema são salvos diretamente no navegador (Local Storage), use as opções abaixo para transferir todas as suas informações (clientes, ordens de serviço, finanças e configurações) do seu computador local (localhost) para o site publicado na Vercel.
        </p>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--panel-border)', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '10px', color: 'var(--text-primary)' }}>1. Exportar Dados do Computador</h3>
            <button 
              type="button" 
              className="btn" 
              style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
              onClick={handleExport}
            >
              <Download size={18} /> Baixar Backup (.json)
            </button>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: '1.4' }}>
              Faça isso no seu ambiente local (localhost) para baixar um arquivo contendo todas as suas informações cadastradas.
            </p>
          </div>

          <div style={{ flex: 1, minWidth: '280px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--panel-border)', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '10px', color: 'var(--text-primary)' }}>2. Importar Dados na Vercel</h3>
            <div style={{ position: 'relative' }}>
              <input 
                type="file" 
                accept=".json"
                id="import-file-input"
                style={{ display: 'none' }}
                onChange={handleImport}
              />
              <button 
                type="button" 
                className="btn" 
                style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, var(--success-color), #059669)' }}
                onClick={() => document.getElementById('import-file-input').click()}
              >
                <Upload size={18} /> Selecionar Arquivo de Backup
              </button>
            </div>
            {importStatus && (
              <p style={{ 
                fontSize: '0.85rem', 
                fontWeight: '600', 
                marginTop: '10px', 
                color: importStatus.success ? 'var(--success-color)' : 'var(--danger-color)' 
              }}>
                {importStatus.message}
              </p>
            )}
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: '1.4' }}>
              Acesse o site da Vercel, entre nesta mesma tela e selecione o arquivo que você baixou na etapa anterior para restaurar tudo lá.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
