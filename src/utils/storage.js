import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient';

const STORAGE_KEYS = {
  ORDERS: 'os_manager_orders',
  CLIENTS: 'os_manager_clients',
  TRANSACTIONS: 'os_manager_transactions',
  SETTINGS: 'os_manager_settings',
  BUDGETS: 'os_manager_budgets',
};

const getFromStorage = (key, defaultValue = []) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Synchronous helper to get active Supabase user ID from local storage
const getUserId = () => {
  if (!supabase) return null;
  const projectRef = import.meta.env.VITE_SUPABASE_URL.replace('https://', '').split('.')[0];
  const sessionStr = localStorage.getItem(`sb-${projectRef}-auth-token`);
  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr);
      return session?.user?.id || null;
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Background Cloud Sync
const syncRecord = async (table, data, isDelete = false) => {
  const userId = getUserId();
  if (!userId || !supabase) return;

  try {
    if (isDelete) {
      await supabase.from(table).delete().eq('uuid', data.uuid).eq('user_id', userId);
    } else {
      if (table === 'settings') {
        await supabase.from('settings').upsert({
          user_id: userId,
          ...data
        });
      } else {
        await supabase.from(table).upsert({
          user_id: userId,
          ...data
        });
      }
    }
  } catch (err) {
    console.error(`Erro ao sincronizar tabela ${table} com Supabase:`, err);
  }
};

