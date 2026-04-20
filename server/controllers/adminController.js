import User from "../models/User.js";
import Challenge from "../models/Challenge.js";
import UserChallengeProgress from "../models/UserChallengeProgress.js";
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
        message: "User must be a contributor before becoming mentor",
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
      approvalStatus: "pending",
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

    await Challenge.findByIdAndUpdate(challengeId, {
      approvalStatus: "approved",
    });

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

    await Challenge.findByIdAndUpdate(challengeId, {
      approvalStatus: "rejected",
    });

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
export const getAdminRevenue = async (req, res) => {
  try {
    const payments = await Payment.find();

    const revenue = payments.reduce((sum, p) => sum + p.adminShare, 0);

    res.json({
      revenue,
      totalTransactions: payments.length,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to load revenue",
    });
  }
};
import Circle from "../models/Circle.js";
import Payment from "../models/Payment.js";
export const getAdminDashboardStats = async (req, res) => {
  try {
    const payments = await Payment.find();

    let totalRevenue = 0;
    let monthRevenue = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    payments.forEach((payment) => {
      const adminShare = payment.amount * 0.2;

      totalRevenue += adminShare;

      const paymentDate = new Date(payment.createdAt);

      if (
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear
      ) {
        monthRevenue += adminShare;
      }
    });

    const totalSales = payments.length;

    const avgSale = totalSales > 0 ? totalRevenue / totalSales : 0;

    res.json({
      totalRevenue: Math.round(totalRevenue),
      monthRevenue: Math.round(monthRevenue),
      totalSales,
      avgSale: Math.round(avgSale),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to load dashboard stats",
    });
  }
};
export const getTopDashboardData = async (req, res) => {
  try {
    /* TOP CIRCLES */

    const topCircles = await Circle.find()
      .sort({ membersCount: -1 })
      .limit(3)
      .select("name topic membersCount")
      .lean();

    /* TOP CHALLENGES */

    const topChallenges = await Challenge.find()
      .sort({ participantsCount: -1 })
      .limit(3)
      .select("title level participantsCount")
      .lean();

    /* TOP USERS */

    const topUsers = await User.find({
      role: { $in: ["user", "contributor"] },
    })
      .sort({ replyUpvotesCount: -1 })
      .limit(3)
      .select("name replyUpvotesCount solvedRepliesCount")
      .lean();

    /* TOP MENTORS */

    const topMentors = await User.find({ role: "mentor" })
      .sort({ solvedRepliesCount: -1 })
      .limit(3)
      .select("name solvedRepliesCount replyUpvotesCount")
      .lean();

    res.json({
      topCircles,
      topChallenges,
      topUsers,
      topMentors,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to load top dashboard data",
    });
  }
};
export const getAdminRevenueList = async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate("mentor", "name")
      .select("title price type"); // 🔥 IMPORTANT (add type)

    const paid = [];
    const free = [];

    for (const challenge of challenges) {

  let buyers = 0;
  let totalRevenue = 0;

  if (challenge.type === "paid") {

    const payments = await Payment.find({
      challenge: challenge._id
    });

    buyers = payments.length;

    totalRevenue = payments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

  } else {

    // FREE CHALLENGE

    const progress = await UserChallengeProgress.find({
      challenge: challenge._id
    });

    buyers = progress.length;
    totalRevenue = 0; // 👈 important

  }

  const data = {
    mentor: challenge.mentor?.name,
    challenge: challenge.title,
    price: challenge.price || 0,
    buyers,
    totalRevenue
  };

  if (challenge.type === "paid") {
    paid.push(data);
  } else {
    free.push(data);
  }
}

    paid.sort((a, b) => b.totalRevenue - a.totalRevenue);
    free.sort((a, b) => b.buyers - a.buyers);

    res.json({
      paid,
      free,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to load revenue list",
    });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await User.findByIdAndDelete(userId);

    res.json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to delete user",
    });
  }
};
export const getAllCircles = async (req, res) => {
  try {
    const circles = await Circle.find()
      .populate("mentor", "name")
      .select("name topic mentor members createdAt");

    const result = circles.map((circle) => ({
      _id: circle._id,

      name: circle.name,

      topic: circle.topic,

      mentor: circle.mentor,

      membersCount: circle.members?.length || 0,

      createdAt: circle.createdAt,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch circles",
    });
  }
};
export const deleteCircle = async (req, res) => {
  try {
    const { circleId } = req.params;

    await Circle.findByIdAndDelete(circleId);

    res.json({
      message: "Circle deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to delete circle",
    });
  }
};

export const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate("mentor", "name")
      .populate("circle", "name")
      .select("title price participantsCount createdAt mentor circle");

    const result = challenges.map((challenge) => ({
      _id: challenge._id,

      title: challenge.title,

      mentor: challenge.mentor,

      circle: challenge.circle,

      price: challenge.price,

      participantsCount: challenge.participantsCount || 0,
      createdAt: challenge.createdAt,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch challenges",
    });
  }
};

export const deleteChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;

    await Challenge.findByIdAndDelete(challengeId);

    res.json({
      message: "Challenge deleted",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to delete challenge",
    });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "name email role createdAt replyUpvotesCount solvedRepliesCount",
    );

    res.json(users);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};
