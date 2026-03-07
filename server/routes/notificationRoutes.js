import express from "express";
import protect from "../middlewares/authMiddleware.js";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protect, getNotifications);

router.put("/:id/read", protect, markAsRead);

router.put("/read-all", protect, markAllAsRead);

router.get("/unread-count", protect, getUnreadCount);

export default router;