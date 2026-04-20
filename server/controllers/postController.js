import Post from "../models/Post.js";
import Reply from "../models/Reply.js";
import Circle from "../models/Circle.js";
import { createNotification } from "../utils/createNotification.js";
// ➕ Create a post
export const createPost = async (req, res) => {
  try {

    const { title, description, type, circleId, links } = req.body;

    if (!title || !description || !type || !circleId) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // handle single image
    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const post = await Post.create({
      title,
      description,
      type,
      circle: circleId,
      author: req.user._id,
      images: imagePath ? [imagePath] : [],
      links: links || [],
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
// 📄 Get posts of a circle
// 
export const getPostsByCircle = async (req, res) => {
  try {

    const { circleId } = req.params;
    const userId = req.user._id;

    // Check circle exists
    const circle = await Circle.findById(circleId);

    if (!circle) {
      return res.status(404).json({
        message: "Circle not found",
      });
    }

    // Check membership
    const isMember = circle.members.some(
      (member) =>
        member.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied. Join the circle first.",
      });
    }

    // Fetch posts
    const posts = await Post.find({ circle: circleId })
      .populate("author", "name photo role") // 🔥 role added
      .sort({ createdAt: -1 });

    res.status(200).json(posts);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to load posts",
    });

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

    if (post.type !== "discussion") {
      return res
        .status(400)
        .json({ message: "Only discussion posts can be liked" });
    }

    if (post.author.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot like your own post" });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
      // 🔔 Notify post author
if (post.author.toString() !== req.user._id.toString()) {
  await createNotification({
    user: post.author,
    type: "postLike",
    message: `${req.user.name} liked your discussion`,
    link: `/posts/${post._id}`,
  });
}
    }

    await post.save();

    // 🔥 IMPORTANT: Return fully populated post
    const updatedPost = await Post.findById(postId)
      .populate("author", "name photo role")
      .populate("circle", "name");

    res.status(200).json(updatedPost);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const deletePost = async (req,res) => {

  try{

    const { postId } = req.params;

    const post = await Post.findById(postId);

    if(!post){
      return res.status(404).json({
        message:"Post not found"
      });
    }

    if(post.author.toString() !== req.user._id.toString()){
      return res.status(403).json({
        message:"Not authorized"
      });
    }

    await Post.findByIdAndDelete(postId);

    res.json({
      message:"Post deleted"
    });

  }catch(err){

    console.error(err);

    res.status(500).json({
      message:"Delete failed"
    });

  }

};
export const deleteReply = async (req,res) => {

  try{

    const { replyId } = req.params;

    const reply = await Reply.findById(replyId);

    if(!reply){
      return res.status(404).json({
        message:"Reply not found"
      });
    }

    if(reply.author.toString() !== req.user._id.toString()){
      return res.status(403).json({
        message:"Not authorized"
      });
    }

    await Reply.findByIdAndDelete(replyId);

    res.json({
      message:"Reply deleted"
    });

  }catch(err){

    console.error(err);

    res.status(500).json({
      message:"Delete failed"
    });

  }

};
export const getMyPosts = async (req,res) => {

  const posts = await Post.find({
    author: req.user._id
  })
  .populate("circle","name")
  .sort({ createdAt:-1 });

  res.json(posts);

};
export const updatePost = async (req, res) => {
  try {

    const { postId } = req.params;
    const { title, description } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // Only author can edit
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    if (title !== undefined) post.title = title;
    if (description !== undefined) post.description = description;

    await post.save();

    res.json({
      message: "Post updated",
      post
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Update failed"
    });

  }
};
