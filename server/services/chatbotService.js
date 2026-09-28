import { detectIntent } from "./chatbot/intentDetector.js";
import { searchUpcomingEvents, formatEventResults } from "./chatbot/eventSearch.js";
import { findFaqMatch } from "./chatbot/faqSearch.js";
import { getAiReply } from "./chatbot/aiService.js";
import ChatMessage from "../models/ChatMessage.js";
import {
  GREETING_REPLY,
  HELP_REPLY,
  FALLBACK_REPLY,
} from "./chatbot/responseBuilder.js";

const getConversationHistory = async (sessionId) => {
  if (!sessionId) return [];
  try {
    const history = await ChatMessage.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    return history.reverse().flatMap((h) => [
      { role: "user", content: h.message },
      { role: "bot", content: h.response },
    ]);
  } catch {
    return [];
  }
};

export const generateReply = async (message, sessionId = null) => {
  const intent = detectIntent(message);
  console.log(`[chatbot] intent="${intent.type}" category="${intent.category}" message="${message}"`);

  if (intent.type === "greeting") {
    return { reply: GREETING_REPLY, source: "intent", matchedFaq: null };
  }

  if (intent.type === "help") {
    return { reply: HELP_REPLY, source: "intent", matchedFaq: null };
  }

  const faqMatch = await findFaqMatch(message);
  if (faqMatch) {
    console.log(`[chatbot] FAQ matched: "${faqMatch.question}"`);
    return { reply: faqMatch.answer, source: "faq", matchedFaq: faqMatch._id };
  }

  if (intent.type === "event_search") {
    const events = await searchUpcomingEvents(intent.category);
    return { reply: formatEventResults(events, intent.category), source: "event_search", matchedFaq: null };
  }

  console.log("[chatbot] No FAQ match, sending to Groq AI with history...");
  const history = await getConversationHistory(sessionId);
  const aiReply = await getAiReply(message, history);
  if (aiReply) {
    return { reply: aiReply, source: "ai", matchedFaq: null };
  }

  console.warn("[chatbot] Groq returned null, using fallback reply");
  return { reply: FALLBACK_REPLY, source: "fallback", matchedFaq: null };
};
