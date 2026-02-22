import express from "express";
import { createChallenge } from "../controllers/challengeController.js";
import protect from "../middlewares/authMiddleware.js";
import { mentorOnly } from "../middlewares/mentorMiddleware.js";
import { getChallengeDetail } from "../controllers/challengeController.js";
import { getMyChallenges } from "../controllers/challengeController.js";
import { getAllChallenges } from "../controllers/challengeController.js";
const router = express.Router();

// mentor creates challenge

router.post("/", protect, mentorOnly, createChallenge);
router.get("/all", protect, getAllChallenges);
router.get("/:challengeId", protect, getChallengeDetail);
export default router;