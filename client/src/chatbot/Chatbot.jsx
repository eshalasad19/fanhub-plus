import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import ChatWindow from "./ChatWindow.jsx";
import "./chatbot.css";

const Chatbot = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="chatbot-root">
      <AnimatePresence>{open && <ChatWindow onClose={() => setOpen(false)} />}</AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((o) => !o)}
        className="chatbot-fab"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X size={22} strokeWidth={2.2} /> : <MessageCircle size={22} strokeWidth={2.2} />}
      </motion.button>
    </div>
  );
};

export default Chatbot;