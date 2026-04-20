import User from "../models/User.js";
import { createNotification } from "./createNotification.js";
export const checkAndPromoteContributor = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) return;
    if (user.role === "contributor") return;

    const hasQualitySignal =
  user.solvedRepliesCount >= 3 &&
  user.replyUpvotesCount >= 5;

const hasCircleDiversity = user.contributorCircles.length >= 1;

if (hasQualitySignal && hasCircleDiversity) {
  user.role = "contributor";
  await user.save();
await createNotification({
    user: user._id,
    type: "rolePromotion",
    message: "🎉 Congratulations! You are now a Contributor.",
    link: "/profile",
  });
  console.log(`🎉 User ${user.email} promoted to CONTRIBUTOR`);
}
  } catch (error) {
    console.error("Contributor promotion error:", error);
  }
};