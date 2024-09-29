const express=require("express");
const router=express.Router();
const productController=require("../controller/product.controller.js");


router.post('/', productController.createProduct);
router.post('/creates', productController.createMultipleProduct);
router.delete('/:id/delete', productController.deleteProduct); // Ensure this line is present

router.put('/:id', productController.updateProduct);

module.exports=router;