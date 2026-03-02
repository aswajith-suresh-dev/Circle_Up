import mongoose from "mongoose";

const studyLogSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  { _id: true }
);

const personalTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,

    sources: [String],   // links
    images: [String],    // image URLs

    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PersonalFolder",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    studyLogs: [studyLogSchema],
  },
  { timestamps: true }
);

export default mongoose.model(
  "PersonalTask",
  personalTaskSchema
);