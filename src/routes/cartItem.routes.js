const express=require("express");
const authenticate = require("../middleware/authenticate.js");
const router=express.Router();

const cartItemController=require("../controller/cartItem.controller.js");

router.put("/:id",authenticate,cartItemController.updateCartItem);
router.delete("/:id",authenticate,cartItemController.removeCartItem);

module.exports=router;