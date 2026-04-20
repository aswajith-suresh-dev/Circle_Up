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
    await Challenge.findByIdAndUpdate(challengeId, {
      $inc: { participantsCount: 1 },
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

    // 🔍 Find progress
    const progress = await UserChallengeProgress.findOne({
      user: userId,
      challenge: challengeId,
    });

    if (!progress) {
      return res.status(404).json({ message: "Challenge not joined" });
    }

    // 🔍 Find challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    // 📅 Normalize today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /* ================= STREAK LOGIC ================= */

    if (progress.lastCheckInAt) {
      const last = new Date(progress.lastCheckInAt);
      last.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));

      // ❌ Prevent invalid future date issues
      if (diffDays < 0) {
        progress.lastCheckInAt = today;
      }

      // ❌ Already checked today
      if (diffDays === 0) {
        return res.status(400).json({
          message: "You have already checked in today",
        });
      }

      // 🔥 Continue streak
      if (diffDays === 1) {
        progress.streak += 1;
        progress.isBroken = false;

        // 💔 Break streak
      } else if (diffDays > 1) {
        progress.streak = 1;
        progress.isBroken = true;
      }
    } else {
      // 🆕 First check-in
      progress.streak = 1;
      progress.isBroken = false;
    }

    /* ================= DAY PROGRESSION ================= */

    const todayDay = progress.currentDay;

    // 🚫 Prevent overflow
    if (todayDay > challenge.totalDays) {
      return res.status(400).json({
        message: "Challenge already completed",
      });
    }

    // ✅ Avoid duplicate days
    if (!progress.completedDays.includes(todayDay)) {
      progress.completedDays.push(todayDay);
    }

    // ✅ Move to next day safely
    progress.currentDay = Math.min(
      progress.currentDay + 1,
      challenge.totalDays,
    );

    /* ================= SAVE ================= */

    progress.lastCheckInAt = today;

    await progress.save();

    /* ================= RESPONSE ================= */

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

    const isCompleted = progress.completedDays.length >= challenge.totalDays;

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
import Challenge from "../models/Challenge.js";
import Payment from "../models/Payment.js";

export const purchaseChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user._id;

    const challenge = await Challenge.findById(challengeId);
    if (challenge.approvalStatus !== "approved") {
      return res.status(403).json({
        message: "Challenge not approved yet",
      });
    }
    if (!challenge) {
      return res.status(404).json({
        message: "Challenge not found",
      });
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

    /* ---------- Revenue Split ---------- */

    const adminPercent = 0.2; // 20%

    const adminShare = challenge.price * adminPercent;
    const mentorShare = challenge.price - adminShare;

    /* ---------- Save Payment ---------- */

    await Payment.create({
      user: userId,
      challenge: challengeId,
      mentor: challenge.mentor,
      amount: challenge.price,
      adminShare,
      mentorShare,
    });

    /* ---------- Unlock Challenge ---------- */

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

    /* ---------- Increase Participants ---------- */

    await Challenge.findByIdAndUpdate(challengeId, {
      $inc: { participantsCount: 1 },
    });

    res.status(200).json({
      message: "Payment successful. Challenge unlocked.",
      progress,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Purchase failed",
    });
  }
};
export const getMentorChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({
      mentor: req.user._id,
    })
      .populate("circle", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(challenges);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch mentor challenges",
    });
  }
};
