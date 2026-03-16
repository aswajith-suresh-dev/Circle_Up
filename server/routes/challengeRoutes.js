import express from "express";
import { createChallenge } from "../controllers/challengeController.js";
import protect from "../middlewares/authMiddleware.js";
import { mentorOnly } from "../middlewares/mentorMiddleware.js";
import { getChallengeDetail } from "../controllers/challengeController.js";
import { getMyChallenges } from "../controllers/challengeController.js";
import { getAllChallenges } from "../controllers/challengeController.js";
import { getChallengesByCircle } from "../controllers/challengeController.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
import { getPopularChallenges } from "../controllers/challengeController.js";
import { updateChallenge } from "../controllers/challengeController.js";
import { getChallengeOverview } from "../controllers/challengeController.js";
const router = express.Router();

// mentor creates challenge

router.post("/", protect, mentorOnly, createChallenge);
router.get("/all", protect, getAllChallenges);
router.get("/popular", protect, getPopularChallenges);
router.get("/:challengeId/overview", protect, getChallengeOverview);
router.get("/:challengeId", protect, getChallengeDetail);
router.put("/:challengeId", protect, updateChallenge);
router.get(
  "/circle/:circleId",
  protect,
  getChallengesByCircle
);
export default router;