import Event        from "../../models/Event.js";
import Feedback     from "../../models/Feedback.js";
import ChatMessage  from "../../models/ChatMessage.js";
import FanSubmission from "../../models/FanSubmission.js";
import ChatbotFaq   from "../../models/ChatbotFaq.js";
import User         from "../../models/User.js";
import Content      from "../../models/Content.js";
import Character    from "../../models/Character.js";
import Article      from "../../models/Article.js";
import Media        from "../../models/Media.js";
import Merchandise  from "../../models/Merchandise.js";
import Category     from "../../models/Category.js";


export const getSummary = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      blockedUsers,
      totalCategories,
      totalContent,
      publishedContent,
      totalCharacters,
      totalArticles,
      publishedArticles,
      totalMultimedia,
      totalMerchandise,
      totalEvents,
      upcomingEvents,
      totalFeedback,
      openFeedback,
      resolvedFeedback,
      totalChatMessages,
      totalSubmissions,
      pendingSubmissions,
      approvedSubmissions,
      totalFaqs,
      feedbackByType,
      feedbackByStatus,
      chatSourceBreakdown,
      contentByCategory,
      recentFeedback,
      recentSubmissions,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBlocked: { $ne: true } }),
      User.countDocuments({ isBlocked: true }),
      Category.countDocuments(),
      Content.countDocuments(),
      Content.countDocuments({ isPublished: true }),
      Character.countDocuments(),
      Article.countDocuments(),
      Article.countDocuments({ isPublished: true }),
      Media.countDocuments(),
      Merchandise.countDocuments(),
      Event.countDocuments(),
      Event.countDocuments({ date: { $gte: new Date() } }),
      Feedback.countDocuments(),
      Feedback.countDocuments({ status: "open" }),
      Feedback.countDocuments({ status: "resolved" }),
      ChatMessage.countDocuments(),
      FanSubmission.countDocuments(),
      FanSubmission.countDocuments({ status: "pending" }),
      FanSubmission.countDocuments({ status: "approved" }),
      ChatbotFaq.countDocuments({ isActive: true }),
      Feedback.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
      Feedback.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      ChatMessage.aggregate([{ $group: { _id: "$source", count: { $sum: 1 } } }]),
      
      Content.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        {
          $addFields: {
            categoryId: {
              $cond: {
                if: { $regexMatch: { input: { $toString: "$_id" }, regex: /^[a-f\d]{24}$/i } },
                then: { $toObjectId: "$_id" },
                else: null,
              },
            },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "categoryDoc",
          },
        },
        {
          $addFields: {
            categoryName: {
              $cond: {
                if: { $gt: [{ $size: "$categoryDoc" }, 0] },
                then: { $arrayElemAt: ["$categoryDoc.name", 0] },
                else: "$_id",
              },
            },
          },
        },
        { $project: { _id: 0, name: "$categoryName", count: 1 } },
        { $sort: { count: -1 } },
      ]),
      Feedback.find().sort({ createdAt: -1 }).limit(5).populate("user", "name"),
      FanSubmission.find().sort({ createdAt: -1 }).limit(5).populate("user", "name"),
    ]);

    res.status(200).json({
      users:       { total: totalUsers, active: activeUsers, blocked: blockedUsers },
      categories:  { total: totalCategories },
      content:     { total: totalContent, published: publishedContent },
      characters:  { total: totalCharacters },
      articles:    { total: totalArticles, published: publishedArticles },
      multimedia:  { total: totalMultimedia },
      merchandise: { total: totalMerchandise },
      events:      { total: totalEvents, upcoming: upcomingEvents },
      feedback:    { total: totalFeedback, open: openFeedback, resolved: resolvedFeedback, byType: feedbackByType, byStatus: feedbackByStatus },
      chatbot:     { totalMessages: totalChatMessages, activeFaqs: totalFaqs, sourceBreakdown: chatSourceBreakdown },
      submissions: { total: totalSubmissions, pending: pendingSubmissions, approved: approvedSubmissions },
      charts:      { contentByCategory },
      recent:      { feedback: recentFeedback, submissions: recentSubmissions },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch analytics", error: err.message });
  }
};


export const getEventsByCategory = async (req, res) => {
  try {
    const data = await Event.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch event analytics", error: err.message });
  }
};
