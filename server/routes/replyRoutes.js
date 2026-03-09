import express from "express";
import {
  addReply,
  upvoteReply,
  markReplyAsSolved,
} from "../controllers/replyController.js";
import  protect from "../middlewares/authMiddleware.js";
import { deleteReply } from "../controllers/postController.js";
import { updateReply } from "../controllers/replyController.js";

const router = express.Router();

router.post("/:postId", protect, addReply);
router.put("/:replyId", protect, updateReply);
router.put("/upvote/:replyId", protect, upvoteReply);
router.put("/solve/:postId/:replyId", protect, markReplyAsSolved);
router.delete("/:replyId", protect, deleteReply);

export default router;