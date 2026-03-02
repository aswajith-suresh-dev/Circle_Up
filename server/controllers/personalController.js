import PersonalFolder from "../models/PersonalFolder.js";
import PersonalTask from "../models/PersonalTask.js";
// 🔹 Create Folder
export const createFolder = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Folder name is required",
      });
    }

    const folder = await PersonalFolder.create({
      user: req.user._id,
      name,
    });

    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get My Folders
export const getMyFolders = async (req, res) => {
  try {
    const folders = await PersonalFolder.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Delete Folder
export const deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    const folder = await PersonalFolder.findById(folderId);

    if (!folder) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    if (folder.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await folder.deleteOne();

    res.status(200).json({
      message: "Folder deleted",
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// 🔹 Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, folderId, sources, images } = req.body;

    if (!title || !folderId) {
      return res.status(400).json({
        message: "Title and folderId are required",
      });
    }

    // 🔐 Check folder ownership
    const folder = await PersonalFolder.findById(folderId);

    if (!folder) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    if (folder.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const task = await PersonalTask.create({
      title,
      description,
      sources: sources || [],
      images: images || [],
      folder: folderId,
      user: req.user._id,
    });

    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// 🔹 Get Tasks By Folder
export const getTasksByFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    const tasks = await PersonalTask.find({
      folder: folderId,
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const addStudyLog = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { date, startTime, endTime } = req.body;

    const task = await PersonalTask.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    task.studyLogs.unshift({ date, startTime, endTime });

    await task.save();

    res.status(200).json(task);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const updateStudyLog = async (req, res) => {
  try {
    const { taskId, logId } = req.params;
    const { date, startTime, endTime } = req.body;

    const task = await PersonalTask.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const log = task.studyLogs.id(logId);

    if (!log) {
      return res.status(404).json({ message: "Study log not found" });
    }

    log.date = date;
    log.startTime = startTime;
    log.endTime = endTime;

    await task.save();

    res.status(200).json(task);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteStudyLog = async (req, res) => {
  try {
    const { taskId, logId } = req.params;

    const task = await PersonalTask.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔐 Ensure ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const log = task.studyLogs.id(logId);

    if (!log) {
      return res.status(404).json({ message: "Study log not found" });
    }

    // Remove the log
    log.deleteOne();

    await task.save();

    res.status(200).json({
      message: "Study log deleted",
      task,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};