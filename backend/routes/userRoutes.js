import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/userControllers.js";
import { jwtMiddleware } from "../middlewares/jwtmiddleware.js";

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",jwtMiddleware,logoutUser);

export default router;