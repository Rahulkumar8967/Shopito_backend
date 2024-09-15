const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return res
    .status(200)
    .send({ message: "welcome to ecommerce api-node", status: true });
});

const authRouters = require("./routes/auth.route.js");
app.use("/auth", authRouters);

const userRoutes = require("./routes/user.route.js");
app.use("/api/users", userRoutes);

const productRouter = require("./routes/product.routes.js");
app.use("/api/product", productRouter);

const adminProductRouter = require("./routes/product.admin.routes.js");
app.use("/api/admin/products", adminProductRouter);

const cartRouter = require("./routes/cart.routes.js");
app.use("/api/cart", cartRouter);

const cartItemRouter = require("./routes/cartItem.routes.js");
app.use("/api/cart_items", cartItemRouter);

const orderRouter = require("./routes/order.routes.js");
app.use("/api/orders", orderRouter);

//const paymentRouter=require("./routes/payment.routes.js");
//app.use('/api/payments',paymentRouter)

const reviewRouter = require("./models/review.js");
app.use("/api/reviews", reviewRouter);

const ratingRouter = require("./routes/rating.routes.js");
app.use("/api/ratings", ratingRouter);

// admin routes handler
const adminOrderRouter = require("./routes/adminOrder.routes.js");
app.use("/api/admin/orders", adminOrderRouter);

module.exports = { app };
