const express = require("express");
const router = express.Router();

const cartService = require("../services/cart.service.js");

const findUserCart = async (req, res) => {
  try {
    const user = req.user;
    const cart = await cartService.findUserCart(user._id.toString());
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user cart.", error: error.message });
  }
}

const addItemToCart = async (req, res) => {
  try {
    const user = req.user;
    await cartService.addCartItem(user._id.toString(), req.body);
   
    res.status(202).json({ message: "Item Added To Cart", status: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to add item to cart.", error: error.message });
  }
}

module.exports = { findUserCart, addItemToCart };
