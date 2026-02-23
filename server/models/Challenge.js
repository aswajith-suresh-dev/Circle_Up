import mongoose from "mongoose";

const challengeDaySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    resources: [
      {
        title: String,
        url: String,
      },
    ],
  },
  { _id: false }
);

const challengeSchema = new mongoose.Schema(
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
      enum: ["free", "paid"],
      default: "free",
    },
price: {
  type: Number,
  required: function () {
    return this.type === "paid";
  },
  default: 0,
},
    totalDays: {
      type: Number,
      required: true,
    },

    days: {
      type: [challengeDaySchema],
      required: true,
    },

    circle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Circle",
      required: true,
    },

    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  
  { timestamps: true }
);

const Challenge = mongoose.model("Challenge", challengeSchema);
export default Challenge;