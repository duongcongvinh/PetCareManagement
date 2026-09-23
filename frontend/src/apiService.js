// API Integration Service connecting React Frontend to Node.js Express + Prisma PostgreSQL Backend

const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { 'Authorization': `Bearer ${token}` } : {})
});

export const apiService = {
  // Auth APIs
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  getProfile: async (token) => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(token)
    });
    return res.json();
  },

  // Pet APIs
  getPets: async (token) => {
    const res = await fetch(`${API_BASE_URL}/pets`, { headers: getHeaders(token) });
    return res.json();
  },

  createPet: async (petData, token) => {
    const res = await fetch(`${API_BASE_URL}/pets`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(petData)
    });
    return res.json();
  },

  // Service & Appointment APIs
  getServices: async () => {
    const res = await fetch(`${API_BASE_URL}/services`);
    return res.json();
  },

  getAppointments: async (token) => {
    const res = await fetch(`${API_BASE_URL}/appointments`, { headers: getHeaders(token) });
    return res.json();
  },

  createAppointment: async (appointmentData, token) => {
    const res = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(appointmentData)
    });
    return res.json();
  },

  updateAppointmentStatus: async (id, status, careSummary, token) => {
    const res = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ status, careSummary })
    });
    return res.json();
  },

  // Product & Inventory APIs
  getProducts: async (token) => {
    const res = await fetch(`${API_BASE_URL}/products`, { headers: getHeaders(token) });
    return res.json();
  },

  updateStock: async (id, type, quantity, note, token) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}/stock`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ type, quantity, note })
    });
    return res.json();
  },

  // Order APIs (Auto PostgreSQL Stock Deduction)
  createOrder: async (items, token) => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ items })
    });
    return res.json();
  },

  // AI Forecasting & Reorder Proposal APIs
  getProposals: async (token) => {
    const res = await fetch(`${API_BASE_URL}/forecasting/proposals`, { headers: getHeaders(token) });
    return res.json();
  },

  triggerAIForecast: async (token) => {
    const res = await fetch(`${API_BASE_URL}/forecasting/trigger`, {
      method: 'POST',
      headers: getHeaders(token)
    });
    return res.json();
  },

  updateProposalStatus: async (id, status, token) => {
    const res = await fetch(`${API_BASE_URL}/forecasting/proposals/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  triggerSeasonalForecast: async (historicalMonths) => {
    const res = await fetch('http://localhost:8000/api/forecast/multi-year-seasonal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ historical_months: historicalMonths, target_months_ahead: 6 })
    });
    return res.json();
  },

  triggerOrderHistoryForecast: async (orderHistory) => {
    const res = await fetch('http://localhost:8000/api/forecast/order-history-predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_history: orderHistory, target_months_ahead: 3 })
    });
    return res.json();
  },

  // Cross-Browser Live Sync Engine APIs
  getLiveSyncState: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/sync/live-state`);
      return res.json();
    } catch (e) {
      return null;
    }
  },

  postLiveSyncState: async (payload) => {
    try {
      const res = await fetch(`${API_BASE_URL}/sync/live-state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return res.json();
    } catch (e) {
      return null;
    }
  }
};
