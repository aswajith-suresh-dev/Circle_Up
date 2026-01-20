import User from "../models/User.js";

export const checkAndPromoteContributor = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) return;
    if (user.role === "contributor") return;

    const hasQualitySignal =
  user.solvedRepliesCount >= 5 ||
  user.replyUpvotesCount >= 10;

const hasCircleDiversity = user.contributorCircles.length >= 2;

if (hasQualitySignal && hasCircleDiversity) {
  user.role = "contributor";
  await user.save();

  console.log(`🎉 User ${user.email} promoted to CONTRIBUTOR`);
}
  } catch (error) {
    console.error("Contributor promotion error:", error);
  }
};