import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, FileText, CheckCircle } from 'lucide-react';
import { storage } from '../utils/storage';
import Modal from '../components/Modal';
import {
  CATEGORIES,
  CelularForm,
  NotebookForm,
  SistemaForm,
  SiteForm,
  AutomacaoForm
} from '../components/BudgetCategoryForms';
import PrintBudget from '../components/PrintBudget';

// ─── helpers ────────────────────────────────────────────────
const calcTotal = (cat, d) => {
  if (cat === 'celular' || cat === 'notebook') {
    return (parseFloat(d.valorPeca) || 0) + (parseFloat(d.valorMaoObra) || 0);
  }
  return parseFloat(d.valorEstimado) || 0;
};

const buildDescription = (cat, d) => {
  if (cat === 'celular')
    return `Serviço: ${d.servico || '-'}\nModelo: ${d.modelo || '-'}\nIMEI: ${d.imei || '-'}\nCondição da peça: ${d.pecaCondicao || '-'}\nPrazo: ${d.prazo || '-'}\nObs: ${d.obs || '-'}`;
  if (cat === 'notebook')
    return `Serviço: ${d.servico || '-'}\nModelo: ${d.modelo || '-'}\nS.O.: ${d.so || '-'}\nConfiguração: ${d.config || '-'}\nPrazo: ${d.prazo || '-'}\nObs: ${d.obs || '-'}`;
  if (cat === 'sistema')
    return `Projeto: ${d.nomeProjeto || '-'}\nTipo: ${d.tipo || '-'}\nFuncionalidades: ${d.funcionalidades || '-'}\nTecnologia: ${d.tecnologia || '-'}\nIntegrações: ${d.integracoes || '-'}\nContrato: ${d.contrato || '-'}\nObs: ${d.obs || '-'}`;
  if (cat === 'site')
    return `Site: ${d.nomeSite || '-'}\nTipo: ${d.tipo || '-'}\nPáginas: ${d.paginas || '-'}\nDesign: ${d.design || '-'}\nFuncionalidades: ${d.funcionalidades || '-'}\nSEO: ${d.seo || '-'}\nObs: ${d.obs || '-'}`;
  if (cat === 'automacao')
    return `Automação: ${d.nomeAutomacao || '-'}\nTipo: ${d.tipo || '-'}\nPlataforma: ${d.plataforma || '-'}\nProcesso: ${d.processo || '-'}\nContrato: ${d.contrato || '-'}\nObs: ${d.obs || '-'}`;
  return '';
};

const getDeviceLabel = (cat, d) => {
  if (cat === 'celular') return d.modelo || 'Celular';
  if (cat === 'notebook') return d.modelo || 'Notebook';
  if (cat === 'sistema') return d.nomeProjeto || 'Sistema';
  if (cat === 'site') return d.nomeSite || 'Site';
  if (cat === 'automacao') return d.nomeAutomacao || 'Automação';
  return '-';
};

const today = () => new Date().toISOString().split('T')[0];

const emptyForm = {
  clientName: '', clientPhone: '', clientEmail: '',
  proposalName: '', proposalDate: today(), validityDays: '15', paymentOption: 'Pix à Vista',
};

