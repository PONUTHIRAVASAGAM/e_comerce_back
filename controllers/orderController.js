const orderRepository = require('../repositories/orderRepository');


  const createOrder = async (req, res) => {
    console.log("=====Create Order Function Calling=====");
    console.log("=====req.body=====", req.body);
    
    try {
        const {
            customerId,
            paymentType,
            paymentMethod,
            productCount,
            deliveryAddress,
            productDetails 
        } = req.body;

        const {
            productId,
            productName,
            productDescription,
            productImage,
            originalPrice,
            discountPrice,
            sellingPrice,
            quantity,
            ownerId,
            deliveryStatus = false, 
            // paymentStatus = "Pending"
        } = productDetails || {}; 

        const paymentStatus = (paymentType === "Online") ? "Paid" : "Pending";
        const order = await orderRepository.createOrder({
            customerId,
            ownerId,
            productId,
            productName,
            productDescription,
            productImage,
            originalPrice,
            discountPrice,
            sellingPrice,
            quantity,
            deliveryStatus,
            paymentType,
            paymentMethod,
            paymentStatus,
            productCount,
            deliveryAddress,
            created_date: new Date(),
            updated_date: new Date(),
        });

        res.status(201).json(order);
    } catch (err) {
        console.error("Error creating order:", err.message);
        res.status(500).json({ message: err.message });
    }
};

const getOrdersByOwnerId = async (req, res) => {
  try {
    const userId  = req.params.id;
    console.log("=====req.params=====",req.params.id);    
    const orders = await orderRepository.getOrdersByOwnerId(userId);
    console.log("=====orders=====",orders);    
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getOrdersByCustomerId = async (req, res) => {
  try {
    const userId  = req.params.id;
    console.log("=====req.params=====",req.params.id);    
    const orders = await orderRepository.getOrdersByCustomerId(userId);
    console.log("=====orders=====",orders);    
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId, deliveryStatus } = req.body;
    console.log("=====req.body=====", req.body);

    if (!orderId || typeof deliveryStatus !== 'boolean') {
      return res.status(400).json({ message: "Product ID and delivery status are required." });
    }

    const updatedOrder = await orderRepository.updateDeliveryStatus(orderId, deliveryStatus);

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    console.log("=====Updated Order=====", updatedOrder);
    res.status(200).json(updatedOrder); 
  } catch (err) {
    console.error("Error updating delivery status:", err.message);
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
    createOrder,
    getOrdersByOwnerId,
    getOrdersByCustomerId,
    updateDeliveryStatus,
}