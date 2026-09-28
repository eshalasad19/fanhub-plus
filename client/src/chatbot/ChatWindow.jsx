import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { X, Send, Trash2, Sparkles } from "lucide-react";
import ChatMessage from "./ChatMessage.jsx";
import SuggestedQuestions from "./SuggestedQuestions.jsx";
import { getSessionId } from "./utils/session.js";

const formatTime = (date) =>
  new Date(date).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

const ONBOARDING_STEPS = [
  "Welcome to FanHub+! I'm your AI assistant.",
  "I can help you explore Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga & Cosplay.",
  "Ask me about upcoming fan events, character info, content recommendations, or merchandise.",
  "Type anything below to get started, or pick a suggestion!",
];

const ONBOARDING_KEY = "fanhub-onboarding-done";

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [onboarding, setOnboarding] = useState(false);
  const [onboardStep, setOnboardStep] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const sessionId = getSessionId();

  useEffect(() => {
    axios
      .get("/api/chatbot/history", { params: { sessionId } })
      .then((res) => {
        if (res.data.length > 0) {
          const loaded = res.data.flatMap((entry) => [
            { role: "user", text: entry.message, time: formatTime(entry.createdAt), source: null },
            { role: "bot", text: entry.response, time: formatTime(entry.createdAt), source: entry.source },
          ]);
          setMessages(loaded);
          setShowSuggestions(false);
        } else {
          
          const done = localStorage.getItem(ONBOARDING_KEY);
          if (!done) {
            setOnboarding(true);
          } else {
            setShowSuggestions(true);
          }
        }
      })
      .catch(() => setShowSuggestions(true))
      .finally(() => setLoadingHistory(false));
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending, onboarding, onboardStep]);

  useEffect(() => {
    if (!onboarding) return;
    if (onboardStep < ONBOARDING_STEPS.length) {
      const timer = setTimeout(() => setOnboardStep((s) => s + 1), 900);
      return () => clearTimeout(timer);
    } else {
      
      setTimeout(() => {
        setOnboarding(false);
        setShowSuggestions(true);
        localStorage.setItem(ONBOARDING_KEY, "1");
      }, 400);
    }
  }, [onboarding, onboardStep]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setShowSuggestions(false);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed, time: formatTime(Date.now()), source: null },
    ]);
    setInput("");
    setSending(true);
    inputRef.current?.focus();

    try {
      const res = await axios.post("/api/chatbot/message", { message: trimmed, sessionId });
      const reply = res.data.reply;
      const source = res.data.source;
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: reply, time: formatTime(Date.now()), source },
      ]);
      
      setShowSuggestions(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Sorry, I couldn't connect right now. Please try again.",
          time: formatTime(Date.now()),
          source: "fallback",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleClear = async () => {
    await axios.delete("/api/chatbot/history", { params: { sessionId } });
    setMessages([]);
    setShowSuggestions(true);
    
    localStorage.removeItem(ONBOARDING_KEY);
  };

  const lastBotText = [...messages].reverse().find((m) => m.role === "bot")?.text || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.96 }}
      transition={{ duration: 0.22 }}
      className="chatbot-window"
    >
      <div className="chatbot-header">
        <div className="chatbot-header-title">
          <div className="chatbot-avatar chatbot-avatar-header">
            <Sparkles size={15} strokeWidth={2.2} />
          </div>
          FanHub Assistant
        </div>
        <div className="chatbot-header-actions">
          <button onClick={handleClear} aria-label="Clear conversation" className="chatbot-icon-btn" title="Clear chat">
            <Trash2 size={14} strokeWidth={2} />
          </button>
          <button onClick={onClose} aria-label="Close chat" className="chatbot-icon-btn">
            <X size={16} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <div className="chatbot-body">
        {loadingHistory ? (
          <p className="chatbot-muted">Loading conversation…</p>
        ) : onboarding ? (
          
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <AnimatePresence>
              {ONBOARDING_STEPS.slice(0, onboardStep).map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
                >
                  <div className="chatbot-avatar" style={{ marginTop: 2 }}>
                    <Sparkles size={12} strokeWidth={2.2} />
                  </div>
                  <div className="chatbot-bubble chatbot-bubble-bot">
                    <div>{step}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {onboardStep < ONBOARDING_STEPS.length && (
              <p className="chatbot-typing">FanHub Assistant is typing…</p>
            )}
          </div>
        ) : messages.length === 0 ? (
          
          <>
            <p className="chatbot-muted">
              Hi! I'm the FanHub+ Assistant. Ask me about events, recommendations, characters, merchandise, and more.
            </p>
            <SuggestedQuestions onSelect={sendMessage} lastBotText="" />
          </>
        ) : (
          
          <>
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <ChatMessage key={i} role={m.role} text={m.text} time={m.time} source={m.source} />
              ))}
            </AnimatePresence>

            {}
            {sending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: "flex", gap: 8, alignItems: "center" }}
              >
                <div className="chatbot-avatar">
                  <Sparkles size={12} strokeWidth={2.2} />
                </div>
                <p className="chatbot-typing" style={{ margin: 0 }}>FanHub Assistant is typing…</p>
              </motion.div>
            )}

            {}
            {showSuggestions && !sending && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <SuggestedQuestions onSelect={sendMessage} lastBotText={lastBotText} />
              </motion.div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {}
      <form
        className="chatbot-input-row"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something…"
          className="chatbot-input"
          disabled={onboarding}
        />
        <button
          type="submit"
          disabled={sending || !input.trim() || onboarding}
          className="chatbot-send-btn"
          aria-label="Send"
        >
          <Send size={16} strokeWidth={2.2} />
        </button>
      </form>
    </motion.div>
  );
};

export default ChatWindow;
