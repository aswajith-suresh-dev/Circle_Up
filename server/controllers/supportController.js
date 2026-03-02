import Complaint from "../models/Complaint.js";
import Feedback from "../models/Feedback.js";

export const submitComplaint = async (req, res) => {
    
  try {
    if (req.user.role?.toLowerCase() === "admin") {
  return res.status(403).json({
    message: "Admins cannot submit complaints",
  });
}
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    // 🚫 Block admin
    if (req.user.role === "admin") {
      return res.status(403).json({
        message: "Admins cannot submit complaints",
      });
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      message,
    });

    res.status(201).json({
      message: "Complaint submitted",
      complaint,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const replyToComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { reply } = req.body;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    complaint.adminReply = reply;
    complaint.status = "replied";

    await complaint.save();

    // 🔥 Return updated complaint
    res.status(200).json(complaint);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(complaints);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};


// 🔹 Create Feedback (User)
export const createFeedback = async (req, res) => {
  try {
    const { message, rating } = req.body;

    if (!message || !rating) {
      return res.status(400).json({
        message: "Message and rating are required",
      });
    }

    // 🔥 Find existing feedback of this user
    const existingFeedback = await Feedback.findOne({
      user: req.user._id,
    });

    if (existingFeedback) {
      // Update existing feedback
      existingFeedback.message = message;
      existingFeedback.rating = rating;
      await existingFeedback.save();

      return res.status(200).json({
        message: "Feedback updated successfully",
        feedback: existingFeedback,
      });
    }

    // If no feedback exists → create new one
    const newFeedback = await Feedback.create({
      user: req.user._id,
      message,
      rating,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: newFeedback,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// 🔹 Get All Feedback (Admin)
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(feedbacks);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({
      user: req.user._id,
    });

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const updateComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { message } = req.body;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // 🔐 Only owner can edit
    if (complaint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 🚫 Cannot edit after reply
    if (complaint.status === "replied") {
      return res.status(400).json({
        message: "Cannot edit after admin reply",
      });
    }

    complaint.message = message;
    await complaint.save();

    res.status(200).json({
      message: "Complaint updated successfully",
      complaint,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // 🔐 Only owner can delete
    if (complaint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 🚫 Cannot delete after reply
    if (complaint.status === "replied") {
      return res.status(400).json({
        message: "Cannot delete after admin reply",
      });
    }

    await complaint.deleteOne();

    res.status(200).json({
      message: "Complaint deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};