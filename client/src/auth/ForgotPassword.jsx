import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiMail, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import api from "../api/client.js";

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--bg-soft)",
  color: "var(--text)",
  fontSize: 14,
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email: email.trim() });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420, paddingTop: 80, paddingBottom: 80 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ padding: 32 }}
      >
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Reset your password</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 24, fontSize: 14 }}>
          Enter your email and we'll send you a reset link.
        </p>

        {sent ? (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              background: "rgba(34,197,94,0.12)",
              color: "#22c55e",
              padding: "14px 16px",
              borderRadius: 10,
              fontSize: 13,
            }}
          >
            <FiCheckCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            If that email is registered, a reset link has been sent. Check the server console
            in this dev environment for the link.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(239,68,68,0.12)",
                  color: "#ef4444",
                  padding: "10px 14px",
                  borderRadius: 10,
                  fontSize: 13,
                }}
              >
                <FiAlertCircle /> {error}
              </div>
            )}
            <label style={{ fontSize: 13, fontWeight: 600 }}>
              Email
              <div style={{ position: "relative", marginTop: 6 }}>
                <FiMail style={{ position: "absolute", left: 12, top: 14, color: "var(--text-muted)" }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ ...inputStyle, paddingLeft: 38 }}
                />
              </div>
            </label>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p style={{ marginTop: 20, fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>
          <Link to="/login" style={{ color: "var(--accent)", fontWeight: 600 }}>
            Back to login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
