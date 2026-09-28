import FanSubmission from "../../models/FanSubmission.js";




export const getPublicFanContent = async (req, res) => {
  try {
    const { category, sort } = req.query;
    const filter = { status: "approved" };
    if (category) filter.category = category;

    const sortBy = sort === "trending" ? { views: -1, createdAt: -1 } : { createdAt: -1 };

    const items = await FanSubmission.find(filter)
      .populate("user", "name avatar")
      .sort(sortBy)
      .limit(60);

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch fan content", error: err.message });
  }
};




export const getPublicFanContentById = async (req, res) => {
  try {
    const submission = await FanSubmission.findById(req.params.id).populate("user", "name avatar bio");
    if (!submission) return res.status(404).json({ message: "Not found" });

    const isOwnerOrAdmin =
      req.user && (String(submission.user._id) === String(req.user._id) || req.user.role === "admin");

    if (submission.status !== "approved" && !isOwnerOrAdmin) {
      return res.status(404).json({ message: "Not found" });
    }

    if (submission.status === "approved" && !isOwnerOrAdmin) {
      submission.views += 1;
      await submission.save();
    }

    res.status(200).json(submission);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch fan content", error: err.message });
  }
};



export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await FanSubmission.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your submissions", error: err.message });
  }
};




export const getMyAnalytics = async (req, res) => {
  try {
    const submissions = await FanSubmission.find({ user: req.user._id }).sort({ views: -1 });

    const summary = submissions.reduce(
      (acc, s) => {
        acc.total += 1;
        acc[s.status] = (acc[s.status] || 0) + 1;
        acc.totalViews += s.views || 0;
        return acc;
      },
      { total: 0, pending: 0, approved: 0, rejected: 0, totalViews: 0 }
    );

    res.status(200).json({
      summary,
      topContent: submissions.slice(0, 10).map((s) => ({
        _id: s._id,
        title: s.title,
        category: s.category,
        status: s.status,
        views: s.views,
        createdAt: s.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load analytics", error: err.message });
  }
};
