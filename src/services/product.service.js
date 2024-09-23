const mongoose = require('mongoose');
const Category = require("../models/category.model.js");
const Product = require("../models/product.model.js");
const { ObjectId } = mongoose.Types;

// Create a new product
async function createProduct(reqData) {
  let topLevel = await Category.findOne({ name: reqData.topLevelCategory });

  if (!topLevel) {
    const topLevelCategory = new Category({
      name: reqData.topLevelCategory,
      level: 1,
    });

    topLevel = await topLevelCategory.save();
  }

  let secondLevel = await Category.findOne({
    name: reqData.secondLevelCategory,
    parentCategory: topLevel._id,
  });

  if (!secondLevel) {
    const secondLevelCategory = new Category({
      name: reqData.secondLevelCategory,
      parentCategory: topLevel._id,
      level: 2,
    });

    secondLevel = await secondLevelCategory.save();
  }

  let thirdLevel = await Category.findOne({
    name: reqData.thirdLevelCategory,
    parentCategory: secondLevel._id,
  });

  if (!thirdLevel) {
    const thirdLevelCategory = new Category({
      name: reqData.thirdLevelCategory,
      parentCategory: secondLevel._id,
      level: 3,
    });

    thirdLevel = await thirdLevelCategory.save();
  }

  const product = new Product({
    title: reqData.title,
    color: reqData.color,
    description: reqData.description,
    discountedPrice: reqData.discountedPrice,
    discountPercent: reqData.discountPercent,
    imageUrl: reqData.imageUrl,
    brand: reqData.brand,
    price: reqData.price,
    sizes: reqData.size,
    quantity: reqData.quantity,
    category: thirdLevel._id, // Store as ObjectId
  });

  const savedProduct = await product.save();
  return savedProduct;
}

// Delete a product by ID
async function deleteProduct(productId) {
  const product = await findProductById(productId);
  if (!product) {
    throw new Error("Product not found with id - : ", productId);
  }

  await Product.findByIdAndDelete(productId);
  return "Product deleted successfully";
}

// Update a product by ID
async function updateProduct(productId, reqData) {
  const updatedProduct = await Product.findByIdAndUpdate(productId, reqData, { new: true });
  return updatedProduct;
}

// Find a product by ID
async function findProductById(id) {
  const product = await Product.findById(id).populate("category").exec();
  if (!product) {
    throw new Error("Product not found with id " + id);
  }
  return product;
}

// Fetch all products with filters
async function getAllProducts(reqQuery) {
  let {
    category,
    color,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    sort,
    stock,
    pageNumber,
    pageSize,
  } = reqQuery;

  pageSize = parseInt(pageSize) || 10;
  pageNumber = parseInt(pageNumber, 10) || 1;

  if (pageSize <= 0 || pageNumber <= 0) {
    return { content: [], currentPage: pageNumber, totalPages: 1 };
  }

  // Initialize the aggregation pipeline
  let pipeline = [];

  // Populate the category field with proper ObjectId matching
  pipeline.push({
    $lookup: {
      from: 'categories',
      localField: 'category',
      foreignField: '_id',
      as: 'category',
    },
  });

  pipeline.push({ $unwind: { path: '$category', preserveNullAndEmptyArrays: true } });

  // Filter by category
  if (category) {
    const existCategory = await Category.findOne({ name: category });
    if (existCategory) {
      pipeline.push({ $match: { 'category._id': ObjectId(existCategory._id) } });
    } else {
      return { content: [], currentPage: pageNumber, totalPages: 1 };
    }
  }

  // Filter by color using regex
  if (color) {
    const colorSet = color.split(',').map((c) => c.trim().toLowerCase());
    pipeline.push({
      $match: {
        color: { $regex: new RegExp(colorSet.join('|'), 'i') },
      },
    });
  }

  // Filter by sizes
  if (sizes) {
    const sizesSet = sizes.split(',').map((s) => s.trim());
    pipeline.push({
      $match: { 'sizes.name': { $in: sizesSet } },
    });
  }

  console.log("products",products)
  // Filter by price range
  if (minPrice && maxPrice) {
    pipeline.push({
      $match: {
        discountedPrice: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) },
      },
    });
  }

  // Filter by minimum discount
  if (minDiscount) {
    pipeline.push({
      $match: {
        $or: [
          { discountPercent: { $gt: parseFloat(minDiscount) } },
          { discountPercent: { $exists: false } },
        ],
      },
    });
  }

  // Filter by stock status
  if (stock) {
    if (stock === 'in_stock') {
      pipeline.push({ $match: { quantity: { $gt: 0 } } });
    } else if (stock === 'out_of_stock') {
      pipeline.push({ $match: { quantity: { $lte: 0 } } });
    }
  }

  // Sorting by price
  if (sort) {
    const sortDirection = sort === 'price_high' ? -1 : 1;
    pipeline.push({ $sort: { discountedPrice: sortDirection } });
  }

  // Pagination
  const skip = (pageNumber - 1) * pageSize;
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: pageSize });

  // Get the total number of products matching the criteria
  const totalProductsPipeline = [...pipeline];
  totalProductsPipeline.push({ $count: 'total' });

  const [totalProductsResult] = await Product.aggregate(totalProductsPipeline).exec();
  const totalProducts = totalProductsResult ? totalProductsResult.total : 0;
  const totalPages = Math.ceil(totalProducts / pageSize);

  // Execute the aggregation query
  const products = await Product.aggregate(pipeline).exec();
  return { content: products, currentPage: pageNumber, totalPages: totalPages };
}

// Create multiple products
async function createMultipleProduct(products) {
  for (let product of products) {
    await createProduct(product);
  }
}


module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  createMultipleProduct,
};
