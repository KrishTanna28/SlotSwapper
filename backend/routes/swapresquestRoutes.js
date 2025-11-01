import express from "express";
import { swappableSlots, swapRequest, respondToSwap, mySwapRequests } from "../controllers/swaprequestControllers.js";
import {  jwtMiddleware } from "../middlewares/jwtmiddleware.js";

const router = express.Router();

router.get("/mySwapRequests", jwtMiddleware, mySwapRequests);
router.post("/swapRequest",jwtMiddleware, swapRequest);
router.post("/respondToSwap/:requestId",jwtMiddleware, respondToSwap);
router.get("/swappableSlots",jwtMiddleware, swappableSlots);

export default router;