import express from "express";
import {
  createCircle,
  getAllCircles,
  joinCircle,
} from "../controllers/circleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a circle (mentor only — enforced in controller)
router.post("/", protect, createCircle);

// Get all circles
router.get("/", protect, getAllCircles);

// Join a circle
router.post("/:circleId/join", protect, joinCircle);

export default router;