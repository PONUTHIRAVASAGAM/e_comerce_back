const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/createOrder', orderController.createOrder);
router.get('/viewOwnerOrders/:id', orderController.getOrdersByOwnerId);
router.get('/viewCustomerOrders/:id', orderController.getOrdersByCustomerId);
router.post('/updateDeliveryStatus', orderController.updateDeliveryStatus);



module.exports = router;
