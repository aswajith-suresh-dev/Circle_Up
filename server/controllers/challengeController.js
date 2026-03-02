import Challenge from "../models/Challenge.js";
import Circle from "../models/Circle.js";
export const createChallenge = async (req, res) => {
  try {
const { title, description, type, price, totalDays, days, circleId } = req.body;
    // basic validation
    if (!title || !description || !totalDays || !days || !circleId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (days.length !== totalDays) {
      return res.status(400).json({
        message: "Days count must match totalDays",
      });
    }

    // validate day numbers
    for (let i = 0; i < days.length; i++) {
      if (days[i].dayNumber !== i + 1) {
        return res.status(400).json({
          message: "Day numbers must be sequential starting from 1",
        });
      }
    }
if (type === "paid" && (!price || price <= 0)) {
  return res.status(400).json({
    message: "Paid challenges must have a valid price",
  });
}
    const challenge = await Challenge.create({
      title,
      description,
      type,
      price,
      totalDays,
      days,
      circle: circleId,
      mentor: req.user._id,
    });

    res.status(201).json({
      message: "Challenge created successfully",
      challenge,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create challenge" });
  }
};
import UserChallengeProgress from "../models/UserChallengeProgress.js";

export const getChallengeDetail = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user._id;

    const challenge = await Challenge.findById(challengeId)
      .populate("mentor", "name");

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const progress = await UserChallengeProgress.findOne({
      user: userId,
      challenge: challengeId,
    });

    let canCheckIn = false;
    let todayDay = null;

    if (progress) {
      todayDay = progress.currentDay;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (progress.lastCheckInAt) {
        const last = new Date(progress.lastCheckInAt);
        last.setHours(0, 0, 0, 0);

        canCheckIn = today.getTime() !== last.getTime();
      } else {
        canCheckIn = true;
      }
    }

    res.status(200).json({
      challenge,
      progress,
      todayDay,
      canCheckIn,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load challenge" });
  }
};
export const getMyChallenges = async (req, res) => {
  try {
    const userId = req.user._id;

    const progresses = await UserChallengeProgress.find({ user: userId })
      .populate({
        path: "challenge",
        select: "title description totalDays",
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(progresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load challenges" });
  }
};
export const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate("mentor", "name")
      .select("title description totalDays type price circle mentor")
      .populate("circle", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(challenges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch challenges" });
  }
};
// controllers/challengeController.js


export const getChallengesByCircle = async (req, res) => {
  try {
    const { circleId } = req.params;
    const userId = req.user._id;

    const circle = await Circle.findById(circleId);

    if (!circle) {
      return res.status(404).json({
        message: "Circle not found",
      });
    }

    // 🔒 Membership check
    const isMember = circle.members.some(
      (member) =>
        member.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied. Join the circle first.",
      });
    }

    const challenges = await Challenge.find({
      circle: circleId,
    }).populate("mentor", "name");

    res.status(200).json(challenges);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to load challenges",
    });
  }
};