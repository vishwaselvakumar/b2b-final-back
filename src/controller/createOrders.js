const Order = require('../Models/order');

const createOrder = async (req, res) => {
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
  } = req.body;
// console.log("orderitems",orderItems)
  try {
    if (!req.user || !req.user._id) {
      throw new Error('User not authenticated');
    }

    // Create a new order
    const order = new Order({
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      orderItems,
      // Add other necessary fields here
    });

    // Save order to the database
    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find(); 
    res.status(200).json(orders); 
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      res.json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createOrder,getOrders,updateOrderToDelivered };
