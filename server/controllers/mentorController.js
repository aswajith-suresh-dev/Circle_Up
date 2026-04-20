import MentorApplication from "../models/MentorApplication.js";
import  {checkMentorEligibility}  from "../utils/roleEligibility.js";
import { createNotification } from "../utils/createNotification.js";
import Challenge from "../models/Challenge.js";
import User from "../models/User.js";
import Circle from "../models/Circle.js";

export const applyForMentor = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bio, expertise, portfolioLink } = req.body;

    if (!bio || !expertise) {
      return res.status(400).json({
        message: "Bio and expertise are required",
      });
    }

    const eligible = await checkMentorEligibility(userId);

    if (!eligible) {
      return res.status(400).json({
        message: "You do not meet mentor eligibility criteria yet.",
      });
    }

    const existingApplication =
      await MentorApplication.findOne({
        user: userId,
        status: "pending",
      });

    if (existingApplication) {
      return res.status(400).json({
        message: "You already have a pending application.",
      });
    }

    const application =
      await MentorApplication.create({
        user: userId,
        bio,
        expertise,
        portfolioLink,
      });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getPendingApplications = async (req, res) => {
  try {
    const applications = await MentorApplication.find({
      status: "pending",
    }).populate("user", "name email role");

    res.status(200).json(applications);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const approveApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await MentorApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status !== "pending") {
      return res.status(400).json({
        message: "Application already processed",
      });
    }

    // 🔥 Promote user
    await User.findByIdAndUpdate(application.user, {
      role: "mentor",
    });

    application.status = "approved";
    await application.save();

    // 🔔 Create notification
    await createNotification({
      user: application.user,
      type: "mentorApproved",
      message: "🎉 Your mentor application was approved! You are now a mentor.",
      link: "/profile",
    });

    res.status(200).json({
      message: "Application approved. User promoted to mentor.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await MentorApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "rejected";
    await application.save();

    res.status(200).json({
      message: "Application rejected",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const checkEligibility = async (req, res) => {
  try {
    const eligible = await checkMentorEligibility(
      req.user._id
    );

    res.status(200).json({ eligible });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};
export const getAllMentors = async (req, res) => {
  try {
    const mentors = await MentorApplication.find({
      status: "approved",
    })
      .populate({
        path: "user",
        select:
          "name solvedRepliesCount replyUpvotesCount contributorCircles createdAt",
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(mentors);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to load mentors",
    });
  }
};
export const getMentorChallenges = async (req, res) => {
  try {

    const challenges = await Challenge.find({
      mentor: req.user._id
    })
    .populate("circle", "name")
    .sort({ createdAt: -1 });

    const result = [];

    for (const challenge of challenges) {

      const payments = await Payment.find({
        challenge: challenge._id
      });

      const revenue = payments.reduce(
        (sum, p) => sum + p.mentorShare,
        0
      );

      result.push({
        ...challenge.toObject(),
        revenue
      });

    }

    res.status(200).json(result);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to load mentor challenges",
    });

  }
};
export const getChallengeParticipants = async (req, res) => {
  try {

    const { challengeId } = req.params;

    const participants = await UserChallengeProgress
      .find({ challenge: challengeId })
      .populate("user", "name email");

    res.status(200).json(participants);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to load participants",
    });
  }
};
import Payment from "../models/Payment.js";

export const getMentorRevenue = async (req,res) => {

  try{

    const mentorId = req.user._id;

    const payments = await Payment.find({
      mentor: mentorId
    });

    const revenue = payments.reduce(
      (sum,p) => sum + p.mentorShare,
      0
    );

    res.json({
      revenue,
      totalSales: payments.length
    });

  } catch(err){

    res.status(500).json({
      message:"Failed to load revenue"
    });

  }

};
export const deleteChallenge = async (req, res) => {
  try {

    const { challengeId } = req.params;

    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        message: "Challenge not found"
      });
    }

    // ensure mentor owns the challenge
    if (challenge.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    await Challenge.findByIdAndDelete(challengeId);

    res.status(200).json({
      message: "Challenge deleted"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Delete failed"
    });

  }
};
export const getMentorCircles = async (req, res) => {
  try {

    console.log("User from token:", req.user);

    const mentorId = req.user._id;

    const circles = await Circle.find({
      mentor: mentorId
    }).sort({ createdAt: -1 });

    res.status(200).json(circles);

  } catch (error) {

    console.error("Mentor circles error:", error);

    res.status(500).json({
      message: "Failed to load mentor circles"
    });

  }
};
export const getApplicationStatus = async (req,res) => {

try{

const application = await MentorApplication.findOne({
user:req.user._id
});

if(!application){

return res.status(200).json({
status:"none"
});

}

res.status(200).json({
status:application.status
});

}catch(err){

console.error(err);

res.status(500).json({
message:"Failed to load status"
});

}

};
export const getCircleMembers = async (req, res) => {
  try {
    const { circleId } = req.params;

    const circle = await Circle.findById(circleId)
      .populate("members", "name email photo role");

    if (!circle) {
      return res.status(404).json({
        message: "Circle not found",
      });
    }

    // 🔒 Ensure only mentor can access
    if (circle.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    res.status(200).json(circle.members);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to load members",
    });
  }
};
export const removeUserFromCircle = async (req, res) => {
  try {
    const { circleId, userId } = req.params;

    const circle = await Circle.findById(circleId);

    if (!circle) {
      return res.status(404).json({
        message: "Circle not found",
      });
    }

    // 🔒 Only mentor can remove
    if (circle.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // ❌ Remove user
    circle.members = circle.members.filter(
      (member) => member.toString() !== userId
    );

    await circle.save();

    res.status(200).json({
      message: "User removed from circle",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to remove user",
    });
  }
};