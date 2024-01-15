const express = require('express');
const userController = require('../controllers/user');
const authenticateUser = require('../middlewares/auth');

const router = express.Router();

router.get('/me', authenticateUser, userController.getUserInfo);
router.post('/add-to-cart', authenticateUser, userController.addToCart);
router.delete('/remove-from-cart/:id', authenticateUser, userController.removeFromCart);

module.exports = router;
