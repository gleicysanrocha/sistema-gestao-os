import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Phone, Search, Edit2, Trash2 } from 'lucide-react';
import { storage } from '../utils/storage';
import Modal from '../components/Modal';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUuid, setEditingUuid] = useState(null);
  
  // Form State
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setClients(storage.getClients());
    setOrders(storage.getOrders());
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    if (editingUuid) {
      storage.updateClient(editingUuid, newClient);
    } else {
      storage.addClient(newClient);
    }
    loadData();
    closeModal();
  };

  const handleDelete = (uuid) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente? Isso não apagará as ordens de serviço dele.')) {
      storage.deleteClient(uuid);
      loadData();
    }
  };

  const openEdit = (client) => {
    setEditingUuid(client.uuid);
    setNewClient({
      name: client.name,
      email: client.email || '',
      phone: client.phone || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUuid(null);
    setNewClient({ name: '', email: '', phone: '' });
  };

  const getClientOrderCount = (clientUuid) => {
    return orders.filter(o => o.clientUuid === clientUuid).length;
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div style={{ paddingRight: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Clientes</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gerencie sua base de contatos.</p>
        </div>
        <button className="btn" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={20} />
          Novo Cliente
        </button>
      </header>

      <div className="glass-panel" style={{ padding: '15px', marginBottom: '25px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Buscar por nome, email ou telefone..." 
            className="input-field" 
            style={{ paddingLeft: '40px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredClients.length > 0 ? filteredClients.map(client => (
          <div key={client.uuid} className="glass-panel" style={{ padding: '25px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' }}>
              <button onClick={() => openEdit(client)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(client.uuid)} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer' }}>
                <Trash2 size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '12px', 
                background: 'var(--accent-color)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.2rem', 
                fontWeight: 'bold',
                color: 'white'
              }}>
                {client.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontWeight: '600' }}>{client.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{getClientOrderCount(client.uuid)} ordens de serviço</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <Mail size={16} />
                <span>{client.email || 'Não informado'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <Phone size={16} />
                <span>{client.phone || 'Não informado'}</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Nenhum cliente encontrado.
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingUuid ? "Editar Cliente" : "Cadastrar Novo Cliente"}>
        <form onSubmit={handleAddClient} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nome Completo</label>
            <input 
              type="text" 
              required 
              className="input-field" 
              placeholder="Ex: João Silva"
              value={newClient.name}
              onChange={(e) => setNewClient({...newClient, name: e.target.value})}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="joao@exemplo.com"
              value={newClient.email}
              onChange={(e) => setNewClient({...newClient, email: e.target.value})}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Telefone / WhatsApp (Apenas números)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ex: 11999998888"
              value={newClient.phone}
              onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
            />
          </div>
          <button type="submit" className="btn" style={{ marginTop: '10px', width: '100%', justifyContent: 'center' }}>
            {editingUuid ? "Salvar Alterações" : "Salvar Cliente"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Clients;
