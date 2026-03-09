import express from "express";
import { signup, login } from "../controllers/authController.js";
import { changePassword } from "../controllers/authController.js";
import { completeOnboarding } from "../controllers/authController.js";
import { getProfile } from "../controllers/authController.js";
import { updateProfile } from "../controllers/authController.js";
import upload from "../middlewares/uploadMiddleware.js";
import protect from "../middlewares/authMiddleware.js";
import { forgotPassword } from "../controllers/authController.js";
import { resetPassword } from "../controllers/authController.js"; 

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/onboarding", protect, completeOnboarding);
router.put("/change-password", protect, changePassword);
router.get("/profile", protect, getProfile);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.put(
  "/profile",
  protect,
  upload.single("photo"),
  updateProfile
);
export default router;