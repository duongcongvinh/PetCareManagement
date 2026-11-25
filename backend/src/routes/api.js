const express = require('express');
const router = express.Router();

const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const authController = require('../controllers/authController');
const petController = require('../controllers/petController');
const appointmentController = require('../controllers/appointmentController');
const inventoryController = require('../controllers/inventoryController');
const orderController = require('../controllers/orderController');
const forecastingController = require('../controllers/forecastingController');
const paymentController = require('../controllers/paymentController');
const reviewController = require('../controllers/reviewController');

// --- 1. Auth & User Management Routes ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);
router.get('/auth/me', authenticateToken, authController.getProfile);
router.put('/auth/profile', authenticateToken, authController.updateProfile);
router.get('/users', authController.getUsers);
router.post('/users', authController.createUser);
router.put('/users/:id', authenticateToken, authorizeRoles('ADMIN'), authController.updateUser);
router.delete('/users/:id', authenticateToken, authorizeRoles('ADMIN'), authController.deleteUser);

// --- 2. Pet Routes ---
router.get('/pets', authenticateToken, petController.getPets);
router.post('/pets', authenticateToken, petController.createPet);
router.put('/pets/:id', authenticateToken, petController.updatePet);
router.delete('/pets/:id', authenticateToken, petController.deletePet);

// --- 3. Service & Appointment Routes ---
router.get('/services', appointmentController.getServices);
router.post('/services', authenticateToken, authorizeRoles('ADMIN', 'CARE_STAFF'), appointmentController.createService);
router.put('/services/:id', authenticateToken, authorizeRoles('ADMIN', 'CARE_STAFF'), appointmentController.updateService);
router.delete('/services/:id', authenticateToken, authorizeRoles('ADMIN', 'CARE_STAFF'), appointmentController.deleteService);
router.get('/appointments', authenticateToken, appointmentController.getAppointments);
router.post('/appointments', authenticateToken, appointmentController.createAppointment);
router.put('/appointments/:id', authenticateToken, appointmentController.rescheduleAppointment);
router.put('/appointments/:id/status', authenticateToken, authorizeRoles('CARE_STAFF', 'ADMIN'), appointmentController.updateStatus);
router.put('/appointments/:id/cancel', authenticateToken, appointmentController.cancelAppointment);

// --- 4. Inventory & Supplier Routes ---
router.get('/products', authenticateToken, inventoryController.getProducts);
router.post('/products', authenticateToken, authorizeRoles('WAREHOUSE_STAFF', 'ADMIN'), inventoryController.createProduct);
router.put('/products/:id', authenticateToken, authorizeRoles('WAREHOUSE_STAFF', 'ADMIN'), inventoryController.updateProduct);
router.put('/products/:id/stock', authenticateToken, authorizeRoles('WAREHOUSE_STAFF', 'ADMIN'), inventoryController.updateStock);
router.delete('/products/:id', authenticateToken, authorizeRoles('WAREHOUSE_STAFF', 'ADMIN'), inventoryController.deleteProduct);
router.get('/products/low-stock', authenticateToken, authorizeRoles('WAREHOUSE_STAFF', 'ADMIN'), inventoryController.getLowStockAlerts);
router.get('/suppliers', authenticateToken, authorizeRoles('WAREHOUSE_STAFF', 'ADMIN'), inventoryController.getSuppliers);
router.post('/suppliers', authenticateToken, authorizeRoles('WAREHOUSE_STAFF', 'ADMIN'), inventoryController.createSupplier);

// --- 5. E-Commerce Order & payOS Payment Routes ---
router.post('/orders', authenticateToken, orderController.createOrder);
router.get('/orders', authenticateToken, orderController.getOrders);
router.post('/payment/payos/create', paymentController.createPayOSPayment);
router.get('/payment/payos/status/:orderCode', paymentController.getPayOSPaymentStatus);
router.post('/payment/payos/cancel/:orderCode', paymentController.cancelPayOSPayment);
router.post('/payment/payos-webhook', paymentController.handlePayOSWebhook);

// --- 6. AI Smart Forecasting & Reorder Proposal Routes ---
router.get('/forecasting/proposals', authenticateToken, authorizeRoles('WAREHOUSE_STAFF', 'ADMIN'), forecastingController.getProposals);
router.post('/forecasting/trigger', authenticateToken, authorizeRoles('WAREHOUSE_STAFF', 'ADMIN'), forecastingController.triggerAIForecast);
router.post('/forecasting/seasonal', authenticateToken, authorizeRoles('WAREHOUSE_STAFF', 'ADMIN'), forecastingController.seasonalForecast);
router.post('/forecasting/order-history', authenticateToken, authorizeRoles('WAREHOUSE_STAFF', 'ADMIN'), forecastingController.orderHistoryForecast);
router.post('/forecasting/inventory-risk', authenticateToken, authorizeRoles('WAREHOUSE_STAFF', 'ADMIN'), forecastingController.inventoryRiskForecast);
router.put('/forecasting/proposals/:id', authenticateToken, authorizeRoles('ADMIN'), forecastingController.updateProposalStatus);

// --- 6.5. Customer Reviews & Ratings Routes ---
router.get('/reviews', reviewController.listReviews);
router.post('/reviews', authenticateToken, reviewController.createReview);
router.put('/reviews/:id/reply', authenticateToken, authorizeRoles('CARE_STAFF', 'ADMIN'), reviewController.replyReview);
router.delete('/reviews/:id', authenticateToken, reviewController.deleteReview);

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
  const { appointments, orders, products, deletedProductIds, pets, services, promotions, users, reviews } = req.body;
  if (!liveSyncStore) liveSyncStore = {};
  if (appointments !== undefined) liveSyncStore.appointments = appointments;
  if (orders !== undefined) liveSyncStore.orders = orders;
  if (products !== undefined) liveSyncStore.products = products;
  if (deletedProductIds !== undefined) liveSyncStore.deletedProductIds = deletedProductIds;
  if (pets !== undefined) liveSyncStore.pets = pets;
  if (services !== undefined) liveSyncStore.services = services;
  if (promotions !== undefined) liveSyncStore.promotions = promotions;
  if (users !== undefined) liveSyncStore.users = users;
  if (reviews !== undefined) liveSyncStore.reviews = reviews;
  liveSyncStore.lastUpdated = Date.now();
  res.json({ status: 'ok', data: liveSyncStore });
});

module.exports = router;
