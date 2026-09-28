import { useState } from "react";
import { motion } from "framer-motion";
import { FiMessageSquare, FiSend, FiCheckCircle } from "react-icons/fi";
import api from "../api/client.js";
import Breadcrumb from "../components/Breadcrumb.jsx";

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--bg-soft)",
  color: "var(--text)",
  fontSize: 14,
  fontFamily: "inherit",
};

const TYPES = [
  { value: "bug", label: "Bug Report" },
  { value: "suggestion", label: "Suggestion" },
  { value: "query", label: "Query" },
];

const STATUS_COLORS = { open: "#f59e0b", reviewed: "#3b82f6", resolved: "#22c55e" };

const Feedback = () => {
  const [form, setForm] = useState({ type: "bug", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/feedback", form);
      localStorage.setItem("fanhub_feedback_submitted", "true");
      setForm({ type: "bug", message: "" });
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't submit feedback. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 640, paddingTop: 40, paddingBottom: 80 }}>
      <Breadcrumb items={[{ label: "Feedback" }]} />
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 28, display: "flex", alignItems: "center", gap: 10 }}
      >
        <FiMessageSquare /> Send <span className="gradient-text">Feedback</span>
      </motion.h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
        Found a bug, have a suggestion, or a question for the team? Let us know — our admins review every submission.
      </p>

      <form onSubmit={handleSubmit} className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {TYPES.map((t) => (
            <button
              type="button"
              key={t.value}
              onClick={() => setForm({ ...form, type: t.value })}
              style={{
                flex: 1,
                padding: "9px 12px",
                borderRadius: 999,
                border: form.type === t.value ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                background: form.type === t.value ? "var(--primary)18" : "var(--surface)",
                color: form.type === t.value ? "var(--primary)" : "var(--text)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <textarea
          placeholder="Tell us what's going on…"
          rows={5}
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          style={{ ...inputStyle, resize: "vertical" }}
        />

        {error && <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{error}</p>}

        <button type="submit" className="btn" disabled={submitting} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <FiSend size={14} /> {submitting ? "Sending…" : "Submit Feedback"}
        </button>

        {sent && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", alignItems: "center", gap: 8, color: "#22c55e", fontSize: 13.5, fontWeight: 600 }}
          >
            <FiCheckCircle /> Thanks — your feedback has been sent!
          </motion.div>
        )}
      </form>
    </div>
  );
};

export default Feedback;
