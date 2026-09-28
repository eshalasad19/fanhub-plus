import ChatMessage from "../../models/ChatMessage.js";
import { generateReply } from "../../services/chatbotService.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ message: "message and sessionId are required" });
    }

    const { reply, source, matchedFaq } = await generateReply(message, sessionId);

    await ChatMessage.create({
      sessionId,
      message,
      response: reply,
      source,
      matchedFaq: matchedFaq || undefined,
    });

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err.message);
    res.status(500).json({ message: "Chatbot error", error: err.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ message: "sessionId is required" });

    const history = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 }).limit(100);
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history", error: err.message });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ message: "sessionId is required" });

    await ChatMessage.deleteMany({ sessionId });
    res.status(200).json({ message: "History cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear history", error: err.message });
  }
};
