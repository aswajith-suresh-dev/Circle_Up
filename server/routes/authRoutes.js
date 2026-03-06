import express from "express";
import { signup, login } from "../controllers/authController.js";
import { changePassword } from "../controllers/authController.js";
import { completeOnboarding } from "../controllers/authController.js";
import { getProfile } from "../controllers/authController.js";
import { updateProfile } from "../controllers/authController.js";
import upload from "../middlewares/uploadMiddleware.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/onboarding", protect, completeOnboarding);
router.put("/change-password", protect, changePassword);
router.get("/profile", protect, getProfile);

router.put(
  "/profile",
  protect,
  upload.single("photo"),
  updateProfile
);
export default router;