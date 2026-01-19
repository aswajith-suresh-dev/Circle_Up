import Circle from "../models/Circle.js";

// @desc   Create a new circle
// @route  POST /api/circles
// @access Protected
export const createCircle = async (req, res) => {
  try {
    const { name, description, topic, level } = req.body;

    if (!name || !description || !topic || !level) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create circle
    const circle = await Circle.create({
      name,
      description,
      topic,
      level,
      mentor: req.user._id,
      members: [req.user._id], // mentor auto-joins
    });

    res.status(201).json(circle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// @desc   Get all circles
// @route  GET /api/circles
// @access Protected
export const getAllCircles = async (req, res) => {
  try {
    const circles = await Circle.find()
      .populate("mentor", "name email")
      .sort({ createdAt: -1 });

    res.json(circles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// @desc   Join a circle
// @route  POST /api/circles/:circleId/join
// @access Protected
export const joinCircle = async (req, res) => {
  try {
    const circle = await Circle.findById(req.params.circleId);

    if (!circle) {
      return res.status(404).json({ message: "Circle not found" });
    }

    // Check if already a member
    if (circle.members.includes(req.user._id)) {
      return res.status(400).json({ message: "Already a member" });
    }

    circle.members.push(req.user._id);
    await circle.save();

    res.json({ message: "Joined circle successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};