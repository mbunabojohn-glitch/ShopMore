import { addToCart } from "../controller/addToCartController.js";
import { protectedRoute } from "../middleware/authentication.js";
import express from "express";

const addtoCartRouter = express.Router();

// I added protected route 
addtoCartRouter.post("/create", protectedRoute, addToCart); 

export default addtoCartRouter;
