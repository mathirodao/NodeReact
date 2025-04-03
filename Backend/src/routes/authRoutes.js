const express = require('express');
const router = express.Router();
const authController = require('../domains/auth/controllers/authController');
const authenticateUser = require('../middlewares/authMiddleware');

router.post('/register', authController.registerUser);
router.post('/login', (req, res, next) => {
    next();
  }, authController.loginUser);
router.post('/logout', (req, res, next) => {
    next();
  }, authenticateUser, authController.logoutUser);
  router.get('/verify-session', authenticateUser, authController.verifySession);

module.exports = router;