import express from "express";
import {
  createProduct,
  fetchExpensiveProduct,
  fetchFewProductItems,
  fetchOneProduct,
  getAllProducts,
  deleteProduct,
} from "../controller/productController.js";

const productRouter = express.Router();

productRouter.post("/create", createProduct);

productRouter.get("/all", getAllProducts);

productRouter.get("/few", fetchFewProductItems);

productRouter.get("/:_id", fetchOneProduct);

productRouter.get("/:_id", fetchExpensiveProduct);

productRouter.delete("/:deleteId", deleteProduct);

export default productRouter;
