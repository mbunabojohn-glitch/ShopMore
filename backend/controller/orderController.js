import Order from "../model/order.js";
import Product from "../model/product.js";
import mongoose from "mongoose";

const createOrder = async (req, res) => {
  try {
    const { productId, quantity = 1, userId } = req.body;

    // Validate ids
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const user = req.user?._id || userId;
    if (!user || !mongoose.Types.ObjectId.isValid(String(user))) {
      return res.status(400).json({
        message:
          "Missing user context. Provide userId in body or send Authorization for authenticated requests",
      });
    }

    //  Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    const price = Number(product.price);
    const qty = Number(quantity) || 1;
    const totalAmount = price * qty;

    //  Create new order
    const newOrder = new Order({
      price,
      quantity: qty,
      totalAmount,
      user,
      productId,
    });

    //  Save order
    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// fetch all orders from the database
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "email")
      .populate("productId", "price");
    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// fetch few orders from the database
const getFewOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "email")
      .populate("productId", "price")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      message: "Selected orders fetched successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// fetch one order from the database by id
const getOneOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order id" });
    }
    const order = await Order.findById(orderId)
      .populate("user", "email")
      .populate("productId", "price");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export { createOrder, getAllOrders, getFewOrders, getOneOrder };
