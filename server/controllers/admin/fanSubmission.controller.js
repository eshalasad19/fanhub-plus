import FanSubmission from "../../models/FanSubmission.js";


export const getSubmissions = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    const submissions = await FanSubmission.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch submissions", error: err.message });
  }
};


export const getSubmissionById = async (req, res) => {
  try {
    const submission = await FanSubmission.findById(req.params.id).populate("user", "name email");
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.status(200).json(submission);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch submission", error: err.message });
  }
};


export const createSubmission = async (req, res) => {
  try {
    const submission = await FanSubmission.create({ ...req.body, user: req.user?.id || req.body.user });
    res.status(201).json(submission);
  } catch (err) {
    res.status(400).json({ message: "Failed to create submission", error: err.message });
  }
};


export const updateSubmissionStatus = async (req, res) => {
  try {
    const { status, reviewedBy } = req.body;
    const submission = await FanSubmission.findByIdAndUpdate(
      req.params.id,
      { status, reviewedBy },
      { new: true, runValidators: true }
    );
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.status(200).json(submission);
  } catch (err) {
    res.status(400).json({ message: "Failed to update submission", error: err.message });
  }
};


export const deleteSubmission = async (req, res) => {
  try {
    const submission = await FanSubmission.findByIdAndDelete(req.params.id);
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.status(200).json({ message: "Submission deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete submission", error: err.message });
  }
};
