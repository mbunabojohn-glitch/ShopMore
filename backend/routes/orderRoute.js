import express from "express";
import { createOrder, getAllOrders, getFewOrders, getOneOrder } from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/create", createOrder);
orderRouter.get("/all", getAllOrders);
orderRouter.get("/:id", getOneOrder);
orderRouter.get("/few", getFewOrders);

export default orderRouter;