// ─── Main component ──────────────────────────────────────────
const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [settings, setSettings] = useState(storage.getSettings());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUuid, setEditingUuid] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [filterCat, setFilterCat] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmApprove, setConfirmApprove] = useState(null);

  // modal state
  const [step, setStep] = useState(1); // 1=choose category, 2=fill form
  const [selectedCat, setSelectedCat] = useState(null);
  const [clientData, setClientData] = useState({ ...emptyForm });
  const [catData, setCatData] = useState({});

  useEffect(() => { loadData(); }, []);
  const loadData = () => { setBudgets(storage.getBudgets()); setSettings(storage.getSettings()); };

  const openNew = () => {
    setEditingUuid(null);
    setStep(1);
    setSelectedCat(null);
    setClientData({ ...emptyForm });
    setCatData({});
    setIsModalOpen(true);
  };

  const openEdit = (b) => {
    setEditingUuid(b.uuid);
    setSelectedCat(b.category);
    setClientData({
      clientName: b.clientName, clientPhone: b.clientPhone || '', clientEmail: b.clientEmail || '',
      proposalName: b.proposalName || '', proposalDate: b.proposalDate || today(),
      validityDays: b.validityDays || '15', paymentOption: b.paymentOption || 'Pix à Vista',
    });
    setCatData(b.catData || {});
    setStep(2);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUuid(null);
    setStep(1);
    setSelectedCat(null);
    setClientData({ ...emptyForm });
    setCatData({});
  };

  const handleSave = (e) => {
    e.preventDefault();
    const total = calcTotal(selectedCat, catData);
    const device = getDeviceLabel(selectedCat, catData);
    const description = buildDescription(selectedCat, catData);
    const data = {
      ...clientData,
      category: selectedCat,
      catData,
      device,
      description,
      price: total,
      status: 'Pendente',
      proposalName: clientData.proposalName,
      proposalDate: clientData.proposalDate || today(),
      validityDays: clientData.validityDays || '15',
      paymentOption: clientData.paymentOption || 'Pix à Vista',
    };
    if (editingUuid) {
      storage.updateBudget(editingUuid, data);
    } else {
      storage.addBudget(data);
    }
    loadData();
    closeModal();
  };

  const handleDelete = (uuid) => { setConfirmDelete(uuid); };
  const confirmDoDelete = () => { storage.deleteBudget(confirmDelete); loadData(); setConfirmDelete(null); };

  const approveBudget = (b) => { setConfirmApprove(b); };
  const confirmDoApprove = () => {
    const b = confirmApprove;
    storage.addOrder({
      clientName: b.clientName, clientPhone: b.clientPhone, clientEmail: b.clientEmail,
      device: b.device, service: b.description, price: b.price,
      laborPrice: b.price, partsPrice: 0, status: 'Pendente',
      category: b.category, serviceDate: new Date().toISOString().split('T')[0]
    });
    storage.updateBudget(b.uuid, { status: 'Aprovado' });
    loadData();
    setConfirmApprove(null);
  };

  const handlePrint = (b) => { setSelectedBudget(b); setTimeout(() => window.print(), 100); };

  const filtered = budgets.filter(b =>
    (filterCat === 'all' || b.category === filterCat) &&
    (b.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.device?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const catInfo = (id) => CATEGORIES.find(c => c.id === id);

  const renderCatForm = () => {
    const props = { data: catData, onChange: setCatData };
    if (selectedCat === 'celular') return <CelularForm {...props} />;
    if (selectedCat === 'notebook') return <NotebookForm {...props} />;
    if (selectedCat === 'sistema') return <SistemaForm {...props} />;
    if (selectedCat === 'site') return <SiteForm {...props} />;
    if (selectedCat === 'automacao') return <AutomacaoForm {...props} />;
    return null;
  };

  // ── Render ──────────────────────────────────────────────────
  return (
    <div style={{ paddingRight: 20 }}>
      <PrintBudget budget={selectedBudget} settings={settings} />

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Orçamentos</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Propostas comerciais por categoria de serviço.</p>
        </div>
        <button className="btn" onClick={openNew}><Plus size={20} /> Novo Orçamento</button>
      </header>

      {/* Filtros por categoria */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterCat('all')}
          style={{
            padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
            background: filterCat === 'all' ? 'var(--accent-color)' : 'var(--panel-bg)',
            color: filterCat === 'all' ? '#fff' : 'var(--text-secondary)',
            border: '1px solid var(--panel-border)'
          }}>Todos</button>
        {CATEGORIES.map(c => {
          const Icon = c.icon;
          const active = filterCat === c.id;
          return (
            <button key={c.id} onClick={() => setFilterCat(c.id)} style={{
              padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
              background: active ? c.color : 'var(--panel-bg)',
              color: active ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${active ? c.color : 'var(--panel-border)'}`,
              transition: 'all 0.2s'
            }}>
              <Icon size={14} />{c.label}
            </button>
          );
        })}
      </div>

      <div className="glass-panel" style={{ padding: 20, marginBottom: 25 }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Buscar por cliente ou projeto..." className="input-field"
            style={{ paddingLeft: 40 }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Categoria</th>
              <th>Cliente</th>
              <th>Projeto / Aparelho</th>
              <th>Valor</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Nenhum orçamento encontrado.</td></tr>
            )}
            {filtered.map(b => {
              const cat = catInfo(b.category);
              const Icon = cat?.icon;
              return (
                <tr key={b.uuid}>
                  <td>#{b.id}</td>
                  <td>
                    {cat && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                        <Icon size={14} style={{ color: cat.color }} />
                        <span style={{ color: cat.color, fontWeight: 500 }}>{cat.label}</span>
                      </span>
                    )}
                  </td>
                  <td>{b.clientName}</td>
                  <td>{b.device}</td>
                  <td style={{ fontWeight: 600 }}>R$ {(b.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span className={`status-badge ${b.status === 'Aprovado' ? 'status-concluido' : b.status === 'Recusado' ? 'status-pendente' : ''}`}
                      style={b.status === 'Pendente' ? { background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' } : {}}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                      <button onClick={() => handlePrint(b)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }} title="Imprimir Proposta"><FileText size={18} /></button>
                      {b.status === 'Pendente' && (
                        <button onClick={() => approveBudget(b)} style={{ background: 'none', border: 'none', color: 'var(--success-color)', cursor: 'pointer' }} title="Aprovar e Gerar OS"><CheckCircle size={18} /></button>
                      )}
                      <button onClick={() => openEdit(b)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer' }}><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(b.uuid)} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}
        title={step === 1 ? 'Selecionar Categoria' : `Orçamento — ${catInfo(selectedCat)?.label || ''}`}>

        {step === 1 ? (
          /* Step 1: Category picker */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            {CATEGORIES.map(c => {
              const Icon = c.icon;
              return (
                <button key={c.id} type="button" onClick={() => { setSelectedCat(c.id); setStep(2); }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                    padding: '24px 16px', borderRadius: 12, cursor: 'pointer',
                    border: `2px solid ${c.color}22`,
                    background: `${c.color}11`,
                    transition: 'all 0.2s',
                    fontFamily: 'inherit', color: 'var(--text-primary)'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${c.color}22`; e.currentTarget.style.borderColor = c.color; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${c.color}11`; e.currentTarget.style.borderColor = `${c.color}22`; }}>
                  <Icon size={32} style={{ color: c.color }} />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>{c.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          /* Step 2: Form */
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Proposta section */}
            <div style={{ padding: 16, borderRadius: 10, border: '1px solid var(--panel-border)', background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ fontWeight: 600, marginBottom: 14, fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📄 Dados da Proposta</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input className="input-field" placeholder="Nome da Proposta (ex: Orçamento Site Institucional)" value={clientData.proposalName}
                  onChange={e => setClientData({ ...clientData, proposalName: e.target.value })} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Data da Proposta</label>
                    <input type="date" className="input-field" value={clientData.proposalDate}
                      onChange={e => setClientData({ ...clientData, proposalDate: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Validade</label>
                    <select className="input-field" value={clientData.validityDays}
                      onChange={e => setClientData({ ...clientData, validityDays: e.target.value })}>
                      <option value="0">Sem validade</option>
                      <option value="7">7 dias</option>
                      <option value="10">10 dias</option>
                      <option value="15">15 dias</option>
                      <option value="20">20 dias</option>
                      <option value="30">30 dias</option>
                      <option value="45">45 dias</option>
                      <option value="60">60 dias</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pagamento via Pix</label>
                    <select className="input-field" value={clientData.paymentOption}
                      onChange={e => setClientData({ ...clientData, paymentOption: e.target.value })}>
                      <option>Pix à Vista</option>
                      <option>Pix Parcelado (2x)</option>
                      <option>Pix Parcelado (3x)</option>
                      <option>Pix Parcelado (4x)</option>
                      <option>Pix Parcelado (5x)</option>
                      <option>Pix Parcelado (6x)</option>
                      <option>Pix Parcelado (10x)</option>
                      <option>Pix Parcelado (12x)</option>
                      <option>A Combinar</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Client section */}
            <div style={{ padding: 16, borderRadius: 10, border: '1px solid var(--panel-border)', background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ fontWeight: 600, marginBottom: 14, fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>👤 Dados do Cliente</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input required className="input-field" placeholder="Nome do cliente *" value={clientData.clientName}
                  onChange={e => setClientData({ ...clientData, clientName: e.target.value })} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input className="input-field" placeholder="Telefone" value={clientData.clientPhone}
                    onChange={e => setClientData({ ...clientData, clientPhone: e.target.value })} />
                  <input className="input-field" type="email" placeholder="E-mail" value={clientData.clientEmail}
                    onChange={e => setClientData({ ...clientData, clientEmail: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Category form */}
            <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${catInfo(selectedCat)?.color}33`, background: `${catInfo(selectedCat)?.color}08` }}>
              <p style={{ fontWeight: 600, marginBottom: 14, fontSize: '0.9rem', color: catInfo(selectedCat)?.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Detalhes — {catInfo(selectedCat)?.label}
              </p>
              {renderCatForm()}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              {!editingUuid && (
                <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  ← Voltar
                </button>
              )}
              <button type="submit" className="btn" style={{ flex: 2, justifyContent: 'center' }}>
                Salvar Orçamento
              </button>
            </div>
          </form>
        )}
      </Modal>
      {/* Confirm Delete */}
      {confirmDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="glass-panel" style={{ padding: 32, maxWidth: 380, width: '90%', textAlign: 'center' }}>
            <Trash2 size={36} style={{ color: 'var(--danger-color)', marginBottom: 14 }} />
            <h2 style={{ marginBottom: 8, fontSize: '1.1rem' }}>Excluir orçamento?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 22, fontSize: '0.9rem' }}>Esta ação não pode ser desfeita.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancelar</button>
              <button onClick={confirmDoDelete} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: 'var(--danger-color)', color: '#fff', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer' }}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Approve */}
      {confirmApprove && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="glass-panel" style={{ padding: 32, maxWidth: 380, width: '90%', textAlign: 'center' }}>
            <CheckCircle size={36} style={{ color: 'var(--success-color)', marginBottom: 14 }} />
            <h2 style={{ marginBottom: 8, fontSize: '1.1rem' }}>Converter em Ordem de Serviço?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 22, fontSize: '0.9rem' }}>O orçamento será marcado como <strong>Aprovado</strong> e uma nova OS será criada.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => setConfirmApprove(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancelar</button>
              <button onClick={confirmDoApprove} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: 'var(--success-color)', color: '#fff', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer' }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
