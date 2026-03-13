import Challenge from "../models/Challenge.js";
import Circle from "../models/Circle.js";
import Payment from "../models/Payment.js";

export const getMentorDashboard = async (req, res) => {

  try {

    const mentorId = req.user._id;

    // circles
    const circles = await Circle.find({
      mentor: mentorId
    }).sort({ createdAt: -1 });

    // challenges
    const challenges = await Challenge.find({
      mentor: mentorId
    }).sort({ createdAt: -1 });

    // payments
    const payments = await Payment.find({
      mentor: mentorId
    });

    const revenue = payments.reduce(
      (sum, p) => sum + p.mentorShare,
      0
    );

    const totalSales = payments.length;

    // THIS MONTH REVENUE
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);

    const monthRevenue = payments
      .filter(p => new Date(p.createdAt) >= startOfMonth)
      .reduce((sum,p)=>sum+p.mentorShare,0);

    // AVERAGE SALE
    const avgSale =
      totalSales === 0
        ? 0
        : Math.round(revenue / totalSales);

    res.json({
      circles,
      challenges,
      revenue,
      totalSales,
      monthRevenue,
      avgSale
    });

  } catch(err){

    console.error(err);

    res.status(500).json({
      message: "Dashboard load failed"
    });

  }

};