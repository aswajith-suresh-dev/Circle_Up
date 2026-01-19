import express from "express";
import {
  createCircle,
  joinCircle,
  getMyCircles,
} from "../controllers/circleController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createCircle);
router.post("/:id/join", protect, joinCircle);
router.get("/my", protect, getMyCircles);

export default router;