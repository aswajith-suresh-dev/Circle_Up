import express from "express";
import { addReview, getChallengeReviews } from "../controllers/reviewController.js";
import  protect from "../middlewares/authMiddleware.js";
import { updateReview } from "../controllers/reviewController.js";


const router = express.Router();

router.post("/:challengeId",protect,addReview);
router.get("/:challengeId",getChallengeReviews);
router.put("/:reviewId", protect, updateReview);

export default router;