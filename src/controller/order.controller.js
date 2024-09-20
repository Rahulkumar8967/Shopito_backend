const orderService = require("../services/order.service.js");

const createOrder = async (req, res) => {
  const user = req.user; 

  try {
    const createdOrder = await orderService.createOrder(user, req.body);

    console.log("Order created: ", createdOrder);
    return res.status(201).send(createdOrder);  
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).send({ error: error.message });
  }
};



const findOrderById = async (req, res) => {
  const user = await req.user;
  try {
    let order = await orderService.findOrderById(req.params.id);
    return res.status(200).send(order);  
  } catch (error) {
    return res.status(500).send(error.message);  
  }
};

const orderHistory = async (req, res) => {
  const user = await req.user;
  try {
    let order = await orderService.usersOrderHistory(user._id);
    return res.status(200).send(order);  
  } catch (error) {
    return res.status(500).send(error.message);  
  }
};

module.exports = { createOrder, findOrderById, orderHistory };
