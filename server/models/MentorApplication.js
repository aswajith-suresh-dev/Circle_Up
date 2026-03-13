import mongoose from "mongoose";

const mentorApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique:true,
    },

    bio: {
      type: String,
      required: true,
    },

    expertise: {
      type: String,
      required: true,
    },

    portfolioLink: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const MentorApplication = mongoose.model(
  "MentorApplication",
  mentorApplicationSchema
);

export default MentorApplication;