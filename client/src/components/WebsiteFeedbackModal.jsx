import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiStar, FiX, FiCheckCircle, FiMessageCircle } from "react-icons/fi";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const POPUP_DELAY_MS = 6000; 
const SESSION_FLAG = "fanhub-website-feedback-shown";
const GLOBAL_SUBMITTED_KEY = "fanhub_feedback_submitted";

const WebsiteFeedbackModal = () => {
  const { isAuthenticated, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    
    if (user?.role === "admin") return;

    
    const userSubmittedKey = user?._id ? `${GLOBAL_SUBMITTED_KEY}_${user._id}` : GLOBAL_SUBMITTED_KEY;
    if (
      localStorage.getItem(GLOBAL_SUBMITTED_KEY) === "true" ||
      localStorage.getItem(userSubmittedKey) === "true"
    ) {
      return;
    }

    
    if (sessionStorage.getItem(SESSION_FLAG)) return;

    let timer = null;

    
    if (isAuthenticated) {
      api
        .get("/feedback/my-status")
        .then((res) => {
          if (res.data?.hasSubmitted) {
            localStorage.setItem(GLOBAL_SUBMITTED_KEY, "true");
            if (user?._id) localStorage.setItem(userSubmittedKey, "true");
          } else {
            timer = setTimeout(() => {
              setOpen(true);
              sessionStorage.setItem(SESSION_FLAG, "1");
            }, POPUP_DELAY_MS);
          }
        })
        .catch(() => {
          timer = setTimeout(() => {
            setOpen(true);
            sessionStorage.setItem(SESSION_FLAG, "1");
          }, POPUP_DELAY_MS);
        });
    } else {
      
      timer = setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem(SESSION_FLAG, "1");
      }, POPUP_DELAY_MS);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAuthenticated, user]);

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await api.post("/feedback", {
        type: "experience",
        rating,
        message: message.trim() || "No additional comments provided.",
      });

      
      const userSubmittedKey = user?._id ? `${GLOBAL_SUBMITTED_KEY}_${user._id}` : GLOBAL_SUBMITTED_KEY;
      localStorage.setItem(GLOBAL_SUBMITTED_KEY, "true");
      localStorage.setItem(userSubmittedKey, "true");

      setSubmitted(true);
      setTimeout(() => setOpen(false), 1800);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: 20,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            className="card"
            style={{ width: "100%", maxWidth: 400, padding: 28, textAlign: "center", position: "relative" }}
          >
            <button
              onClick={handleClose}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                border: "none",
                background: "var(--border)",
                width: 28,
                height: 28,
                borderRadius: 8,
                cursor: "pointer",
                color: "var(--text)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiX size={14} strokeWidth={2.4} />
            </button>

            {submitted ? (
              <div style={{ padding: "20px 0" }}>
                <FiCheckCircle size={36} color="#22c55e" style={{ marginBottom: 12 }} />
                <h3 style={{ margin: "0 0 6px", fontSize: 18 }}>Thank you!</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 13.5, margin: 0 }}>
                  Your feedback has been received and helps us improve Fan Hub Plus.
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "var(--gradient)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    color: "#fff",
                  }}
                >
                  <FiMessageCircle size={22} />
                </div>
                <h3 style={{ margin: "0 0 6px", fontSize: 19, fontWeight: 800 }}>
                  How's your experience so far?
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: 13.5, margin: "0 0 20px" }}>
                  Tell us what you think of Fan Hub Plus — it only takes a moment.
                </p>

                <div
                  style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 18 }}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const starNum = i + 1;
                    const filled = starNum <= displayRating;
                    return (
                      <motion.span
                        key={i}
                        whileHover={{ scale: 1.2 }}
                        onMouseEnter={() => setHoverRating(starNum)}
                        onClick={() => setRating(starNum)}
                        style={{ cursor: "pointer", display: "inline-flex" }}
                      >
                        <FiStar size={30} color={filled ? "#f5b301" : "var(--text-muted)"} fill={filled ? "#f5b301" : "none"} />
                      </motion.span>
                    );
                  })}
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Anything specific you'd like to share? (optional)"
                  style={{
                    width: "100%",
                    minHeight: 76,
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    background: "var(--bg-soft)",
                    color: "var(--text)",
                    fontSize: 13.5,
                    fontFamily: "inherit",
                    resize: "vertical",
                    marginBottom: 18,
                  }}
                />

                <button
                  onClick={handleSubmit}
                  disabled={rating === 0 || submitting}
                  className="btn"
                  style={{
                    width: "100%",
                    opacity: rating === 0 || submitting ? 0.6 : 1,
                    cursor: rating === 0 || submitting ? "not-allowed" : "pointer",
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WebsiteFeedbackModal;
