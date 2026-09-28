import Activity from "../../models/Activity.js";


export const getRecentActivity = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 15, 50);
    const activities = await Activity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activity", error: err.message });
  }
};
