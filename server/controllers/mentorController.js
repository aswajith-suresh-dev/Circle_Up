import MentorApplication from "../models/MentorApplication.js";
import  {checkMentorEligibility}  from "../utils/roleEligibility.js";
import User from "../models/User.js";

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