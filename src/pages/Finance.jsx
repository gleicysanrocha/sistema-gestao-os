import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, TrendingDown, DollarSign, Plus, Trash2, Edit2, Clock, Calendar, Tag, Filter } from 'lucide-react';
import { storage } from '../utils/storage';
import Modal from '../components/Modal';

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState(storage.getSettings());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUuid, setEditingUuid] = useState(null);
  
  // Date Helpers for default filters: first day of current month to today
  const getFirstDayOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  };
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Filter States
  const [startDate, setStartDate] = useState(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState(getTodayDate());
  const [filterType, setFilterType] = useState('all'); // 'all', 'in', 'out'
  const [filterCategory, setFilterCategory] = useState('all');

  // Form State
  const [newTransaction, setNewTransaction] = useState({
    desc: '',
    type: 'in',
    value: '',
    category: 'Serviço'
  });

  const categories = ['Serviço', 'Hardware', 'Software', 'Infraestrutura', 'Marketing', 'Impostos', 'Aluguel', 'Outros'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTransactions(storage.getTransactions());
    setOrders(storage.getOrders());
    setSettings(storage.getSettings());
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const transactionData = {
      ...newTransaction,
      value: parseFloat(newTransaction.value) || 0
    };

    if (editingUuid) {
      storage.updateTransaction(editingUuid, transactionData);
    } else {
      storage.addTransaction(transactionData);
    }
    
    loadData();
    closeModal();
  };

  const handleDelete = (uuid) => {
    if (window.confirm('Deseja excluir esta transação?')) {
      storage.deleteTransaction(uuid);
      loadData();
    }
  };

  const openEdit = (t) => {
    setEditingUuid(t.uuid);
    setNewTransaction({
      desc: t.desc,
      type: t.type,
      value: t.value,
      category: t.category || 'Outros'
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUuid(null);
    setNewTransaction({ desc: '', type: 'in', value: '', category: 'Serviço' });
  };

  // Filter Logic
  const filteredTransactions = transactions.filter(t => {
    const tDate = t.date ? t.date.split('T')[0] : '';
    const matchDate = tDate >= startDate && tDate <= endDate;
    const matchType = filterType === 'all' || t.type === filterType;
    const matchCategory = filterCategory === 'all' || t.category === filterCategory;
    return matchDate && matchType && matchCategory;
  });

  // Financial Summary based on filters
  const revenue = filteredTransactions
    .filter(t => t.type === 'in')
    .reduce((sum, t) => sum + t.value, 0);

  const expenses = filteredTransactions
    .filter(t => t.type === 'out')
    .reduce((sum, t) => sum + t.value, 0);

  const balance = revenue - expenses;

  // Receivables (always global / based on active pending orders)
  const receivables = orders
    .filter(o => o.paymentStatus !== 'Pago' && o.paymentStatus !== 'Cancelado' && o.status !== 'Cancelado')
    .reduce((sum, o) => sum + (o.price || 0), 0);

  // Group transactions by category for breakdown analytics
  const categorySummary = {};
  filteredTransactions.forEach(t => {
    const cat = t.category || 'Outros';
    if (!categorySummary[cat]) {
      categorySummary[cat] = { in: 0, out: 0 };
    }
    if (t.type === 'in') {
      categorySummary[cat].in += t.value;
    } else {
      categorySummary[cat].out += t.value;
    }
  });

  // Calculate expense percentage ratio (expenses vs revenue)
  const expenseRatio = revenue > 0 ? Math.min(Math.round((expenses / revenue) * 100), 100) : 0;

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div style={{ paddingRight: '20px' }}>
      
      {/* ── SCREEN MAIN INTERFACE ── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Finanças</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Controle de fluxo de caixa e relatórios profissionais.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handlePrintReport}>
            <Download size={20} />
            Relatório PDF
          </button>
          <button className="btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Nova Transação
          </button>
        </div>
      </header>

      {/* ── FILTER CONTROL PANEL ── */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '25px' }}>
        <h4 style={{ margin: '0 0 14px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <Filter size={16} style={{ color: 'var(--accent-color)' }} />
          Filtros de Relatório & Fluxo
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 180px' }}>
            <label className="label" style={{ fontSize: '0.75rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} /> Data Inicial
            </label>
            <input type="date" className="input-field" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div style={{ flex: '1 1 180px' }}>
            <label className="label" style={{ fontSize: '0.75rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} /> Data Final
            </label>
            <input type="date" className="input-field" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <div style={{ flex: '1 1 140px' }}>
            <label className="label" style={{ fontSize: '0.75rem', marginBottom: '6px' }}>Tipo</label>
            <select className="input-field" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="all">Todos</option>
              <option value="in">Receitas (Entradas)</option>
              <option value="out">Despesas (Saídas)</option>
            </select>
          </div>
          <div style={{ flex: '1 1 160px' }}>
            <label className="label" style={{ fontSize: '0.75rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Tag size={13} /> Categoria
            </label>
            <select className="input-field" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="all">Todas</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── DYNAMIC CARDS PANEL ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '25px' }}>
        <div className="glass-panel" style={{ padding: '25px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', width: 'fit-content', marginBottom: '15px' }}>
            <TrendingUp size={24} />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Receitas do Período</p>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: '5px', color: 'var(--success-color)' }}>
            R$ {revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '25px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', width: 'fit-content', marginBottom: '15px' }}>
            <TrendingDown size={24} />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Despesas do Período</p>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: '5px', color: 'var(--danger-color)' }}>
            R$ {expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '25px', background: balance >= 0 ? 'rgba(99, 102, 241, 0.03)' : 'rgba(239, 68, 68, 0.03)', border: balance >= 0 ? '1px solid rgba(99, 102, 241, 0.15)' : '1px solid rgba(239, 68, 68, 0.15)' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: balance >= 0 ? 'rgba(99, 102, 241, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: balance >= 0 ? 'var(--accent-color)' : 'var(--danger-color)', width: 'fit-content', marginBottom: '15px' }}>
            <DollarSign size={24} />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Saldo Líquido</p>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: '5px', color: balance >= 0 ? 'var(--accent-color)' : 'var(--danger-color)' }}>
            R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '25px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', width: 'fit-content', marginBottom: '15px' }}>
            <Clock size={24} />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>A Receber (Geral)</p>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: '5px', color: '#f59e0b' }}>
            R$ {receivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      {/* ── METRICS SECTION (Expense ratio bar) ── */}
      {revenue > 0 && (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Comprometimento de Receita (Despesas / Entradas)</span>
            <span style={{ fontWeight: 600, color: expenseRatio > 70 ? 'var(--danger-color)' : expenseRatio > 40 ? 'var(--warning-color)' : 'var(--success-color)' }}>{expenseRatio}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${expenseRatio}%`, 
              height: '100%', 
              background: expenseRatio > 70 ? 'var(--danger-color)' : expenseRatio > 40 ? 'var(--warning-color)' : 'var(--success-color)',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      {/* ── TRANSACTION LIST TABLE ── */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px' }}>Transações do Período</h2>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Data</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th style={{ textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? [...filteredTransactions].reverse().map((t) => (
                <tr key={t.uuid}>
                  <td style={{ fontWeight: '500' }}>{t.desc}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                  <td><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.category || 'Outros'}</span></td>
                  <td style={{ fontWeight: '600', color: t.type === 'in' ? 'var(--success-color)' : 'var(--danger-color)' }}>
                    {t.type === 'in' ? '+' : '-'} R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button onClick={() => openEdit(t)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer' }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(t.uuid)} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>Nenhuma transação registrada neste período.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── TRANSACTION MODAL (Add / Edit) ── */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingUuid ? "Editar Transação" : "Nova Transação"}>
        <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Descrição</label>
            <input 
              type="text" 
              required 
              className="input-field" 
              placeholder="Ex: Pagamento OS #1045"
              value={newTransaction.desc}
              onChange={(e) => setNewTransaction({...newTransaction, desc: e.target.value})}
            />
          </div>
          <div className="grid-2">
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tipo</label>
              <select 
                className="input-field"
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
              >
                <option value="in">Receita (Entrada)</option>
                <option value="out">Despesa (Saída)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Valor (R$)</label>
              <input 
                type="number" 
                step="0.01" 
                required 
                className="input-field" 
                placeholder="0,00"
                value={newTransaction.value}
                onChange={(e) => setNewTransaction({...newTransaction, value: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Categoria</label>
            <select 
              className="input-field"
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <button type="submit" className="btn" style={{ marginTop: '10px', width: '100%', justifyContent: 'center' }}>
            {editingUuid ? "Salvar Alterações" : "Registrar Transação"}
          </button>
        </form>
      </Modal>

      {/* ── PRINT-ONLY FINANCIAL REPORT ── */}
      <div className="print-only" style={{
        fontFamily: "'Outfit', 'Inter', 'Segoe UI', Arial, sans-serif",
        background: '#fff',
        color: '#1e293b',
        padding: '10mm 12mm',
        boxSizing: 'border-box',
        minHeight: '100vh',
        lineHeight: 1.4,
        fontSize: '11px'
      }}>
        {/* Report Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          borderBottom: '2px solid #0f172a', 
          paddingBottom: '12px', 
          marginBottom: '20px' 
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>
              {settings.businessName}
            </h1>
            <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
              Relatório Financeiro de Atividades · {settings.businessDescription}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Filtro de Período</p>
            <p style={{ margin: '2px 0 0', fontSize: '12px', fontWeight: 700, color: '#4f46e5' }}>
              {new Date(startDate + 'T12:00:00').toLocaleDateString('pt-BR')} a {new Date(endDate + 'T12:00:00').toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Indicators Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '25px' }}>
          {[
            ['Receita Total', revenue, '#059669', '#ecfdf5', 'Entradas no período'],
            ['Despesas Totais', expenses, '#dc2626', '#fef2f2', 'Saídas no período'],
            ['Saldo Líquido', balance, balance >= 0 ? '#4f46e5' : '#dc2626', balance >= 0 ? '#f5f3ff' : '#fff5f5', 'Resultado líquido'],
            ['A Receber (Geral)', receivables, '#d97706', '#fffbeb', 'Valores pendentes']
          ].map(([label, val, color, bg, desc]) => (
            <div key={label} style={{ 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px', 
              padding: '10px 14px', 
              background: bg 
            }}>
              <p style={{ margin: 0, fontSize: '9px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
              <h3 style={{ margin: '4px 0 2px', fontSize: '16px', fontWeight: 800, color: color }}>
                R$ {val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p style={{ margin: 0, fontSize: '8px', color: '#94a3b8' }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Category Summary Table */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', color: '#0f172a', letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>
            1. Resumo Consolidado por Categoria
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
            <thead>
              <tr style={{ background: '#0f172a', color: '#fff' }}>
                <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 700, borderTopLeftRadius: '4px' }}>Categoria</th>
                <th style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 700 }}>Receitas (Entradas)</th>
                <th style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 700 }}>Despesas (Saídas)</th>
                <th style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 700, borderTopRightRadius: '4px' }}>Saldo da Categoria</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(categorySummary).length > 0 ? Object.keys(categorySummary).map(cat => {
                const s = categorySummary[cat];
                const catBal = s.in - s.out;
                return (
                  <tr key={cat} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#334155' }}>{cat}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', color: '#059669', fontWeight: 500 }}>R$ {s.in.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', color: '#dc2626', fontWeight: 500 }}>R$ {s.out.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: catBal >= 0 ? '#4f46e5' : '#dc2626' }}>R$ {catBal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="4" style={{ padding: '10px', textAlign: 'center', color: '#64748b' }}>Nenhuma atividade registrada no período.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detailed Transactions List */}
        <div>
          <h3 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', color: '#0f172a', letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>
            2. Detalhamento de Lançamentos do Período
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '5px 8px', textAlign: 'left', color: '#475569', fontWeight: 700, borderTopLeftRadius: '4px' }}>Data</th>
                <th style={{ padding: '5px 8px', textAlign: 'left', color: '#475569', fontWeight: 700 }}>Descrição do Lançamento</th>
                <th style={{ padding: '5px 8px', textAlign: 'left', color: '#475569', fontWeight: 700 }}>Categoria</th>
                <th style={{ padding: '5px 8px', textAlign: 'right', color: '#475569', fontWeight: 700, borderTopRightRadius: '4px' }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? filteredTransactions.map(t => (
                <tr key={t.uuid} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '6px 8px', color: '#64748b' }}>{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                  <td style={{ padding: '6px 8px', fontWeight: 500, color: '#1e293b' }}>{t.desc}</td>
                  <td style={{ padding: '6px 8px', color: '#64748b' }}>{t.category || 'Outros'}</td>
                  <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: t.type === 'in' ? '#059669' : '#dc2626' }}>
                    {t.type === 'in' ? '+' : '-'} R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ padding: '10px', textAlign: 'center', color: '#64748b' }}>Nenhum lançamento para o filtro selecionado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Signatures */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginTop: '40px', padding: '0 10px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '6px' }}>
              <p style={{ margin: 0, fontSize: '10px', color: '#1e293b', fontWeight: 700 }}>Responsável Financeiro</p>
              <p style={{ margin: '1px 0 0', fontSize: '8px', color: '#64748b' }}>{settings.businessName}</p>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '6px' }}>
              <p style={{ margin: 0, fontSize: '10px', color: '#1e293b', fontWeight: 700 }}>Data de Emissão</p>
              <p style={{ margin: '1px 0 0', fontSize: '8px', color: '#64748b' }}>{new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Finance;