export const storage = {
  // Orders
  getOrders: () => getFromStorage(STORAGE_KEYS.ORDERS),
  addOrder: (order) => {
    const orders = storage.getOrders();
    const newOrder = { 
      ...order, 
      id: order.id || Math.floor(1000 + Math.random() * 9000).toString(),
      uuid: uuidv4(),
      date: order.date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    saveToStorage(STORAGE_KEYS.ORDERS, orders);

    // Sync with transactions (Income)
    if (newOrder.status === 'Concluído') {
      storage.addTransaction({
        desc: `OS #${newOrder.id} - ${newOrder.device}`,
        type: 'in',
        category: 'Serviço',
        value: newOrder.price || 0,
        date: newOrder.date,
        orderUuid: newOrder.uuid,
        isPartExpense: false
      });
    }

    // Sync with transactions (Part Purchase Expense)
    if (newOrder.partPurchaseValue > 0) {
      storage.addTransaction({
        desc: `Peça OS #${newOrder.id} - ${newOrder.device}`,
        type: 'out',
        category: 'Hardware',
        value: newOrder.partPurchaseValue,
        date: newOrder.partPurchaseDate || newOrder.date || new Date().toISOString(),
        orderUuid: newOrder.uuid,
        isPartExpense: true
      });
    }

    // Sync with cloud
    syncRecord('orders', newOrder);

    return newOrder;
  },
  updateOrder: (uuid, updates) => {
    const orders = storage.getOrders();
    const index = orders.findIndex(o => o.uuid === uuid);
    if (index !== -1) {
      const oldOrder = orders[index];
      const updatedOrder = { ...oldOrder, ...updates, updatedAt: new Date().toISOString() };
      orders[index] = updatedOrder;
      saveToStorage(STORAGE_KEYS.ORDERS, orders);

      // Sync with transactions
      const transactions = storage.getTransactions();

      // 1. Income Transaction Sync
      const incomeIndex = transactions.findIndex(t => t.orderUuid === uuid && !t.isPartExpense);
      if (updatedOrder.status === 'Concluído') {
        const transData = {
          desc: `OS #${updatedOrder.id} - ${updatedOrder.device}`,
          type: 'in',
          category: 'Serviço',
          value: updatedOrder.price || 0,
          date: updatedOrder.date || new Date().toISOString(),
          orderUuid: uuid,
          isPartExpense: false
        };
        if (incomeIndex !== -1) {
          transactions[incomeIndex] = { ...transactions[incomeIndex], ...transData };
          saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
        } else {
          storage.addTransaction(transData);
        }
      } else {
        if (incomeIndex !== -1) {
          storage.deleteTransaction(transactions[incomeIndex].uuid);
        }
      }

      // 2. Part Expense Transaction Sync
      const currentTransactions = storage.getTransactions();
      const expenseIndex = currentTransactions.findIndex(t => t.orderUuid === uuid && t.isPartExpense);
      if (updatedOrder.partPurchaseValue > 0) {
        const expenseData = {
          desc: `Peça OS #${updatedOrder.id} - ${updatedOrder.device}`,
          type: 'out',
          category: 'Hardware',
          value: updatedOrder.partPurchaseValue,
          date: updatedOrder.partPurchaseDate || updatedOrder.date || new Date().toISOString(),
          orderUuid: uuid,
          isPartExpense: true
        };
        if (expenseIndex !== -1) {
          currentTransactions[expenseIndex] = { ...currentTransactions[expenseIndex], ...expenseData };
          saveToStorage(STORAGE_KEYS.TRANSACTIONS, currentTransactions);
        } else {
          storage.addTransaction(expenseData);
        }
      } else {
        if (expenseIndex !== -1) {
          storage.deleteTransaction(currentTransactions[expenseIndex].uuid);
        }
      }

      // Sync with cloud
      syncRecord('orders', updatedOrder);

      return updatedOrder;
    }
    return null;
  },
  deleteOrder: (uuid) => {
    const orders = storage.getOrders();
    const filtered = orders.filter(o => o.uuid !== uuid);
    saveToStorage(STORAGE_KEYS.ORDERS, filtered);

    // Sync with transactions (delete associated transactions)
    const transactions = storage.getTransactions();
    const remainingTrans = transactions.filter(t => t.orderUuid !== uuid);
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, remainingTrans);

    // Sync with cloud
    syncRecord('orders', { uuid }, true);
  },

  // Clients
  getClients: () => getFromStorage(STORAGE_KEYS.CLIENTS),
  addClient: (client) => {
    const clients = storage.getClients();
    const newClient = { ...client, uuid: uuidv4(), createdAt: new Date().toISOString() };
    clients.push(newClient);
    saveToStorage(STORAGE_KEYS.CLIENTS, clients);

    // Sync with cloud
    syncRecord('clients', newClient);

    return newClient;
  },
  updateClient: (uuid, updates) => {
    const clients = storage.getClients();
    const index = clients.findIndex(c => c.uuid === uuid);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updates, updatedAt: new Date().toISOString() };
      saveToStorage(STORAGE_KEYS.CLIENTS, clients);

      // Sync with cloud
      syncRecord('clients', clients[index]);

      return clients[index];
    }
    return null;
  },
  deleteClient: (uuid) => {
    const clients = storage.getClients();
    const filtered = clients.filter(c => c.uuid !== uuid);
    saveToStorage(STORAGE_KEYS.CLIENTS, filtered);

    // Sync with cloud
    syncRecord('clients', { uuid }, true);
  },

  // Transactions
  getTransactions: () => getFromStorage(STORAGE_KEYS.TRANSACTIONS),
  addTransaction: (transaction) => {
    const transactions = storage.getTransactions();
    const newTransaction = { 
      ...transaction, 
      uuid: uuidv4(), 
      date: transaction.date || new Date().toISOString() 
    };
    transactions.push(newTransaction);
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);

    // Sync with cloud
    syncRecord('transactions', newTransaction);

    return newTransaction;
  },
  updateTransaction: (uuid, updates) => {
    const transactions = storage.getTransactions();
    const index = transactions.findIndex(t => t.uuid === uuid);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updates };
      saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);

      // Sync with cloud
      syncRecord('transactions', transactions[index]);

      return transactions[index];
    }
    return null;
  },
  deleteTransaction: (uuid) => {
    const transactions = storage.getTransactions();
    const filtered = transactions.filter(t => t.uuid !== uuid);
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, filtered);

    // Sync with cloud
    syncRecord('transactions', { uuid }, true);
  },

  // Settings
  getSettings: () => getFromStorage(STORAGE_KEYS.SETTINGS, {
    businessName: 'Gleicy Rocha',
    pixKey: '(11) 99116-9336',
    pixType: 'Celular',
    businessDescription: 'Especialista em Manutenção, Sites e Consultoria TI',
    systemName: 'Gestão Gleicy Rocha',
    theme: 'dark'
  }),
  updateSettings: (updates) => {
    const current = storage.getSettings();
    const newSettings = { ...current, ...updates };
    saveToStorage(STORAGE_KEYS.SETTINGS, newSettings);

    // Sync with cloud
    syncRecord('settings', newSettings);
  },

  // Budgets
  getBudgets: () => getFromStorage(STORAGE_KEYS.BUDGETS),
  addBudget: (budget) => {
    const budgets = storage.getBudgets();
    const id = budgets.length > 0 ? Math.max(...budgets.map(b => b.id)) + 1 : 2001;
    const newBudget = { 
      ...budget, 
      id, 
      uuid: uuidv4(),
      date: new Date().toISOString()
    };
    saveToStorage(STORAGE_KEYS.BUDGETS, [...budgets, newBudget]);

    // Sync with cloud
    syncRecord('budgets', newBudget);

    return newBudget;
  },
  updateBudget: (uuid, updates) => {
    const budgets = storage.getBudgets();
    const index = budgets.findIndex(b => b.uuid === uuid);
    if (index !== -1) {
      budgets[index] = { ...budgets[index], ...updates };
      saveToStorage(STORAGE_KEYS.BUDGETS, budgets);

      // Sync with cloud
      syncRecord('budgets', budgets[index]);
    }
  },
  deleteBudget: (uuid) => {
    const budgets = storage.getBudgets();
    const filtered = budgets.filter(b => b.uuid !== uuid);
    saveToStorage(STORAGE_KEYS.BUDGETS, filtered);

    // Sync with cloud
    syncRecord('budgets', { uuid }, true);
  },

  // Backup & Restore
  exportData: () => {
    return JSON.stringify({
      orders: storage.getOrders(),
      clients: storage.getClients(),
      transactions: storage.getTransactions(),
      settings: storage.getSettings(),
      budgets: storage.getBudgets(),
      version: '1.0',
      exportedAt: new Date().toISOString()
    });
  },
  importData: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.orders) saveToStorage(STORAGE_KEYS.ORDERS, data.orders);
      if (data.clients) saveToStorage(STORAGE_KEYS.CLIENTS, data.clients);
      if (data.transactions) saveToStorage(STORAGE_KEYS.TRANSACTIONS, data.transactions);
      if (data.settings) saveToStorage(STORAGE_KEYS.SETTINGS, data.settings);
      if (data.budgets) saveToStorage(STORAGE_KEYS.BUDGETS, data.budgets);

      // Sync imported records to cloud
      const userId = getUserId();
      if (userId && supabase) {
        if (data.clients) data.clients.forEach(c => syncRecord('clients', c));
        if (data.orders) data.orders.forEach(o => syncRecord('orders', o));
        if (data.transactions) data.transactions.forEach(t => syncRecord('transactions', t));
        if (data.settings) syncRecord('settings', data.settings);
        if (data.budgets) data.budgets.forEach(b => syncRecord('budgets', b));
      }

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // Sincronização geral com o banco de dados Supabase
  syncWithCloud: async () => {
    if (!supabase) return { success: false, error: 'Supabase não configurado' };
    
    // Get session user
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return { success: false, error: 'Usuário não autenticado' };

    const userId = user.id;

    try {
      // 1. Fetch cloud data
      const [
        { data: cloudOrders },
        { data: cloudClients },
        { data: cloudTransactions },
        { data: cloudBudgets },
        settingsResponse
      ] = await Promise.all([
        supabase.from('orders').select('*').eq('user_id', userId),
        supabase.from('clients').select('*').eq('user_id', userId),
        supabase.from('transactions').select('*').eq('user_id', userId),
        supabase.from('budgets').select('*').eq('user_id', userId),
        supabase.from('settings').select('*').eq('user_id', userId)
      ]);

      const cloudSettings = settingsResponse.data?.[0];

      const localOrders = storage.getOrders();
      const localClients = storage.getClients();
      const localTransactions = storage.getTransactions();
      const localBudgets = storage.getBudgets();
      const localSettings = storage.getSettings();

      // Check if this is the first login (cloud is empty, local has data)
      const isCloudEmpty = (!cloudOrders || cloudOrders.length === 0) &&
                           (!cloudClients || cloudClients.length === 0) &&
                           (!cloudTransactions || cloudTransactions.length === 0) &&
                           (!cloudBudgets || cloudBudgets.length === 0);

      const hasLocalData = localOrders.length > 0 || localClients.length > 0;

      if (isCloudEmpty && hasLocalData) {
        // MIGRATION: Upload local data to Supabase
        console.log('Migrando dados locais para a nuvem...');
        
        const uploadPromises = [];
        
        if (localClients.length > 0) {
          uploadPromises.push(supabase.from('clients').insert(
            localClients.map(c => ({ user_id: userId, ...c }))
          ));
        }
        if (localOrders.length > 0) {
          uploadPromises.push(supabase.from('orders').insert(
            localOrders.map(o => ({ user_id: userId, ...o }))
          ));
        }
        if (localTransactions.length > 0) {
          uploadPromises.push(supabase.from('transactions').insert(
            localTransactions.map(t => ({ user_id: userId, ...t }))
          ));
        }
        if (localBudgets.length > 0) {
          uploadPromises.push(supabase.from('budgets').insert(
            localBudgets.map(b => ({ user_id: userId, ...b }))
          ));
        }
        
        uploadPromises.push(supabase.from('settings').upsert({
          user_id: userId,
          ...localSettings
        }));

        await Promise.all(uploadPromises);
        return { success: true, migrated: true };
      } else {
        // CLOUD SYNC: Overwrite local storage with cloud data
        console.log('Sincronizando dados da nuvem para o local...');
        
        if (cloudOrders) saveToStorage(STORAGE_KEYS.ORDERS, cloudOrders);
        if (cloudClients) saveToStorage(STORAGE_KEYS.CLIENTS, cloudClients);
        if (cloudTransactions) saveToStorage(STORAGE_KEYS.TRANSACTIONS, cloudTransactions);
        if (cloudBudgets) saveToStorage(STORAGE_KEYS.BUDGETS, cloudBudgets);
        if (cloudSettings) saveToStorage(STORAGE_KEYS.SETTINGS, {
          businessName: cloudSettings.businessName || 'Gleicy Rocha',
          pixKey: cloudSettings.pixKey || '',
          pixType: cloudSettings.pixType || 'Celular',
          businessDescription: cloudSettings.businessDescription || '',
          systemName: cloudSettings.systemName || 'Gestão Gleicy Rocha',
          theme: cloudSettings.theme || 'dark'
        });

        return { success: true, synced: true };
      }
    } catch (err) {
      console.error('Erro na sincronização com Supabase:', err);
      return { success: false, error: err.message };
    }
  },

  // Initial Data Seed
  seed: () => {
    if (storage.getOrders().length === 0) {
      if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        storage.updateSettings({}); 
      }
      
      const client1 = storage.addClient({ name: 'João Silva', email: 'joao@email.com', phone: '11988887777' });
      const client2 = storage.addClient({ name: 'Maria Souza', email: 'maria@email.com', phone: '11977776666' });
      
      storage.addOrder({ 
        clientUuid: client1.uuid, 
        clientName: client1.name,
        device: 'iPhone 13', 
        service: 'Troca de Tela', 
        category: 'Celular',
        status: 'Em Andamento', 
        price: 850,
        date: new Date().toISOString()
      });
      
      storage.addOrder({ 
        clientUuid: client2.uuid, 
        clientName: client2.name,
        device: 'Notebook Dell', 
        service: 'Formatação', 
        category: 'Computador',
        status: 'Concluído', 
        price: 150,
        date: new Date().toISOString(),
        id: 1041
      });
    } else {
      // Migration: Sync any pre-existing completed orders or parts costs that lack finance transactions
      const orders = storage.getOrders();
      const transactions = storage.getTransactions();
      let updated = false;

      orders.forEach(order => {
        // 1. Sync Income
        if (order.status === 'Concluído') {
          const hasIncome = transactions.some(t => 
            t.orderUuid === order.uuid && !t.isPartExpense
          );

          if (!hasIncome) {
            const newTrans = {
              uuid: uuidv4(),
              desc: `OS #${order.id} - ${order.device}`,
              type: 'in',
              category: 'Serviço',
              value: order.price || 0,
              date: order.date || new Date().toISOString(),
              orderUuid: order.uuid,
              isPartExpense: false
            };
            transactions.push(newTrans);
            updated = true;
          }
        }

        // 2. Sync Part Expense
        if (order.partPurchaseValue > 0) {
          const hasExpense = transactions.some(t => 
            t.orderUuid === order.uuid && t.isPartExpense
          );

          if (!hasExpense) {
            const newTrans = {
              uuid: uuidv4(),
              desc: `Peça OS #${order.id} - ${order.device}`,
              type: 'out',
              category: 'Hardware',
              value: order.partPurchaseValue,
              date: order.partPurchaseDate || order.date || new Date().toISOString(),
              orderUuid: order.uuid,
              isPartExpense: true
            };
            transactions.push(newTrans);
            updated = true;
          }
        }
      });

      if (updated) {
        saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
      }
    }
  }
};
