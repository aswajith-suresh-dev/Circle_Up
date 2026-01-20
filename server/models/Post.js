import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["doubt", "discussion"],
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    circle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Circle",
      required: true,
    },

    images: [{ type: String }],
    links: [{ type: String }],

    // only for discussion posts
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // only for doubt posts
    isSolved: {
      type: Boolean,
      default: false,
    },

    solvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reply",
      default: null,
    },
  },
  { timestamps: true },
);const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;