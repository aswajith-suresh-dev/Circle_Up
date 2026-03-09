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
    type: [Number],
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

  isCompleted: {
    type: Boolean,
    default: false,
  },

  startedAt: {
    type: Date,
    default: Date.now,
  },

  isPaid: {
    type: Boolean,
    default: false,
  },

  lastCheckInAt: {
    type: Date,
    default: null,
  },
},
{ timestamps: true }
);

userChallengeProgressSchema.index(
  { user: 1, challenge: 1 },
  { unique: true }
);

const UserChallengeProgress = mongoose.model(
  "UserChallengeProgress",
  userChallengeProgressSchema
);

export default UserChallengeProgress;