import express from "express";
import {
  createPost,
  getPostsByCircle,
  getPostWithReplies,
  toggleLikePost,
} from "../controllers/postController.js";
import protect from "../middlewares/authMiddleware.js";
import { deletePost, deleteReply } from "../controllers/postController.js";
import { getMyPosts } from "../controllers/postController.js";
import { updatePost } from "../controllers/postController.js";
import upload from "../middlewares/uploadMiddleware.js";
const router = express.Router();

router.post("/", protect, upload.single("images"), createPost);
router.get("/circle/:circleId", protect, getPostsByCircle);
router.get("/my", protect, getMyPosts);
router.put("/:postId", protect, updatePost);
router.get("/:postId", protect, getPostWithReplies);
router.put("/like/:postId", protect, toggleLikePost);
router.delete("/:postId", protect, deletePost);
router.delete("/reply/:replyId", protect, deleteReply);

export default router;
