const express = require('express');
const itemController = require('../controllers/item');
const authenticateUser = require('../middlewares/auth');

const router = express.Router();

router.get('/', authenticateUser, itemController.getAllItems);
router.get('/:id', authenticateUser, itemController.getItemInfo);
router.post('/add', authenticateUser, itemController.addItem);
router.patch('/:id', authenticateUser, itemController.updateItem);
router.delete('/:id', authenticateUser, itemController.removeItem);

module.exports = router;
