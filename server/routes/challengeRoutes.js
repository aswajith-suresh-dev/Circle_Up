import express from "express";
import { createChallenge } from "../controllers/challengeController.js";
import protect from "../middlewares/authMiddleware.js";
import { mentorOnly } from "../middlewares/mentorMiddleware.js";
const router = express.Router();

// mentor creates challenge

router.post("/", protect, mentorOnly, createChallenge);
export default router;