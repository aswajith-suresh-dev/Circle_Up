import User from "../models/User.js";
import Challenge from "../models/Challenge.js";
export const promoteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["contributor", "mentor"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🔥 Mentor must already be contributor
    if (role === "mentor" && user.role !== "contributor") {
      return res.status(400).json({
        message:
          "User must be a contributor before becoming mentor",
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: `User promoted to ${role}`,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
export const getPendingChallenges = async (req, res) => {
  try {

    const challenges = await Challenge.find({
      approvalStatus: "pending"
    })
    .populate("mentor", "name")
    .populate("circle", "name");

    res.status(200).json(challenges);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to load pending challenges",
    });
  }
};
export const approveChallenge = async (req, res) => {
  try {

    const { challengeId } = req.params;

    await Challenge.findByIdAndUpdate(
      challengeId,
      { approvalStatus: "approved" }
    );

    res.status(200).json({
      message: "Challenge approved",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Approval failed",
    });
  }
};
export const rejectChallenge = async (req, res) => {
  try {

    const { challengeId } = req.params;

    await Challenge.findByIdAndUpdate(
      challengeId,
      { approvalStatus: "rejected" }
    );

    res.status(200).json({
      message: "Challenge rejected",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Rejection failed",
    });
  }
};