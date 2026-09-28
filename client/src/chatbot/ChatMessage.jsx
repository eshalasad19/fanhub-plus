import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

const FormattedText = ({ text }) => {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <br key={i} />;
        
        if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
          return (
            <div key={i} style={{ display: "flex", gap: 6, marginTop: 3 }}>
              <span style={{ color: "#a855f7", flexShrink: 0 }}>•</span>
              <span>{trimmed.replace(/^[•\-*]\s*/, "")}</span>
            </div>
          );
        }
        return <div key={i} style={{ marginTop: i > 0 ? 4 : 0 }}>{trimmed}</div>;
      })}
    </>
  );
};

const ChatMessage = ({ role, text, time, source }) => {
  const isBot = role === "bot";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-end",
        justifyContent: isBot ? "flex-start" : "flex-end",
      }}
    >
      {isBot && (
        <div className="chatbot-avatar">
          <Bot size={14} strokeWidth={2.2} />
        </div>
      )}
      <div className={isBot ? "chatbot-bubble chatbot-bubble-bot" : "chatbot-bubble chatbot-bubble-user"}>
        <FormattedText text={text} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 5 }}>
          <span className="chatbot-time">{time}</span>
          {isBot && source && source !== "fallback" && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                opacity: 0.5,
                color: source === "faq" ? "#10b981" : source === "ai" ? "#8b5cf6" : source === "event_search" ? "#f59e0b" : "inherit",
              }}
            >
              {source === "faq" ? "FAQ" : source === "ai" ? "AI" : source === "event_search" ? "Events" : source}
            </span>
          )}
        </div>
      </div>
      {!isBot && (
        <div className="chatbot-avatar chatbot-avatar-user">
          <User size={14} strokeWidth={2.2} />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
