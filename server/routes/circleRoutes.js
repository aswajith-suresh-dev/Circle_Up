import express from "express";
import {
  createCircle,
  joinCircle,
  getMyCircles,
  searchCircles,getCircleById
} from "../controllers/circleController.js";
import { leaveCircle } from "../controllers/circleController.js";
import protect from "../middlewares/authMiddleware.js";
import { getSuggestedCircles } from "../controllers/circleController.js";
import { getTopCircles } from "../controllers/circleController.js";
import { deleteCircle } from "../controllers/circleController.js";
import { getMentorCircles } from "../controllers/circleController.js";
import { updateCircle } from "../controllers/circleController.js";
const router = express.Router();


router.post("/", protect, createCircle);
router.post("/:id/join", protect, joinCircle);
router.put("/:circleId", protect, updateCircle);
router.delete(
  "/:circleId",
  protect,
  deleteCircle
);
router.get("/my", protect, getMyCircles);
router.get("/search", protect, searchCircles);
router.get("/suggestions", protect, getSuggestedCircles);
router.get("/top", protect, getTopCircles);

router.get(
  "/mentor",
  protect,
  getMentorCircles
);
router.get("/:circleId", protect, getCircleById);

router.put("/:circleId/leave", protect, leaveCircle);




export default router;