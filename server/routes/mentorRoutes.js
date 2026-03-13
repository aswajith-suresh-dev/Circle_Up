import express from "express";
import { applyForMentor } from "../controllers/mentorController.js";
import protect from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
import {
  getPendingApplications,
  approveApplication,
  rejectApplication,
} from "../controllers/mentorController.js";
import { checkEligibility } from "../controllers/mentorController.js";
import { getAllMentors } from "../controllers/mentorController.js";
import { getMentorChallenges } from "../controllers/mentorController.js";
import { getMentorRevenue } from "../controllers/mentorController.js";
import { mentorOnly } from "../middlewares/mentorMiddleware.js";
import { deleteChallenge } from "../controllers/mentorController.js";
import { getMentorDashboard } from "../controllers/mentorDashboardController.js";
import { getMentorCircles } from "../controllers/mentorController.js";
import { getApplicationStatus } from "../controllers/mentorController.js";
const router = express.Router();

router.get("/check-eligibility", protect, checkEligibility);
router.get("/application-status", protect, getApplicationStatus);
router.post("/apply", protect, applyForMentor);

// Admin routes
router.get("/applications", protect, adminOnly, getPendingApplications);

router.put("/approve/:applicationId", protect, adminOnly, approveApplication);

router.put("/reject/:applicationId", protect, adminOnly, rejectApplication);
router.get("/challenges", protect, getMentorChallenges);
router.delete("/challenges/:challengeId", protect, mentorOnly, deleteChallenge);
router.get("/circles", protect, getMentorCircles);
router.get("/dashboard", protect, getMentorDashboard);
router.get("/all", getAllMentors);
router.get("/revenue", protect, mentorOnly, getMentorRevenue);

export default router;
