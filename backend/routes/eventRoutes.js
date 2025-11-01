import express from "express";
import { createEvent, deleteEvent, getEvents, updateEvent } from "../controllers/eventControllers.js";
import {  jwtMiddleware } from "../middlewares/jwtmiddleware.js";

const router = express.Router();

router.get("/", jwtMiddleware, getEvents);
router.post("/create", jwtMiddleware, createEvent);
router.put("/update/:id", jwtMiddleware, updateEvent);
router.delete("/delete/:id", jwtMiddleware, deleteEvent);

export default router;