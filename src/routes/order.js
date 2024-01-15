const express = require('express');
const orderController = require('../controllers/order');
const authenticateUser = require('../middlewares/auth');

const router = express.Router();

router.get('/', authenticateUser, orderController.getOrders);
router.get('/:id', authenticateUser, orderController.getOrderInfo);
router.post('/checkout', authenticateUser, orderController.checkout);

module.exports = router;
