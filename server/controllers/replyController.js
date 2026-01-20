import Reply from "../models/Reply.js";
import Post from "../models/Post.js";
import  User from "../models/User.js";
import { checkAndPromoteContributor } from "../utils/checkAndPromoteContributor.js";
// ➕ Add a reply to a post
export const addReply = async (req, res) => {
  try {
    console.log("🔥 ADD REPLY CONTROLLER HIT");
    const { content } = req.body;
    const { postId } = req.params;

    if (!content) {
      return res.status(400).json({ message: "Reply content is required" });
    }

    // check post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const reply = await Reply.create({
      content,
      post: postId,
      author: req.user._id,
    });
    // track contributor circles
if (
  !req.user.contributorCircles.some(
    (circleId) => circleId.toString() === post.circle.toString()
  )
) {      req.user.contributorCircles.push(post.circle);
      await req.user.save();
    }
    res.status(201).json({
      message: "Reply added successfully",
      reply,
    });
  }catch (error) {
  console.error("🔥 ADD REPLY ERROR:", error);
  return res.status(500).json({
    message: "Server error",
    error: error.message,
  });
}
};
// 👍 Upvote a reply
export const upvoteReply = async (req, res) => {
  try {
    const { replyId } = req.params;

    const reply = await Reply.findById(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }
    // Prevent self-upvote
    if (reply.author.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot upvote your own reply" });
    }
    // prevent duplicate upvote
    if (reply.upvotes.includes(req.user._id)) {
      return res.status(400).json({ message: "Already upvoted" });
    }

    reply.upvotes.push(req.user._id);
    await reply.save();
    // increment upvote count for reply author
    const replyAuthor = await User.findById(reply.author);
    replyAuthor.replyUpvotesCount += 1;
    await replyAuthor.save();

    // check promotion
    await checkAndPromoteContributor(replyAuthor._id);
    res.status(200).json({
      message: "Reply upvoted",
      upvotesCount: reply.upvotes.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// ✅ Mark reply as solved
export const markReplyAsSolved = async (req, res) => {
  try {
    const { postId, replyId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // only post author can solve
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to mark solved" });
    }

    if (post.type !== "doubt") {
      return res.status(400).json({ message: "Only doubts can be solved" });
    }

    post.isSolved = true;
    post.solvedBy = replyId;
    await post.save();
    const reply = await Reply.findById(replyId);

    const replyAuthor = await User.findById(reply.author);
    replyAuthor.solvedRepliesCount += 1;
    await replyAuthor.save();

    // check promotion
    await checkAndPromoteContributor(replyAuthor._id);
    res.status(200).json({
      message: "Reply marked as solved",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
