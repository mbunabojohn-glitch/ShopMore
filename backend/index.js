import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import productRouter from "./routes/productRoute.js";
import userRouter from "./routes/userRoute.js";
import orderRouter from "./routes/orderRoute.js";
import addtoCartRouter from "./routes/addToCartRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Connect to Database
connectDB();

// 2. Global Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// 3. Routes
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/addToCart", addtoCartRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// 4. Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
