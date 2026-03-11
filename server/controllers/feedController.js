import Post from "../models/Post.js";
import Circle from "../models/Circle.js";

export const getFeed = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Find circles user joined
    const circles = await Circle.find({ members: userId }).select("_id");
    const circleIds = circles.map(c => c._id);

    // 2. Fetch posts from those circles
    const posts = await Post.find({ circle: { $in: circleIds } })
      .sort({ createdAt: -1 })
      .populate("author", "name photo")
      .populate("circle", "name");

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load feed" });
  }
};