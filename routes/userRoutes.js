const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/registerAdmin', userController.registerAdmin);
router.post('/register', userController.registerUser);
router.post('/verifyOtp', userController.verifyOtp);
router.post('/authenticate', userController.authenticateUser);

module.exports = router;
