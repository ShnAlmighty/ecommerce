const express = require('express');
const adminController = require('../controllers/admin');
const authenticateAdmin = require('../middlewares/admin');

const router = express.Router();

router.post('/generate-discount-code', authenticateAdmin, adminController.generateDiscount);
router.get('/order_details', authenticateAdmin, adminController.orderDetails);

module.exports = router;
