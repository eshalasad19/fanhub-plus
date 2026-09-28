import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiSend, FiCheckCircle, FiFeather } from "react-icons/fi";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { CATEGORIES } from "../constants/taxonomy.js";
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

const EMPTY = { title: "", content: "", category: CATEGORIES[0].name, image: "" };

const SubmitFanContent = () => {
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const isContributor = user?.role === "user" || user?.role === "admin";

  if (!isContributor) {
    return (
      <div className="container" style={{ maxWidth: 640, paddingTop: 40, paddingBottom: 80 }}>
        <Breadcrumb items={[{ label: "Submit Fan Content" }]} />
        <div className="card" style={{ padding: 28, textAlign: "center" }}>
          <FiFeather size={30} style={{ opacity: 0.5, marginBottom: 10 }} />
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>Become a Contributor First</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 13.5, marginBottom: 18 }}>
            Only approved contributors can submit fan content. Convert your account from your profile —
            it only takes a second.
          </p>
          <Link to="/profile" className="btn" style={{ fontSize: 13, padding: "8px 18px", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <FiFeather size={14} /> Become a Contributor
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/submissions", form);
      setForm(EMPTY);
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't submit your content. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 640, paddingTop: 40, paddingBottom: 80 }}>
      <Breadcrumb items={[{ label: "Submit Fan Content" }]} />
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 28, display: "flex", alignItems: "center", gap: 10 }}
      >
        <FiFeather /> Share Your <span className="gradient-text">Fan Creation</span>
      </motion.h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
        Fan art, fan fiction, theories, cosplay write-ups — submit it here and our team will review it before it goes live.
      </p>

      <form onSubmit={handleSubmit} className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="text"
          placeholder="Title"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={inputStyle}
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={inputStyle}
        >
          {CATEGORIES.map((c) => (
            <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
          ))}
        </select>

        <textarea
          placeholder="Tell us about your creation, or paste your fan fiction / write-up here…"
          rows={6}
          required
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          style={{ ...inputStyle, resize: "vertical" }}
        />

        <input
          type="text"
          placeholder="Image URL (optional)"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          style={inputStyle}
        />

        {error && <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{error}</p>}

        <button type="submit" className="btn" disabled={submitting} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <FiSend size={14} /> {submitting ? "Submitting…" : "Submit for Review"}
        </button>

        {sent && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", alignItems: "center", gap: 8, color: "#22c55e", fontSize: 13.5, fontWeight: 600 }}
          >
            <FiCheckCircle /> Submitted! Our team will review it soon.
          </motion.div>
        )}
      </form>
    </div>
  );
};

export default SubmitFanContent;
