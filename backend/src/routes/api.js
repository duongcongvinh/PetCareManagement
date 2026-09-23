const express = require('express');
const router = express.Router();

const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const authController = require('../controllers/authController');
const petController = require('../controllers/petController');
const appointmentController = require('../controllers/appointmentController');
const inventoryController = require('../controllers/inventoryController');
const orderController = require('../controllers/orderController');
const forecastingController = require('../controllers/forecastingController');

// --- 1. Auth Routes ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticateToken, authController.getProfile);

// --- 2. Pet Routes ---
router.get('/pets', authenticateToken, petController.getPets);
router.post('/pets', authenticateToken, petController.createPet);
router.put('/pets/:id', authenticateToken, petController.updatePet);
router.delete('/pets/:id', authenticateToken, petController.deletePet);

// --- 3. Service & Appointment Routes ---
router.get('/services', appointmentController.getServices);
router.get('/appointments', authenticateToken, appointmentController.getAppointments);
router.post('/appointments', authenticateToken, appointmentController.createAppointment);
router.put('/appointments/:id/status', authenticateToken, authorizeRoles('CARE_STAFF', 'ADMIN'), appointmentController.updateStatus);

// --- 4. Inventory & Supplier Routes ---
router.get('/products', authenticateToken, inventoryController.getProducts);
router.post('/products', authenticateToken, authorizeRoles('WAREHOUSE_STAFF', 'ADMIN'), inventoryController.createProduct);
router.put('/products/:id/stock', authenticateToken, authorizeRoles('WAREHOUSE_STAFF', 'ADMIN'), inventoryController.updateStock);
router.get('/products/low-stock', authenticateToken, authorizeRoles('WAREHOUSE_STAFF', 'ADMIN'), inventoryController.getLowStockAlerts);
router.get('/suppliers', authenticateToken, authorizeRoles('WAREHOUSE_STAFF', 'ADMIN'), inventoryController.getSuppliers);

// --- 5. E-Commerce Order Routes ---
router.post('/orders', authenticateToken, orderController.createOrder);
router.get('/orders', authenticateToken, orderController.getOrders);

// --- 6. AI Smart Forecasting & Reorder Proposal Routes ---
router.get('/forecasting/proposals', authenticateToken, authorizeRoles('WAREHOUSE_STAFF', 'ADMIN'), forecastingController.getProposals);
router.post('/forecasting/trigger', authenticateToken, authorizeRoles('WAREHOUSE_STAFF', 'ADMIN'), forecastingController.triggerAIForecast);
router.put('/forecasting/proposals/:id', authenticateToken, authorizeRoles('ADMIN'), forecastingController.updateProposalStatus);

// --- 7. Cross-Browser Live Synchronization Engine (Chrome, Edge, Firefox, Mobile) ---
let liveSyncStore = null;

router.get('/sync/live-state', (req, res) => {
  res.json({
    status: 'ok',
    data: liveSyncStore,
    timestamp: Date.now()
  });
});

router.post('/sync/live-state', (req, res) => {
  const { appointments, orders, products, pets, services } = req.body;
  if (!liveSyncStore) liveSyncStore = {};
  if (appointments !== undefined) liveSyncStore.appointments = appointments;
  if (orders !== undefined) liveSyncStore.orders = orders;
  if (products !== undefined) liveSyncStore.products = products;
  if (pets !== undefined) liveSyncStore.pets = pets;
  if (services !== undefined) liveSyncStore.services = services;
  liveSyncStore.lastUpdated = Date.now();
  res.json({ status: 'ok', data: liveSyncStore });
});

module.exports = router;
