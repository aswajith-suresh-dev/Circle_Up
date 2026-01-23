import Post from "../models/Post.js";
import Reply from "../models/Reply.js";

// ➕ Create a post
export const createPost = async (req, res) => {
  try {
    console.log("🚨 createPost controller HIT");
    const { title, description, type, circleId, images, links } = req.body;

    if (!title || !description || !type || !circleId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const post = await Post.create({
      title,
      description,
      type, // "doubt" | "discussion"
      circle: circleId,
      author: req.user._id,
      images: images || [],
      links: links || [],
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// 📄 Get posts of a circle
export const getPostsByCircle = async (req, res) => {
  try {
    const { circleId } = req.params;

    const posts = await Post.find({ circle: circleId })
      .sort({ createdAt: -1 }) // newest first
      .populate("author", "name photo")
      .populate("circle", "name topic");

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// 📌 Get single post with replies
export const getPostWithReplies = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("author", "name photo")
      .populate("circle", "name topic");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const replies = await Reply.find({ post: postId })
      .sort({ createdAt: 1 }) // oldest first
      .populate("author", "name photo");

    res.status(200).json({
      post,
      replies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// 👍 Like / Unlike a discussion post
export const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only discussion posts can be liked
    if (post.type !== "discussion") {
      return res
        .status(400)
        .json({ message: "Only discussion posts can be liked" });
    }

    // 🚫 Prevent self-like (CORRECT PLACE)
    if (post.author.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot like your own post" });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes.pull(userId); // unlike
    } else {
      post.likes.push(userId); // like
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};