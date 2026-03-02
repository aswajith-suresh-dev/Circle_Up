import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const PersonalFolder = mongoose.model("PersonalFolder", folderSchema);

export default PersonalFolder;