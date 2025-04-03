const express = require('express');
const router = express.Router();
const userController = require('../domains/user/controllers/userController');
const authenticateUser = require('../middlewares/authMiddleware');

router.get('/', authenticateUser, userController.getAllUsers);
router.get('/me', authenticateUser, userController.getCurrentUser);
router.put('/:id', authenticateUser, userController.updateUser);
router.post('/upload', authenticateUser, userController.uploadUsersFromExcel);
router.get('/filter', authenticateUser, userController.filterUsers);

module.exports = router;