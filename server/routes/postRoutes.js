import express from "express";
import {
  createPost,
  getPostsByCircle,
  getPostWithReplies,
  toggleLikePost,   
} from "../controllers/postController.js";
import  protect  from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPost);
router.get("/circle/:circleId", protect, getPostsByCircle);
router.get("/:postId", protect, getPostWithReplies);
router.put("/like/:postId", protect, toggleLikePost);
export default router;