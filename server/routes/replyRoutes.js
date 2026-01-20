import express from "express";
import {
  addReply,
  upvoteReply,
  markReplyAsSolved,
} from "../controllers/replyController.js";
import  protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:postId", protect, addReply);
router.put("/upvote/:replyId", protect, upvoteReply);
router.put("/solve/:postId/:replyId", protect, markReplyAsSolved);

export default router;