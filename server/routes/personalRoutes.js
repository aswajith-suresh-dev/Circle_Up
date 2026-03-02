import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  createFolder,
  getMyFolders,
  deleteFolder,
} from "../controllers/personalController.js";
import { createTask } from "../controllers/personalController.js";
import { getTasksByFolder } from "../controllers/personalController.js";
import { addStudyLog } from "../controllers/personalController.js";
import { updateStudyLog } from "../controllers/personalController.js";
import { deleteStudyLog } from "../controllers/personalController.js";  

const router = express.Router();

router.post("/folders", protect, createFolder);
router.get("/folders", protect, getMyFolders);
router.delete("/folders/:folderId", protect, deleteFolder);
router.post("/task", protect, createTask);
router.get("/tasks/:folderId", protect, getTasksByFolder);
router.post("/task/:taskId/log", protect, addStudyLog);
router.put("/task/:taskId/log/:logId", protect, updateStudyLog);
router.delete("/task/:taskId/log/:logId", protect, deleteStudyLog);
export default router;