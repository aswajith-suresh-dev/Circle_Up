import Circle from "../models/Circle.js";

/**
 * @desc    Create a new circle
 * @route   POST /api/circles
 * @access  Mentor only (for now we trust role from req.user)
 */
export const createCircle = async (req, res) => {
  try {
    if (req.user.role !== "mentor") {
      return res.status(403).json({
        message: "Only mentors can create circles",
      });
    }
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
export const searchCircles = async (req, res) => {
  try {
    const { query, topic, level } = req.query;

    let filter = {};

    // 🔍 search by circle name
    if (query) {
      filter.name = { $regex: query, $options: "i" };
    }

    // 🏷 filter by topic (case-insensitive)
    if (topic) {
      filter.topic = { $regex: `^${topic}$`, $options: "i" };
    }

    // 📚 filter by level (case-insensitive)
    if (level) {
      filter.level = { $regex: `^${level}$`, $options: "i" };
    }

    const circles = await Circle.find(filter)
      .populate("mentor", "name");

    res.status(200).json(circles);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Search failed",
    });
  }
};export const getCircleById = async (req, res) => {
  try {
    const { circleId } = req.params;

    const circle = await Circle.findById(circleId)
      .populate("mentor", "name");

    if (!circle) {
      return res.status(404).json({
        message: "Circle not found",
      });
    }

    // 🔥 CHECK IF USER IS MEMBER
    const isMember = circle.members.some(
      (member) =>
        member.toString() ===
        req.user._id.toString()
    );

    res.status(200).json({
      ...circle._doc,
      isMember,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to load circle",
    });
  }
};
export const getSuggestedCircles = async (req, res) => {
  try {
    const user = req.user;

    if (!user.topics || user.topics.length === 0) {
      return res.status(200).json([]);
    }

    const circles = await Circle.find({
      topic: {
        $in: user.topics.map(
          (t) => new RegExp(`^${t}$`, "i")
        ),
      },
    }).limit(5);

    const formatted = circles.map((circle) => ({
  ...circle._doc,
  isMember: circle.members.some(
    (memberId) =>
      memberId.toString() === req.user._id.toString()
  ),
}));

    res.status(200).json(formatted);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
export const getTopCircles = async (req, res) => {
  try {

    const circles = await Circle.aggregate([
      {
        $addFields: {
          membersCount: { $size: { $ifNull: ["$members", []] } }
        }
      },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ["$membersCount", 2] },
              "$postCount"
            ]
          }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 5 },
      { $project: { name: 1, membersCount: 1, postCount: 1 } }
    ]);

    res.status(200).json(circles);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load top circles" });
  }
};export const deleteCircle = async (req, res) => {
  try {
    const { circleId } = req.params;

    const circle = await Circle.findById(circleId);
    if (!circle) {
      return res.status(404).json({ message: "Circle not found" });
    }

    // Normalize IDs (handles req.user._id or req.user.id)
    const userId = String(req.user?._id || req.user?.id);
    const mentorId = String(circle.mentor);

    if (mentorId !== userId) {
      return res.status(403).json({
        message: "You are not the mentor of this circle",
      });
    }

    await Circle.findByIdAndDelete(circleId);

    res.json({ message: "Circle deleted successfully" });
  } catch (error) {
    console.error("DELETE CIRCLE ERROR:", error);
    res.status(500).json({ message: "Delete failed" });
  }
};
export const getMentorCircles = async (req, res) => {
  try {

    const circles = await Circle.find({
      mentor: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json(circles);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to load mentor circles"
    });

  }
};
export const updateCircle = async (req, res) => {
  try {
    const { circleId } = req.params;
    const { name, description, topic, level } = req.body;

    const circle = await Circle.findById(circleId);

    if (!circle) {
      return res.status(404).json({
        message: "Circle not found",
      });
    }

    // Only mentor can edit
    if (circle.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    circle.name = name || circle.name;
    circle.description = description || circle.description;
    circle.topic = topic || circle.topic;
    circle.level = level || circle.level;

    await circle.save();

    res.json(circle);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Update failed",
    });
  }
};
/**
 * @desc    Leave a circle
 * @route   PUT /api/circles/:circleId/leave
 * @access  Logged-in user
 */
export const leaveCircle = async (req, res) => {
  try {
    const { circleId } = req.params;
    const userId = req.user._id;

    const circle = await Circle.findById(circleId);

    if (!circle) {
      return res.status(404).json({
        message: "Circle not found",
      });
    }

    // ❌ If user is not a member
    if (!circle.members.includes(userId)) {
      return res.status(400).json({
        message: "You are not a member of this circle",
      });
    }

    // 🚫 Prevent mentor from leaving (important rule)
    if (circle.mentor.toString() === userId.toString()) {
      return res.status(400).json({
        message: "Mentor cannot leave their own circle",
      });
    }

    // ✅ Remove user from members
    circle.members = circle.members.filter(
      (member) => member.toString() !== userId.toString()
    );

    await circle.save();

    res.status(200).json({
      message: "Left circle successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to leave circle",
    });
  }
};