const orderService = require("../services/order.service.js");

const createOrder = async (req, res) => {
  const user = req.user; 

  
  console.log("Request body:", req.body);

 
  const { address } = req.body;

  if (!address || !address.firstName || !address.lastName || 
      !address.streetAddress || !address.city || 
      !address.state || !address.zipCode) {
    return res.status(400).send({ error: "All address fields are required." });
  }

  try {
    const createdOrder = await orderService.createOrder(user, req.body);
    console.log("Order created: ", createdOrder);
    return res.status(201).send(createdOrder);  
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).send({ error: "Failed to create order. Please try again later." });
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
