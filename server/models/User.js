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
      type: String, // URL
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

    activityStreak: {
      type: Number,
      default: 0,
    },

    lastActiveAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const User = mongoose.model("User", userSchema);

export default User;