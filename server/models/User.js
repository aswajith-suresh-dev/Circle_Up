import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["learner", "contributor"],
      default: "learner",
    },

    

    replyUpvotesCount: {
      type: Number,
      default: 0,
    },

    solvedRepliesCount: {
      type: Number,
      default: 0,
    },

    // 🧭 Track circles where user contributed
    contributorCircles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Circle",
      },
    ],

    // 🌱 Personal consistency (separate from contributor logic)
    activityStreak: {
      type: Number,
      default: 0,
    },

    lastActiveAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// ✅ Safe model export (prevents overwrite error)
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;