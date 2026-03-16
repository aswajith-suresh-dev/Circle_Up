import Challenge from "../models/Challenge.js";
import Circle from "../models/Circle.js";
export const createChallenge = async (req, res) => {
  try {

const { title, description, type, price, level, totalDays, days, circleId } = req.body;

    if (!title || !description || !totalDays || !days || !circleId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (days.length !== totalDays) {
      return res.status(400).json({
        message: "Days count must match totalDays",
      });
    }

    for (let i = 0; i < days.length; i++) {
      if (days[i].dayNumber !== i + 1) {
        return res.status(400).json({
          message: "Day numbers must be sequential",
        });
      }
    }

    if (type === "paid" && (!price || price <= 0)) {
      return res.status(400).json({
        message: "Paid challenges must have a price",
      });
    }

    const challenge = await Challenge.create({
  title,
  description,
  level,
  type,
  price,
  totalDays,
  days,
  circle: circleId,
  mentor: req.user._id,
  approvalStatus: type === "paid" ? "pending" : "approved",
});

    res.status(201).json({
      message: "Challenge created successfully",
      challenge,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create challenge",
    });
  }
};

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

    const progresses = await UserChallengeProgress.find({
      user: userId
    })
      .populate({
        path: "challenge",
        populate: [
          { path: "circle", select: "name" },
          { path: "mentor", select: "name" }
        ]
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(progresses);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Failed to load challenges" });

  }

};
import UserChallengeProgress from "../models/UserChallengeProgress.js";

import ChallengeReview from "../models/ChallengeReview.js";

export const getAllChallenges = async (req, res) => {

  try {

    const challenges = await Challenge.find()
      .populate("circle", "name")
      .populate("mentor", "name");

    const result = await Promise.all(

      challenges.map(async (challenge) => {

        // ⭐ Get reviews
        const reviews = await ChallengeReview.find({
          challenge: challenge._id
        });

        const reviewCount = reviews.length;

        const avgRating = reviewCount
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
          : 0;

        // 👥 Count participants
        const participants = await UserChallengeProgress.countDocuments({
          challenge: challenge._id
        });

        return {
          ...challenge._doc,
          avgRating,
          reviewCount,
          participants
        };

      })

    );

    res.json(result);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Failed to load challenges" });

  }

};// controllers/challengeController.js


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
  approvalStatus: "approved",
}).populate("mentor", "name");

    res.status(200).json(challenges);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to load challenges",
    });
  }
};
export const getPopularChallenges = async (req,res) => {

try{

const challenges = await Challenge.find({ approvalStatus:"approved" })
.sort({ createdAt:-1 })
.limit(5)
.select("title");

res.status(200).json(challenges);

}catch(error){

console.error(error);
res.status(500).json({message:"Failed to load challenges"});

}

};
export const updateChallenge = async (req, res) => {
  try {

    const { challengeId } = req.params;
    const { title, description, level, type, price, totalDays, days } = req.body;

    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        message: "Challenge not found",
      });
    }

    // Only mentor who created it can edit
    if (challenge.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    challenge.title = title || challenge.title;
    challenge.description = description || challenge.description;
    challenge.level = level || challenge.level;
    challenge.type = type || challenge.type;

    if (type === "paid") {
      challenge.price = price;
    }

    challenge.totalDays = totalDays || challenge.totalDays;
    challenge.days = days || challenge.days;

    await challenge.save();

    res.status(200).json({
      message: "Challenge updated successfully",
      challenge,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Update failed",
    });

  }
};
export const getChallengeOverview = async (req, res) => {

  try {

    const { challengeId } = req.params;

    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const progress = await UserChallengeProgress.find({
      challenge: challengeId,
    });

    const participants = progress.length;

    const completed = progress.filter(
      (p) => p.completedDays.length >= challenge.totalDays
    ).length;

    const active = progress.filter(
      (p) => p.completedDays.length < challenge.totalDays
    ).length;

    const completionRate =
      participants === 0
        ? 0
        : Math.round((completed / participants) * 100);

    const reviews = await ChallengeReview.find({
      challenge: challengeId,
    });

    const reviewCount = reviews.length;

    const avgRating =
      reviewCount === 0
        ? 0
        : (
            reviews.reduce((sum, r) => sum + r.rating, 0) /
            reviewCount
          ).toFixed(1);

    res.json({
      participants,
      completed,
      active,
      completionRate,
      avgRating,
      reviewCount,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to load overview",
    });

  }

};