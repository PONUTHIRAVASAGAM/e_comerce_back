const Order = require('../models/orderModel');

const createOrder = async (orderData) => {
    const order = new Order(orderData);
    return await order.save();
  };

const getOrdersByOwnerId = async (userId) => {
    console.log("=====userId=====",userId);  
    return await Order.findAll({ where: { ownerId: userId } });
  };

  const getOrdersByCustomerId = async (userId) => {
    console.log("=====userId=====",userId);  
    return await Order.findAll({ where: { customerId: userId } });
  };
  
  const updateDeliveryStatus = async (orderId, deliveryStatus) => {
    console.log("=====Updating delivery status=====", { orderId, deliveryStatus });
    
    const [updatedCount, updatedRows] = await Order.update(
      { deliveryStatus },
      { 
        where: { orderId: orderId },
        returning: true
      }
    );
    
    if (updatedCount === 0) {
      return null;
    }
    
    return updatedRows[0];
  };

  module.exports = {
    createOrder,
    getOrdersByOwnerId,
    getOrdersByCustomerId,
    updateDeliveryStatus,

  };