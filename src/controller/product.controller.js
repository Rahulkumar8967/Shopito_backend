// productController.js
const mongoose = require("mongoose");
const productService = require("../services/product.service.js");

// Create a new product
async function createProduct(req, res) {
  try {
    const product = await productService.createProduct(req.body);
    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Delete a product by ID
async function deleteProduct(req, res) {
  try {
    const productId = req.params.id;
    const message = await productService.deleteProduct(productId);
    return res.json({ message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update a product by ID
async function updateProduct(req, res) {
  try {
    const productId = req.params.id;
    const product = await productService.updateProduct(productId, req.body);
    return res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



// Find a product by ID
async function findProductById(req, res) {
  try {
   
    const productId = req.params.id.trim();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await productService.findProductById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ message: `Product not found with id ${productId}` });
    }
// may be error send = json
    return res.status(200).send (product);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

// Find products by category
async function findProductByCategory(req, res) {
  try {
    const category = req.params.category;
    const products = await productService.findProductByCategory(category);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Search products by query
async function searchProduct(req, res) {
  try {
    const query = req.params.query;
    const products = await productService.searchProduct(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all products with filtering and pagination
async function getAllProducts(req, res) {
  try {
    const products = await productService.getAllProducts(req.query);

    return res.status(200).send(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

const createMultipleProduct = async (req, res) => {
  try {
    await productService.createMultipleProduct(req.body);
    res
      .status(202)
      .json({ message: "Products Created Successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  findProductByCategory,
  searchProduct,
  createMultipleProduct,
};
