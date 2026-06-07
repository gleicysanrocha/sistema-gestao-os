import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Search, Trash2, Edit2, MessageSquare, FileText } from 'lucide-react';
import { storage } from '../utils/storage';
import Modal from '../components/Modal';
import PrintOS from '../components/PrintOS';

const ServiceOrders = () => {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [settings, setSettings] = useState(storage.getSettings());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUuid, setEditingUuid] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // uuid to delete
  
  // Form State
  const [newOrder, setNewOrder] = useState({
    clientUuid: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    device: '',
    service: '',
    category: 'Outros',
    laborPrice: '',
    partsPrice: '',
    totalPrice: '',
    status: 'Pendente',
    serviceDate: new Date().toISOString().split('T')[0],
    customId: '',
    paymentMethod: 'Pix',
    paymentStatus: 'Pendente',
    partPurchaseDate: '',
    partPurchaseLocation: '',
    partPurchaseValue: ''
  });

  const categories = ['Celular', 'Computador', 'Montagem de Computador', 'Site / Aplicação', 'Manutenção', 'Consultoria', 'Outros'];
  const paymentMethods = ['Pix', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Transferência', 'Outro'];
  const paymentStatuses = ['Pendente', 'Pago', 'Parcial', 'Cancelado'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setOrders(storage.getOrders());
    setClients(storage.getClients());
    setSettings(storage.getSettings());
  };

  useEffect(() => {
    const labor = parseFloat(newOrder.laborPrice) || 0;
    const parts = parseFloat(newOrder.partsPrice) || 0;
    setNewOrder(prev => ({ ...prev, totalPrice: (labor + parts).toString() }));
  }, [newOrder.laborPrice, newOrder.partsPrice]);

  const handleAddOrder = (e) => {
    e.preventDefault();
    
    let clientName = newOrder.clientName;
    let clientUuid = newOrder.clientUuid;

    if (clientUuid) {
      const client = clients.find(c => c.uuid === clientUuid);
      if (client) clientName = client.name;
    }

    const orderData = {
      ...newOrder,
      clientName,
      clientUuid,
      id: newOrder.customId ? parseInt(newOrder.customId) : undefined,
      laborPrice: parseFloat(newOrder.laborPrice) || 0,
      partsPrice: parseFloat(newOrder.partsPrice) || 0,
      price: parseFloat(newOrder.totalPrice) || 0,
      partPurchaseDate: newOrder.partPurchaseDate || '',
      partPurchaseLocation: newOrder.partPurchaseLocation || '',
      partPurchaseValue: parseFloat(newOrder.partPurchaseValue) || 0
    };
    
    if (editingUuid) {
      storage.updateOrder(editingUuid, orderData);
    } else {
      storage.addOrder({ ...orderData, date: new Date().toISOString() });
    }
    
    loadData();
    closeModal();
  };

  const handleDelete = (uuid) => {
    setConfirmDelete(uuid);
  };

  const confirmDoDelete = () => {
    if (confirmDelete) {
      storage.deleteOrder(confirmDelete);
      loadData();
      setConfirmDelete(null);
    }
  };

  const openEdit = (order) => {
    setEditingUuid(order.uuid);
    setNewOrder({
      clientUuid: order.clientUuid || '',
      clientName: order.clientName || '',
      clientPhone: order.clientPhone || '',
      clientEmail: order.clientEmail || '',
      device: order.device || '',
      service: order.service || '',
      category: order.category || 'Outros',
      laborPrice: order.laborPrice?.toString() || '0',
      partsPrice: order.partsPrice?.toString() || '0',
      totalPrice: (order.price || 0).toString(),
      status: order.status || 'Pendente',
      serviceDate: order.serviceDate || (order.date ? order.date.split('T')[0] : new Date().toISOString().split('T')[0]),
      customId: order.id?.toString() || '',
      paymentMethod: order.paymentMethod || 'Pix',
      paymentStatus: order.paymentStatus || 'Pendente',
      partPurchaseDate: order.partPurchaseDate || '',
      partPurchaseLocation: order.partPurchaseLocation || '',
      partPurchaseValue: order.partPurchaseValue?.toString() || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUuid(null);
    setNewOrder({ 
      clientUuid: '', clientName: '', clientPhone: '', clientEmail: '', device: '', service: '', category: 'Outros', 
      laborPrice: '', partsPrice: '', totalPrice: '', status: 'Pendente', 
      serviceDate: new Date().toISOString().split('T')[0], customId: '',
      paymentMethod: 'Pix', paymentStatus: 'Pendente',
      partPurchaseDate: '', partPurchaseLocation: '', partPurchaseValue: ''
    });
  };

  const handlePrint = (order) => {
    setSelectedOrder(order);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const sendWhatsApp = (order) => {
    const client = clients.find(c => c.uuid === order.clientUuid);
    const phone = client?.phone || '';
    if (!phone) {
      alert('Este cliente não possui telefone cadastrado.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá ${order.clientName}!\n\n*${settings.businessName}*\n*Ordem de Serviço #${order.id}*\n` +
      `*Aparelho/Serviço:* ${order.device}\n` +
      `*Status:* ${order.status}\n` +
      `*Pagamento:* ${order.paymentStatus}\n` +
      `*Valor Total:* R$ ${(order.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n` +
      `*Forma de Pagamento:* ${order.paymentMethod}\n` +
      `*Pix (${settings.pixType}):* ${settings.pixKey}`
    );
    
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  const filteredOrders = orders.filter(order => 
    order.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.device?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id?.toString().includes(searchTerm) ||
    order.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientData = (uuid) => clients.find(c => c.uuid === uuid) || {};

  return (
    <div style={{ paddingRight: '20px' }}>
      <PrintOS order={selectedOrder} settings={settings} getClientData={getClientData} />

      {/* Main UI */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Ordens de Serviço</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gerencie seus atendimentos por categoria.</p>
        </div>
        <button className="btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          Nova OS
        </button>
      </header>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: '25px', display: 'flex', gap: '15px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Buscar por cliente, serviço, categoria ou ID..." 
            className="input-field" 
            style={{ paddingLeft: '40px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Aparelho/Serviço</th>
                <th>Status</th>
                <th>Pagamento</th>
                <th>Valor Total</th>
                <th style={{ textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.uuid}>
                  <td style={{ fontWeight: '500' }}>#{order.id}</td>
                  <td>{order.clientName}</td>
                  <td>
                    <div>{order.device}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.category}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${order.status === 'Concluído' ? 'status-concluido' : order.status === 'Em Andamento' ? 'status-andamento' : 'status-pendente'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${order.paymentStatus === 'Pago' ? 'status-concluido' : order.paymentStatus === 'Pendente' ? 'status-pendente' : ''}`} style={{ fontSize: '0.75rem' }}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    <div>R$ {(order.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    {(order.partPurchaseValue > 0 || order.partPurchaseLocation || order.partPurchaseDate) && (
                      <div 
                        style={{ 
                          fontSize: '0.72rem', 
                          fontWeight: 'normal', 
                          color: 'rgba(255,255,255,0.45)', 
                          marginTop: '4px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1px'
                        }}
                        title="Detalhes internos de compra da peça"
                      >
                        {order.partPurchaseValue > 0 && (
                          <span style={{ color: '#fca5a5' }}>Custo: R$ {order.partPurchaseValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        )}
                        {(order.partPurchaseLocation || order.partPurchaseDate) && (
                          <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)' }}>
                            {order.partPurchaseLocation || 'N/A'} {order.partPurchaseDate ? `(${new Date(order.partPurchaseDate + 'T12:00:00').toLocaleDateString('pt-BR')})` : ''}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button onClick={() => handlePrint(order)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }} title="Gerar PDF/Imprimir">
                        <FileText size={18} />
                      </button>
                      <button onClick={() => sendWhatsApp(order)} style={{ background: 'none', border: 'none', color: '#25D366', cursor: 'pointer' }} title="Enviar via WhatsApp">
                        <MessageSquare size={18} />
                      </button>
                      <button onClick={() => openEdit(order)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer' }} title="Editar">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(order.uuid)} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer' }} title="Excluir">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingUuid ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"}>
        <form onSubmit={handleAddOrder} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="label">Cliente</label>
            <select 
              className="input-field"
              value={newOrder.clientUuid}
              onChange={(e) => setNewOrder({...newOrder, clientUuid: e.target.value, clientName: ''})}
            >
              <option value="">-- Selecione um cliente cadastrado --</option>
              {clients.map(c => (
                <option key={c.uuid} value={c.uuid}>{c.name}</option>
              ))}
            </select>
          </div>
          
          {!newOrder.clientUuid && (
            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px dashed var(--panel-border)' }}>
              <input 
                type="text" 
                required={!newOrder.clientUuid}
                className="input-field" 
                placeholder="Nome do Novo Cliente"
                value={newOrder.clientName}
                onChange={(e) => setNewOrder({...newOrder, clientName: e.target.value})}
              />
            </div>
          )}

          <div className="grid-2">
            <div>
              <label className="label">Aparelho</label>
              <input 
                type="text" required className="input-field" 
                value={newOrder.device}
                onChange={(e) => setNewOrder({...newOrder, device: e.target.value})}
              />
            </div>
            <div>
              <label className="label">Categoria</label>
              <select className="input-field" value={newOrder.category} onChange={(e) => setNewOrder({...newOrder, category: e.target.value})}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label className="label">Forma de Pagamento</label>
              <select className="input-field" value={newOrder.paymentMethod} onChange={(e) => setNewOrder({...newOrder, paymentMethod: e.target.value})}>
                {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status de Pagamento</label>
              <select className="input-field" value={newOrder.paymentStatus} onChange={(e) => setNewOrder({...newOrder, paymentStatus: e.target.value})}>
                {paymentStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid-3">
            <div>
              <label className="label">Mão de Obra (R$)</label>
              <input type="number" step="0.01" className="input-field" value={newOrder.laborPrice} onChange={(e) => setNewOrder({...newOrder, laborPrice: e.target.value})} />
            </div>
            <div>
              <label className="label">Peças (R$)</label>
              <input type="number" step="0.01" className="input-field" value={newOrder.partsPrice} onChange={(e) => setNewOrder({...newOrder, partsPrice: e.target.value})} />
            </div>
            <div>
              <label className="label">Total</label>
              <input type="number" disabled className="input-field" value={newOrder.totalPrice} />
            </div>
          </div>

          {/* Dados Internos de Compra de Peças */}
          <div style={{ 
            padding: '15px', 
            background: 'rgba(99, 102, 241, 0.05)', 
            borderRadius: '10px', 
            border: '1px solid rgba(99, 102, 241, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔑 Controle de Peças (Uso Interno - Não é impresso)</span>
            </h4>
            <div className="grid-3">
              <div>
                <label className="label" style={{ fontSize: '0.8rem' }}>Data da Compra</label>
                <input 
                  type="date" 
                  className="input-field" 
                  style={{ fontSize: '0.85rem', padding: '8px 10px' }}
                  value={newOrder.partPurchaseDate} 
                  onChange={(e) => setNewOrder({...newOrder, partPurchaseDate: e.target.value})} 
                />
              </div>
              <div>
                <label className="label" style={{ fontSize: '0.8rem' }}>Local da Compra</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ex: Mercado Livre"
                  style={{ fontSize: '0.85rem', padding: '8px 10px' }}
                  value={newOrder.partPurchaseLocation} 
                  onChange={(e) => setNewOrder({...newOrder, partPurchaseLocation: e.target.value})} 
                />
              </div>
              <div>
                <label className="label" style={{ fontSize: '0.8rem' }}>Custo da Peça (R$)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="input-field" 
                  placeholder="0,00"
                  style={{ fontSize: '0.85rem', padding: '8px 10px' }}
                  value={newOrder.partPurchaseValue} 
                  onChange={(e) => setNewOrder({...newOrder, partPurchaseValue: e.target.value})} 
                />
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label className="label">Status OS</label>
              <select className="input-field" value={newOrder.status} onChange={(e) => setNewOrder({...newOrder, status: e.target.value})}>
                <option value="Pendente">Pendente</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
            <div>
              <label className="label">Data do Serviço</label>
              <input type="date" className="input-field" value={newOrder.serviceDate} onChange={(e) => setNewOrder({...newOrder, serviceDate: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="label">Descrição do Serviço</label>
            <textarea className="input-field" style={{ minHeight: '80px' }} value={newOrder.service} onChange={(e) => setNewOrder({...newOrder, service: e.target.value})} />
          </div>

          <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center' }}>Salvar</button>
        </form>
      </Modal>
      {/* Confirm Delete Modal */}
      {confirmDelete && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
        }}>
          <div className="glass-panel" style={{ padding: 32, maxWidth: 400, width: '90%', textAlign: 'center' }}>
            <Trash2 size={40} style={{ color: 'var(--danger-color)', marginBottom: 16 }} />
            <h2 style={{ marginBottom: 10, fontSize: '1.2rem' }}>Excluir Ordem de Serviço?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.9rem' }}>
              Esta ação não pode ser desfeita.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)} style={{ flex: 1, justifyContent: 'center' }}>
                Cancelar
              </button>
              <button onClick={confirmDoDelete} style={{
                flex: 1, padding: '10px 20px', borderRadius: 8, border: 'none',
                background: 'var(--danger-color)', color: '#fff', fontFamily: 'inherit',
                fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
                <Trash2 size={16} /> Excluir
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ServiceOrders;
