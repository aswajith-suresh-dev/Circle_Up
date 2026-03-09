import express from "express";
import { promoteUser } from "../controllers/adminController.js";
import { getPendingChallenges } from "../controllers/adminController.js";
import { approveChallenge } from "../controllers/adminController.js";
import { rejectChallenge } from "../controllers/adminController.js";    
import  protect  from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
const router = express.Router();

router.put("/promote/:userId", protect, adminOnly, promoteUser);

router.get("/challenges/pending", protect, adminOnly, getPendingChallenges);

router.patch("/challenges/:challengeId/approve", protect, adminOnly, approveChallenge);

router.patch("/challenges/:challengeId/reject", protect, adminOnly, rejectChallenge);
export default router;