const express = require('express');
const authController = require('../controllers/auth');
const authenticateUser = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authenticateUser, authController.logout);

router.post('/logoutall', authenticateUser, authController.logoutall);

module.exports = router;
