const express=require("express");
const router=express.Router();
const productController=require("../controller/product.controller.js");

router.get('/', productController.getAllProducts);
router.get('/id/:id', productController.findProductById);
router.get('/search', productController.searchProduct);
router.delete('/:id', productController.deleteProduct);  //


module.exports = router;