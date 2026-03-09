import express from "express"
import {createUser, getAllUsers, getOneUser, loginUser, deleteUser, updateUser} from "../controller/userController.js"



const userRouter = express.Router();

userRouter.post("/make", createUser);

userRouter.get("/getting", getAllUsers);

userRouter.get("/:_id", getOneUser);

userRouter.post("/login", loginUser);

userRouter.delete("/:_id", deleteUser);

userRouter.put("/:_id", updateUser);


export default userRouter;