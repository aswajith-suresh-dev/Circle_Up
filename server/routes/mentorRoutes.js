import express from "express";
import { applyForMentor } from "../controllers/mentorController.js";
import protect from "../middlewares/authMiddleware.js";
import  {adminOnly} from "../middlewares/adminMiddleware.js";
import {
  getPendingApplications,
  approveApplication,
  rejectApplication
} from "../controllers/mentorController.js";
import { checkEligibility } from "../controllers/mentorController.js";
import { getAllMentors } from "../controllers/mentorController.js";


const router = express.Router();

router.get(
  "/check-eligibility",
  protect,
  checkEligibility
);
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

router.get("/all", getAllMentors);

export default router;