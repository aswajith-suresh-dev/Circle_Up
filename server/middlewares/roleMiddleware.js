export const mentorOnly = (req, res, next) => {
  if (!["mentor", "admin"].includes(req.user.role)) {
    return res.status(403).json({
      message: "Mentor access only",
    });
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }
  next();
};