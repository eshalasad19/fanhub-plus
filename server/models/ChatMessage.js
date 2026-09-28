import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sessionId: { type: String, required: true },
    message: { type: String, required: true, trim: true },
    response: { type: String, required: true },
    source: {
      type: String,
      enum: ["faq", "fallback", "event_search", "intent", "ai"],
      default: "fallback",
    },
    matchedFaq: { type: mongoose.Schema.Types.ObjectId, ref: "ChatbotFaq" },
  },
  { timestamps: true }
);

chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

export default mongoose.model("ChatMessage", chatMessageSchema);