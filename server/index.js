import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/authRoutes.js";
import circleRoutes from "./routes/circleRoutes.js";
import replyRoutes from "./routes/replyRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import feedRoutes from "./routes/feedRoutes.js";

dotenv.config();

const app = express();

// ───────────────────────────
// Middleware
// ───────────────────────────
app.use(cors());
app.use(express.json());

// ───────────────────────────
// Test Route
// ───────────────────────────
app.get("/", (req, res) => {
  res.send("CircleUp backend is running 🚀");
});

// ───────────────────────────
// API Routes
// ───────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/circles", circleRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/replies", replyRoutes);
app.use("/api/feed", feedRoutes);
// ───────────────────────────
// MongoDB Connection
// ───────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");
  })
  .catch((err) => {
    console.error("MongoDB connection error ❌", err);
  });

// ───────────────────────────
// Server Start
// ───────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
