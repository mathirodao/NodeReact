const express = require('express');
const router = express.Router();
const { userController } = require('../domains/user');
const authenticateUser = require('../middlewares/authMiddleware');

router.use(authenticateUser);

router.get('/',(req, res, next) => {
    console.log('Llegó petición a user /');
    next();
}, userController.getAllUsers);
router.get('/me', userController.getCurrentUser);
router.put('/:id', userController.updateUser);
router.get('/filter', userController.filterUsers);
router.get('/stats', (req, res, next) => {
    console.log('Llegó petición a /stats');
    next();
}, userController.getUsersStats);
router.get('/stats/failed-logins', userController.getFailedLoginStats);

module.exports = router;