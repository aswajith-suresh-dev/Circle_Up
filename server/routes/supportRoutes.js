import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {adminOnly} from "../middlewares/adminMiddleware.js";
import {
  submitComplaint,
  getAllComplaints,
  replyToComplaint,
} from "../controllers/supportController.js";
import { getMyComplaints } from "../controllers/supportController.js";
import {
  createFeedback,
  getAllFeedback,
} from "../controllers/supportController.js";
import { getMyFeedback } from "../controllers/supportController.js";
import { updateComplaint } from "../controllers/supportController.js";
import { deleteComplaint } from "../controllers/supportController.js";
const router = express.Router();
// User
router.post("/complaint", protect, submitComplaint);
router.get("/my-complaints", protect, getMyComplaints);
router.put("/complaint/edit/:complaintId", protect, updateComplaint);
router.delete("/complaint/:complaintId", protect, deleteComplaint);

// Admin
router.get("/complaints", protect, adminOnly, getAllComplaints);
router.put("/complaint/reply/:complaintId", protect, adminOnly, replyToComplaint);



// User submits feedback
router.post("/feedback", protect, createFeedback);
router.get("/my-feedback", protect, getMyFeedback);
// Admin views all feedback
router.get("/feedback", protect, adminOnly, getAllFeedback);

export default router;