import React, { useState, useEffect } from 'react';
import { CheckCircle, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { storage } from '../utils/storage';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    setOrders(storage.getOrders());
    setTransactions(storage.getTransactions());
  }, []);

  const pendingCount = orders.filter(o => o.status !== 'Concluído').length;
  const completedCount = orders.filter(o => {
    if (o.status !== 'Concluído') return false;
    const date = new Date(o.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;
  
  const totalRevenue = transactions
    .filter(t => t.type === 'in')
    .reduce((sum, t) => sum + t.value, 0);

  const receivables = orders
    .filter(o => o.paymentStatus !== 'Pago' && o.paymentStatus !== 'Cancelado' && o.status !== 'Cancelado')
    .reduce((sum, o) => sum + (o.price || 0), 0);

  const stats = [
    { label: 'OS Pendentes', value: pendingCount.toString(), icon: <Clock size={24} />, color: 'var(--warning-color)' },
    { label: 'Concluídas/Mês', value: completedCount.toString(), icon: <CheckCircle size={24} />, color: 'var(--success-color)' },
    { label: 'Receita Total', value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: <TrendingUp size={24} />, color: 'var(--accent-color)' },
    { label: 'A Receber', value: `R$ ${receivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: <DollarSign size={24} />, color: '#f59e0b' },
  ];

  const recentOS = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div style={{ paddingRight: '20px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Bem-vindo de volta! Aqui está o resumo dos seus serviços.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {stats.map((stat, index) => (
          <div key={index} className="glass-panel" style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '15px', borderRadius: '12px', background: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '4px' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Atividade Recente</h2>
          <button className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>Ver todas</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Serviço</th>
              <th>Status</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {recentOS.length > 0 ? recentOS.map((os) => (
              <tr key={os.uuid}>
                <td style={{ fontWeight: '500' }}>#{os.id}</td>
                <td>{os.clientName}</td>
                <td>{os.service}</td>
                <td>
                  <span className={`status-badge ${os.status === 'Concluído' ? 'status-concluido' : os.status === 'Em Andamento' ? 'status-andamento' : 'status-pendente'}`}>
                    {os.status}
                  </span>
                </td>
                <td style={{ fontWeight: '600' }}>R$ {os.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>Nenhuma atividade recente.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
