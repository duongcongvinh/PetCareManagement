// API Integration Service connecting React Frontend to Node.js Express + Prisma PostgreSQL Backend

const API_BASE_URL = '/api';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { 'Authorization': `Bearer ${token}` } : {})
});

// Parse JSON while preserving arrays and annotating objects with HTTP status metadata
const parseResponse = async (res) => {
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }
  if (Array.isArray(data)) return data;
  return { ...(data || {}), _ok: res.ok, _httpStatus: res.status };
};

export const apiService = {
  // Auth APIs (hỗ trợ cả Email và Số điện thoại, tách biệt cổng CUSTOMER / STAFF)
  login: async (identifier, password, portal) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ identifier, email: identifier, password, ...(portal ? { portal } : {}) })
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

  forgotPassword: async (identifier, portal = 'CUSTOMER') => {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ identifier, email: identifier, portal })
    });
    const data = await res.json();
    return { ...data, _ok: res.ok };
  },

  resetPassword: async ({ identifier, otp, newPassword, confirmPassword, portal = 'CUSTOMER' }) => {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ identifier, email: identifier, otp, newPassword, confirmPassword, portal })
    });
    const data = await res.json();
    return { ...data, _ok: res.ok };
  },

  getProfile: async (token) => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(token)
    });
    return res.json();
  },

  updateProfile: async (profileData, token) => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(profileData)
    });
    return res.json();
  },

  getUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/users`, { cache: 'no-store' });
    return res.json();
  },

  createUser: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  updateUser: async (id, userData, token) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    return { ...data, _httpStatus: res.status };
  },

  deleteUser: async (id, token) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    const data = await res.json();
    return { ...data, _httpStatus: res.status };
  },

  // Pet APIs
  getPets: async (token) => {
    const res = await fetch(`${API_BASE_URL}/pets`, { headers: getHeaders(token), cache: 'no-store' });
    return parseResponse(res);
  },

  createPet: async (petData, token) => {
    const res = await fetch(`${API_BASE_URL}/pets`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(petData)
    });
    return parseResponse(res);
  },

  updatePet: async (id, petData, token) => {
    const res = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(petData)
    });
    return res.json();
  },

  deletePet: async (id, token) => {
    const res = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return res.json();
  },

  // Service & Appointment APIs
  getServices: async () => {
    const res = await fetch(`${API_BASE_URL}/services`, { cache: 'no-store' });
    return res.json();
  },

  createService: async (serviceData, token) => {
    const res = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(serviceData)
    });
    return res.json();
  },

  updateService: async (id, serviceData, token) => {
    const res = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(serviceData)
    });
    return res.json();
  },

  deleteService: async (id, token) => {
    const res = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return res.json();
  },

  getAppointments: async (token) => {
    const res = await fetch(`${API_BASE_URL}/appointments`, { headers: getHeaders(token), cache: 'no-store' });
    return parseResponse(res);
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

  rescheduleAppointment: async (id, payload, token) => {
    const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  cancelAppointment: async (id, token) => {
    const res = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
      method: 'PUT',
      headers: getHeaders(token)
    });
    return res.json();
  },

  // Product & Inventory APIs
  getProducts: async (token) => {
    const res = await fetch(`${API_BASE_URL}/products`, { headers: getHeaders(token), cache: 'no-store' });
    return parseResponse(res);
  },

  createProduct: async (productData, token) => {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(productData)
    });
    return parseResponse(res);
  },

  updateProduct: async (id, productData, token) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(productData)
    });
    return parseResponse(res);
  },

  updateStock: async (id, type, quantity, note, token, thresholds = {}) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}/stock`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ type, quantity, note, ...thresholds })
    });
    return parseResponse(res);
  },

  deleteProduct: async (id, token) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return parseResponse(res);
  },

  getSuppliers: async (token) => {
    const res = await fetch(`${API_BASE_URL}/suppliers`, { headers: getHeaders(token), cache: 'no-store' });
    return parseResponse(res);
  },

  createSupplier: async (supplierData, token) => {
    const res = await fetch(`${API_BASE_URL}/suppliers`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(supplierData)
    });
    return parseResponse(res);
  },

  updateSupplier: async (id, supplierData, token) => {
    const res = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(supplierData)
    });
    return parseResponse(res);
  },

  deleteSupplier: async (id, token) => {
    const res = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return parseResponse(res);
  },

  // Order APIs (Auto MongoDB Stock Deduction)
  getOrders: async (token) => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: getHeaders(token),
      cache: 'no-store'
    });
    return parseResponse(res);
  },

  createOrder: async (items, token) => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ items })
    });
    return parseResponse(res);
  },

  updateOrderStatus: async (id, status, token) => {
    const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ status })
    });
    return parseResponse(res);
  },

  // payOS Real-time VietQR Payment Gateway APIs
  createPayOSPayment: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/payment/payos/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return { ...data, _ok: res.ok };
  },

  getPayOSStatus: async (orderCode) => {
    const res = await fetch(`${API_BASE_URL}/payment/payos/status/${orderCode}`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return { ...data, _ok: res.ok };
  },

  cancelPayOSPayment: async (orderCode, reason) => {
    const res = await fetch(`${API_BASE_URL}/payment/payos/cancel/${orderCode}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reason ? { reason } : {})
    });
    return res.json();
  },

  // AI Forecasting & Reorder Proposal APIs
  getProposals: async (token) => {
    const res = await fetch(`${API_BASE_URL}/forecasting/proposals`, { headers: getHeaders(token), cache: 'no-store' });
    return parseResponse(res);
  },

  createProposal: async (proposalData, token) => {
    const res = await fetch(`${API_BASE_URL}/forecasting/proposals`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(proposalData)
    });
    return parseResponse(res);
  },

  deleteProposal: async (id, token) => {
    const res = await fetch(`${API_BASE_URL}/forecasting/proposals/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return parseResponse(res);
  },

  triggerAIForecast: async (token) => {
    const res = await fetch(`${API_BASE_URL}/forecasting/trigger`, {
      method: 'POST',
      headers: getHeaders(token)
    });
    return parseResponse(res);
  },

  updateProposalStatus: async (id, status, token) => {
    const res = await fetch(`${API_BASE_URL}/forecasting/proposals/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ status })
    });
    return parseResponse(res);
  },

  triggerSeasonalForecast: async (historicalMonths, options = {}, token = null) => {
    const res = await fetch(`${API_BASE_URL}/forecasting/seasonal`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        historical_months: historicalMonths,
        target_months_ahead: options.targetMonthsAhead || 6,
        temp_delta_c: options.tempDeltaC || 0,
        rainfall_pct_change: options.rainfallPctChange || 0,
        promo_boost_pct: options.promoBoostPct || 0
      })
    });
    const data = await res.json();
    return { ...data, _ok: res.ok };
  },

  triggerOrderHistoryForecast: async (payload, token = null) => {
    const body = Array.isArray(payload)
      ? { order_history: payload, target_months_ahead: 3 }
      : { target_months_ahead: 3, ...payload };
    const res = await fetch(`${API_BASE_URL}/forecasting/order-history`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return { ...data, _ok: res.ok };
  },

  predictInventoryRisk: async (products, token = null, includeAll = true) => {
    const res = await fetch(`${API_BASE_URL}/forecasting/inventory-risk`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ products, include_all: includeAll })
    });
    const data = await res.json();
    return { data, _ok: res.ok };
  },

  // Customer Reviews & Ratings APIs
  getReviews: async (params = {}) => {
    const qs = new URLSearchParams();
    if (params.targetType) qs.set('targetType', params.targetType);
    if (params.targetId) qs.set('targetId', params.targetId);
    const query = qs.toString() ? `?${qs.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/reviews${query}`, { cache: 'no-store' });
    return res.json();
  },

  createReview: async (payload, token) => {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return { ...data, _ok: res.ok };
  },

  replyReview: async (id, staffReply, token) => {
    const res = await fetch(`${API_BASE_URL}/reviews/${id}/reply`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ staffReply })
    });
    const data = await res.json();
    return { ...data, _ok: res.ok };
  },

  deleteReview: async (id, token) => {
    const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    const data = await res.json();
    return { ...data, _ok: res.ok };
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
