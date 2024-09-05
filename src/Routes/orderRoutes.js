const express = require('express');
const router = express.Router();
const { createOrder,getOrders,updateOrderToDelivered } = require('../controller/createOrders');
const { protect } = require('../middleware/authMiddleware');
// Route to handle order creation
router.get('/', getOrders);
router.post('/create',protect, createOrder);
router.put('/:id/deliver', updateOrderToDelivered);

module.exports = router;
