import User from "../../models/User.js";
import FanSubmission from "../../models/FanSubmission.js";




export const getContributors = async (req, res) => {
  try {
    const contributors = await User.find({ role: { $in: ["user", "admin"] } })
      .select("name avatar bio role favoriteCategories contributorSince createdAt")
      .populate("favoriteCategories", "name")
      .sort({ createdAt: -1 });

    const counts = await FanSubmission.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: "$user", approvedCount: { $sum: 1 }, totalViews: { $sum: "$views" } } },
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c]));

    const result = contributors.map((c) => {
      const stats = countMap.get(String(c._id));
      return {
        _id: c._id,
        name: c.name,
        avatar: c.avatar,
        bio: c.bio,
        role: c.role,
        favoriteCategories: c.favoriteCategories,
        contributorSince: c.contributorSince || c.createdAt,
        approvedCount: stats?.approvedCount || 0,
        totalViews: stats?.totalViews || 0,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch contributors", error: err.message });
  }
};



export const getContributorProfile = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: { $in: ["user", "admin"] } })
      .select("name avatar bio role favoriteCategories contributorSince createdAt")
      .populate("favoriteCategories", "name");
    if (!user) return res.status(404).json({ message: "Contributor not found" });

    const submissions = await FanSubmission.find({ user: user._id, status: "approved" }).sort({ createdAt: -1 });

    res.status(200).json({ user, submissions });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch contributor profile", error: err.message });
  }
};
