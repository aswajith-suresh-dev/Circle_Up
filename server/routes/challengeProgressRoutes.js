import express from "express";
import { joinChallenge } from "../controllers/challengeProgressController.js";
import protect from "../middlewares/authMiddleware.js";
import { getMyChallenges } from "../controllers/challengeProgressController.js";
import { checkInToday } from "../controllers/challengeProgressController.js";
const router = express.Router();

// user joins challenge
router.post("/:challengeId/join", protect, joinChallenge);


// get user's challenges
router.get("/my", protect, getMyChallenges);

//user checks in for the day
router.post(
  "/:challengeId/checkin",
  protect,
  checkInToday
);
export default router;
