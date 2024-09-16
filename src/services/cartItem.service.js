const CartItem = require("../models/cartItem.model.js");
const userService = require("../services/user.service.js");

// Custom Exceptions
class CartItemException extends Error {
  constructor(message) {
    super(message);
    this.name = "CartItemException";
  }
}

class UserException extends Error {
  constructor(message) {
    super(message);
    this.name = "UserException";
  }
}

// Create a new cart item
async function createCartItem(cartItemData) {
  if (!cartItemData.product || !cartItemData.product.price) {
    throw new CartItemException("Product price is missing");
  }
  if (!cartItemData.product.discountedPrice) {
    throw new CartItemException("Product discounted price is missing");
  }

  const cartItem = new CartItem(cartItemData);

  // Ensure quantity is set
  cartItem.quantity = cartItemData.quantity || 1;

  // Ensure price is valid
  cartItem.price = cartItem.product.price * cartItem.quantity;
  cartItem.discountedPrice = cartItem.product.discountedPrice * cartItem.quantity;

  const createdCartItem = await cartItem.save();
  return createdCartItem;
}

// Update an existing cart item
async function updateCartItem(userId, cartItemId, cartItemData) {
  cartItemId = cartItemId.trim(); // Trim any extra characters

  const item = await findCartItemById(cartItemId);
  if (!item) {
    throw new CartItemException(`Cart item not found: ${cartItemId}`);
  }

  const user = await userService.findUserById(userId);
  if (!user) {
    throw new UserException(`User not found: ${userId}`);
  }

  if (user.id === userId.toString()) {
    // Ensure quantity is valid
    item.quantity = cartItemData.quantity || item.quantity;
    if (!item.quantity) {
      throw new CartItemException("Quantity is required");
    }

    // Ensure price calculations are valid
    if (!item.product || !item.product.price || !item.product.discountedPrice) {
      throw new CartItemException("Product price or discounted price is missing");
    }

    item.price = item.quantity * item.product.price;
    item.discountedPrice = item.quantity * item.product.discountedPrice;

    const updatedCartItem = await item.save();
    return updatedCartItem;
  } else {
    throw new UserException("You can't update another user's cart item");
  }
}



// Check if a cart item already exists in the user's cart
async function isCartItemExist(cart, product, size, userId) {
  const cartItem = await CartItem.findOne({ cart, product, size, userId });
  return cartItem;
}

// Remove a cart item
async function removeCartItem(userId, cartItemId) {
  cartItemId = cartItemId.trim();  // Trim any extra characters
  
  const cartItem = await findCartItemById(cartItemId);
  if (!cartItem) {
    throw new CartItemException(`CartItem not found with id: ${cartItemId}`);
  }

  const user = await userService.findUserById(cartItem.userId);
  const reqUser = await userService.findUserById(userId);

  if (user.id === reqUser.id) {
    await CartItem.findByIdAndDelete(cartItem.id);
  } else {
    throw new UserException("You can't remove another user's item");
  }
}

// Find a cart item by its ID
async function findCartItemById(cartItemId) {
  const cartItem = await CartItem.findById(cartItemId).populate("product");
  if (cartItem) {
    return cartItem;
  } else {
    throw new CartItemException(`CartItem not found with id: ${cartItemId}`);
  }
}

module.exports = {
  createCartItem,
  updateCartItem,
  isCartItemExist,
  removeCartItem,
  findCartItemById,
};
