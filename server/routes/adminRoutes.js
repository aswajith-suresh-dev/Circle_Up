import express from "express";
import { promoteUser } from "../controllers/adminController.js";
import { getPendingChallenges } from "../controllers/adminController.js";
import { approveChallenge } from "../controllers/adminController.js";
import { rejectChallenge } from "../controllers/adminController.js";
import { getAdminRevenue } from "../controllers/adminController.js";
import protect from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
import { getAdminDashboardStats } from "../controllers/adminController.js";
import { getTopDashboardData } from "../controllers/adminController.js";
import { getAdminRevenueList } from "../controllers/adminController.js";
import { getAllUsers } from "../controllers/adminController.js";
import { deleteUser } from "../controllers/adminController.js";
import { deleteCircle } from "../controllers/adminController.js";
import { getAllCircles } from "../controllers/adminController.js";
import { getAllChallenges } from "../controllers/adminController.js";
import { deleteChallenge } from "../controllers/adminController.js";
const router = express.Router();

router.put("/promote/:userId", protect, adminOnly, promoteUser);

router.get("/challenges/pending", protect, adminOnly, getPendingChallenges);

router.patch(
  "/challenges/:challengeId/approve",
  protect,
  adminOnly,
  approveChallenge,
);

router.patch(
  "/challenges/:challengeId/reject",
  protect,
  adminOnly,
  rejectChallenge,
);
router.get("/revenue", protect, adminOnly, getAdminRevenue);
router.get("/dashboard", protect, adminOnly);
router.get("/top-data", protect, adminOnly, getTopDashboardData);
router.get("/dashboard", protect, adminOnly, getAdminDashboardStats);
router.get("/revenue-list", getAdminRevenueList);
router.get("/users", getAllUsers);
router.delete("/users/:userId", deleteUser);
router.get("/circles", getAllCircles);
router.delete("/circles/:circleId", deleteCircle);
router.get("/challenges", getAllChallenges);
router.delete("/challenges/:challengeId", deleteChallenge);
export default router;
