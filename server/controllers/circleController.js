import Circle from "../models/Circle.js";

/**
 * @desc    Create a new circle
 * @route   POST /api/circles
 * @access  Mentor only (for now we trust role from req.user)
 */
export const createCircle = async (req, res) => {
  try {
    const { name, description, topic, level } = req.body;

    if (!name || !description || !topic || !level) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const circle = await Circle.create({
      name,
      description,
      topic,
      level,
      mentor: req.user.id,
      members: [req.user.id], // mentor auto-joins
    });

    res.status(201).json(circle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create circle" });
  }
};

/**
 * @desc    Join a circle
 * @route   POST /api/circles/:id/join
 * @access  Any logged-in user
 */
export const joinCircle = async (req, res) => {
  try {
    const circle = await Circle.findById(req.params.id);

    if (!circle) {
      return res.status(404).json({ message: "Circle not found" });
    }

    if (circle.members.includes(req.user.id)) {
      return res.status(400).json({ message: "Already a member" });
    }

    circle.members.push(req.user.id);
    await circle.save();

    res.json({ message: "Joined circle successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to join circle" });
  }
};

/**
 * @desc    Get circles joined by user
 * @route   GET /api/circles/my
 * @access  Logged-in user
 */
export const getMyCircles = async (req, res) => {
  try {
    const circles = await Circle.find({
      members: req.user.id,
    }).populate("mentor", "name");

    res.json(circles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch circles" });
  }
};