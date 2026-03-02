import express from "express";
import { applyForMentor } from "../controllers/mentorController.js";
import protect from "../middlewares/authMiddleware.js";
import  {adminOnly} from "../middlewares/adminMiddleware.js";
import {
  getPendingApplications,
  approveApplication,
  rejectApplication
} from "../controllers/mentorController.js";

const router = express.Router();

router.post("/apply", protect, applyForMentor);

// Admin routes
router.get(
  "/applications",
  protect,
  adminOnly,
  getPendingApplications
);

router.put(
  "/approve/:applicationId",
  protect,
  adminOnly,
  approveApplication
);

router.put(
  "/reject/:applicationId",
  protect,
  adminOnly,
  rejectApplication
);
export default router;