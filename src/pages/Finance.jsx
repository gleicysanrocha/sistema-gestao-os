import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, TrendingDown, DollarSign, Plus, Trash2, Edit2, Clock } from 'lucide-react';
import { storage } from '../utils/storage';
import Modal from '../components/Modal';

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUuid, setEditingUuid] = useState(null);
  
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

  const revenue = transactions
    .filter(t => t.type === 'in')
    .reduce((sum, t) => sum + t.value, 0);

  const expenses = transactions
    .filter(t => t.type === 'out')
    .reduce((sum, t) => sum + t.value, 0);

  const balance = revenue - expenses;

  const receivables = orders
    .filter(o => o.paymentStatus !== 'Pago' && o.paymentStatus !== 'Cancelado' && o.status !== 'Cancelado')
    .reduce((sum, o) => sum + (o.price || 0), 0);

  return (
    <div style={{ paddingRight: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Finanças</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Controle total de suas entradas e saídas.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary">
            <Download size={20} />
            Exportar
          </button>
          <button className="btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Nova Transação
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '25px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', width: 'fit-content', marginBottom: '15px' }}>
            <TrendingUp size={24} />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Receita Total</p>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: '5px', color: 'var(--success-color)' }}>
            R$ {revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '25px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', width: 'fit-content', marginBottom: '15px' }}>
            <Clock size={24} />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Valores a Receber</p>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: '5px', color: '#f59e0b' }}>
            R$ {receivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '25px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', width: 'fit-content', marginBottom: '15px' }}>
            <TrendingDown size={24} />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Despesas Totais</p>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: '5px', color: 'var(--danger-color)' }}>
            R$ {expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '25px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-color)', width: 'fit-content', marginBottom: '15px' }}>
            <DollarSign size={24} />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Saldo Líquido</p>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: '5px', color: 'var(--accent-color)' }}>
            R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '30px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px' }}>Transações Recentes</h2>
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
            {transactions.length > 0 ? [...transactions].reverse().map((t) => (
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
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>Nenhuma transação registrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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
    </div>
  );
};

export default Finance;
