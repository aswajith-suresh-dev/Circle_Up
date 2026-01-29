import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const user = await User.findOne({ email: "aswin@gmail.com" });
user.role = "mentor";
await user.save();

console.log("User promoted to mentor");

process.exit();