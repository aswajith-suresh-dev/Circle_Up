// server/middlewares/mentorMiddleware.js
export const mentorOnly = (req, res, next) => {
  if (req.user.role !== "mentor") {
    return res.status(403).json({
      message: "Only mentors can perform this action",
    });
  }
  next();
};