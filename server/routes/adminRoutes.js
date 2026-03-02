import express from "express";
import { promoteUser } from "../controllers/adminController.js";
import  protect  from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.put("/promote/:userId", protect, adminOnly, promoteUser);

export default router;