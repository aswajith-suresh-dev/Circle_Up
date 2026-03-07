import User from "../models/User.js";

export const checkMentorEligibility = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) return false;
    console.log("ROLE:", user.role);
    console.log("Solved Replies:", user.solvedRepliesCount);
    console.log("Reply Upvotes:", user.replyUpvotesCount);
    console.log("Contributor Circles:", user.contributorCircles.length);
    if (user.role !== "contributor") return false;

    const meetsQualityDepth =
      user.solvedRepliesCount >= 1;

    const meetsCommunityValidation =
      user.replyUpvotesCount >= 1;

    const meetsCircleDiversity =
      user.contributorCircles.length >= 1;

    return (
      meetsQualityDepth &&
      meetsCommunityValidation &&
      meetsCircleDiversity
    );

  } catch (error) {
    console.error("Mentor eligibility check error:", error);
    return false;
  }
};