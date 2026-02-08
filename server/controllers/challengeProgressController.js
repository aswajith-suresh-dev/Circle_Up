import Challenge from "../models/Challenge.js";
import UserChallengeProgress from "../models/UserChallengeProgress.js";

export const joinChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user._id;

    // 1. Check challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    // 2. Check if user already joined
    const existingProgress = await UserChallengeProgress.findOne({
      user: userId,
      challenge: challengeId,
    });

    if (existingProgress) {
      return res.status(400).json({
        message: "You already joined this challenge",
      });
    }

    // 3. Create progress record
    const progress = await UserChallengeProgress.create({
      user: userId,
      challenge: challengeId,
      currentDay: 1,
      completedDays: [],
      streak: 0,
      isBroken: false,
      startedAt: new Date(),
    });

    res.status(201).json({
      message: "Challenge joined successfully",
      progress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to join challenge" });
  }
};
export const getMyChallenges = async (req, res) => {
  try {
    const progress = await UserChallengeProgress.find({
      user: req.user._id,
    })
      .populate("challenge", "title description totalDays type")
      .sort({ createdAt: -1 });

    res.status(200).json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user challenges" });
  }
};


export const checkInToday = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user._id;

    const progress = await UserChallengeProgress.findOne({
      user: userId,
      challenge: challengeId,
    });

    if (!progress) {
      return res.status(404).json({ message: "Challenge not joined" });
    }
    const today = new Date();
today.setHours(0, 0, 0, 0);

const lastCheck = progress.lastCheckInAt
  ? new Date(progress.lastCheckInAt)
  : null;

if (lastCheck) {
  lastCheck.setHours(0, 0, 0, 0);

  if (today.getTime() === lastCheck.getTime()) {
    return res.status(400).json({
      message: "You have already checked in today",
    });
  }
}

    const now = new Date();

    // 🚫 Already checked in today
    if (progress.lastCheckInAt) {
      const last = new Date(progress.lastCheckInAt);
      const diffDays = Math.floor(
        (now - last) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) {
        return res
          .status(400)
          .json({ message: "Already checked in today" });
      }

      // ❌ Missed one or more days → streak broken
      if (diffDays > 1) {
        progress.streak = 0;
        progress.isBroken = true;
      }
    }

    const todayDay = progress.currentDay;

    // ✅ Mark today completed
    progress.completedDays.push(todayDay);
    progress.currentDay += 1;
    progress.streak += 1;
    progress.lastCheckInAt = now;

    await progress.save();

    res.status(200).json({
      message: `Day ${todayDay} completed`,
      streak: progress.streak,
      isBroken: progress.isBroken,
      currentDay: progress.currentDay,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Check-in failed" });
  }
};