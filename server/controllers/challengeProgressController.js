import Challenge from "../models/Challenge.js";
import UserChallengeProgress from "../models/UserChallengeProgress.js";
import Circle from "../models/Circle.js";

export const joinChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user._id;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const existingProgress = await UserChallengeProgress.findOne({
      user: userId,
      challenge: challengeId,
    });

    if (existingProgress) {
      return res.status(400).json({
        message: "You already joined this challenge",
      });
    }

    // 🚨 If challenge is paid → block join
    if (challenge.type === "paid") {
      return res.status(403).json({
        message: "This is a paid challenge. Please purchase first.",
      });
    }

    const progress = await UserChallengeProgress.create({
      user: userId,
      challenge: challengeId,
      currentDay: 1,
      completedDays: [],
      streak: 0,
      isBroken: false,
      startedAt: new Date(),
      isPaid: false,
    });
await Challenge.findByIdAndUpdate(
  challengeId,
  { $inc: { participantsCount: 1 } }
);
    res.status(201).json({
      message: "Challenge joined successfully",
      progress,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to join challenge" });
  }
};export const getMyChallenges = async (req, res) => {
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

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const today = new Date();
today.setHours(0, 0, 0, 0);

if (progress.lastCheckInAt) {
  const last = new Date(progress.lastCheckInAt);
  last.setHours(0, 0, 0, 0);

  const diffDays =
    (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays === 0) {
    return res.status(400).json({
      message: "You have already checked in today",
    });
  }

 if (diffDays > 1) {
  progress.streak = 1; // today starts new streak
  progress.isBroken = true;
} else {
  // progress.streak += 1; // continue streak
  progress.isBroken = false;
}
}

    const todayDay = progress.currentDay;

    // Prevent exceeding totalDays
    if (todayDay > challenge.totalDays) {
      return res.status(400).json({
        message: "Challenge already completed",
      });
    }

    progress.completedDays.push(todayDay);

    if (progress.currentDay < challenge.totalDays) {
      progress.currentDay += 1;
    }

    progress.streak += 1;
    progress.lastCheckInAt = new Date();

    await progress.save();

    res.status(200).json({
      message: `Day ${todayDay} completed`,
      currentDay: progress.currentDay,
      streak: progress.streak,
      isBroken: progress.isBroken,
    });

  } catch (error) {
    console.error("CHECK-IN ERROR:", error);
    res.status(500).json({ message: "Check-in failed" });
  }
};
export const getChallengeProgress = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user._id;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const progress = await UserChallengeProgress.findOne({
      user: userId,
      challenge: challengeId,
    });

    if (!progress) {
      return res.status(404).json({ message: "Not joined" });
    }

    // ---- Calculate canCheckIn ----
    let canCheckIn = true;

    if (progress.lastCheckInAt) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const last = new Date(progress.lastCheckInAt);
      last.setHours(0, 0, 0, 0);

      if (today.getTime() === last.getTime()) {
        canCheckIn = false;
      }
    }

    const isCompleted =
      progress.completedDays.length >= challenge.totalDays;

    res.status(200).json({
      challenge,
      progress,
      canCheckIn,
      isCompleted,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load progress" });
  }
};
export const purchaseChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user._id;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    if (challenge.type !== "paid") {
      return res.status(400).json({
        message: "This challenge is free",
      });
    }

    const existing = await UserChallengeProgress.findOne({
      user: userId,
      challenge: challengeId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Already purchased",
      });
    }

    // 🔥 Simulate payment success
    const progress = await UserChallengeProgress.create({
      user: userId,
      challenge: challengeId,
      isPaid: true,
      currentDay: 1,
      completedDays: [],
      streak: 0,
      isBroken: false,
      startedAt: new Date(),
    });
await Challenge.findByIdAndUpdate(
  challengeId,
  { $inc: { participantsCount: 1 } }
);
    res.status(200).json({
      message: "Payment successful. Challenge unlocked.",
      progress,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Purchase failed" });
  }
};
export const getMentorChallenges = async (req, res) => {
  try {

    const challenges = await Challenge.find({
      mentor: req.user._id
    })
    .populate("circle","name")
    .sort({createdAt:-1});

    res.status(200).json(challenges);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:"Failed to fetch mentor challenges"
    });

  }
};