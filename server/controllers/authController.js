import User from "../models/User.js";
import Circle from "../models/Circle.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Post from "../models/Post.js";
import ChallengeProgress from "../models/UserChallengeProgress.js";
//sign up controller

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      topics: [],
    });

    // 🔥 Generate token here
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: "Signup successful",
      token,  // ✅ MUST BE HERE
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        topics: user.topics || [],
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
//login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
// 🔥 LOGIN STREAK LOGIC
const today = new Date();
const lastActive = user.lastActiveAt;

if (!lastActive) {
  user.activityStreak = 1;
} else {
  const diffTime = today - new Date(lastActive);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Logged in yesterday → increase streak
    user.activityStreak += 1;
  } else if (diffDays > 1) {
    // Missed days → reset streak
    user.activityStreak = 1;
  }
  // If diffDays === 0 → same day login → do nothing
}

user.lastActiveAt = today;
await user.save();
    // 4. Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 5. Respond
    res.status(200).json({
  message: "Login successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    topics: user.topics || [],   // 🔥 ADD THIS
  },
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(
      newPassword,
      salt
    );

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const completeOnboarding = async (req, res) => {
  try {
    const { topics } = req.body;

    if (!topics || topics.length === 0) {
      return res.status(400).json({
        message: "Select at least one topic",
      });
    }

    const user = await User.findById(req.user._id);

    user.topics = topics;
    await user.save();

    const circles = await Circle.find({
      topic: {
        $in: topics.map((t) => new RegExp(`^${t}$`, "i")),
      },
    }).limit(5);

    const formattedCircles = circles.map((circle) => ({
      ...circle._doc,
      isMember: circle.members.includes(user._id),
    }));

    return res.status(200).json({
      message: "Onboarding completed",
      circles: formattedCircles,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user;

    const circlesJoined = await Circle.countDocuments({
      members: user._id,
    });

    const postsCreated = await Post.countDocuments({
      author: user._id,
    });

    const challengesJoined = await ChallengeProgress.countDocuments({
      user: user._id,
    });

    res.status(200).json({
      user: {
        name: user.name,
        photo: user.photo,
        description: user.description,
        role: user.role,
        createdAt: user.createdAt,
        activityStreak: user.activityStreak,
        replyUpvotesCount: user.replyUpvotesCount,
        solvedRepliesCount: user.solvedRepliesCount,
      },
      stats: {
        circlesJoined,
        postsCreated,
        challengesJoined,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (req.body.description !== undefined) {
      user.description = req.body.description;
    }

    if (req.file) {
      user.photo = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};