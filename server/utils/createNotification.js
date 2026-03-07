import Notification from "../models/Notification.js";

export const createNotification = async ({
  user,
  type,
  message,
  link,
}) => {
  try {
    await Notification.create({
      user,
      type,
      message,
      link,
    });
  } catch (error) {
    console.error("Notification error:", error);
  }
};