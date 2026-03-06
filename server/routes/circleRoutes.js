import express from "express";
import {
  createCircle,
  joinCircle,
  getMyCircles,
  searchCircles,getCircleById
} from "../controllers/circleController.js";
import protect from "../middlewares/authMiddleware.js";
import { getSuggestedCircles } from "../controllers/circleController.js";
const router = express.Router();


router.post("/", protect, createCircle);
router.post("/:id/join", protect, joinCircle);
router.get("/my", protect, getMyCircles);
router.get("/search", protect, searchCircles);
router.get("/suggestions", protect, getSuggestedCircles);
router.get("/:circleId", protect, getCircleById);
export default router;