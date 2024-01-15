const express = require('express');
const userController = require('../controllers/user');
const authenticateUser = require('../middlewares/auth');

const router = express.Router();

router.get('/me', authenticateUser, userController.getUserInfo);

module.exports = router;
