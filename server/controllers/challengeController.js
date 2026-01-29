import Challenge from "../models/Challenge.js";

export const createChallenge = async (req, res) => {
  try {
    const { title, description, type, totalDays, days, circleId } = req.body;

    // basic validation
    if (!title || !description || !totalDays || !days || !circleId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (days.length !== totalDays) {
      return res.status(400).json({
        message: "Days count must match totalDays",
      });
    }

    // validate day numbers
    for (let i = 0; i < days.length; i++) {
      if (days[i].dayNumber !== i + 1) {
        return res.status(400).json({
          message: "Day numbers must be sequential starting from 1",
        });
      }
    }

    const challenge = await Challenge.create({
      title,
      description,
      type,
      totalDays,
      days,
      circle: circleId,
      mentor: req.user._id,
    });

    res.status(201).json({
      message: "Challenge created successfully",
      challenge,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create challenge" });
  }
};