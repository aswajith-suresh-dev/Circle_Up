import mongoose from "mongoose";

const userChallengeProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },

    currentDay: {
      type: Number,
      default: 1,
    },

    completedDays: {
      type: [Number], // [1, 2, 3]
      default: [],
    },

    streak: {
      type: Number,
      default: 0,
    },

    isBroken: {
      type: Boolean,
      default: false,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    lastCheckInAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const UserChallengeProgress = mongoose.model(
  "UserChallengeProgress",
  userChallengeProgressSchema
);

export default UserChallengeProgress;