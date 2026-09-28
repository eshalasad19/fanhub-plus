import Feedback from "../../models/Feedback.js";

export const getFeedbackList = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    const feedback = await Feedback.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedback", error: error.message });
  }
};

export const checkUserFeedbackStatus = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(200).json({ hasSubmitted: false });
    }
    const count = await Feedback.countDocuments({ user: userId });
    res.status(200).json({ hasSubmitted: count > 0, count });
  } catch (error) {
    res.status(500).json({ message: "Failed to check feedback status", error: error.message });
  }
};

export const createFeedback = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.body.user;
    const feedbackData = {
      ...req.body,
      ...(userId ? { user: userId } : {}),
    };
    const feedback = await Feedback.create(feedbackData);
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: "Failed to submit feedback", error: error.message });
  }
};

export const updateFeedbackStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status, adminResponse },
      { new: true, runValidators: true }
    );
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(400).json({ message: "Failed to update feedback", error: error.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.status(200).json({ message: "Feedback deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete feedback", error: error.message });
  }
};