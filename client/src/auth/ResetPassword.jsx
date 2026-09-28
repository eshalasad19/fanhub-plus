import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FiLock, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
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

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) return setError("Passwords do not match.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setSubmitting(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset link is invalid or has expired.");
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
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Set a new password</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 24, fontSize: 14 }}>
          Choose a new password for your account.
        </p>

        {done ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(34,197,94,0.12)",
              color: "#22c55e",
              padding: "14px 16px",
              borderRadius: 10,
              fontSize: 13,
            }}
          >
            <FiCheckCircle size={18} /> Password reset! Redirecting to login...
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
              New Password
              <div style={{ position: "relative", marginTop: 6 }}>
                <FiLock style={{ position: "absolute", left: 12, top: 14, color: "var(--text-muted)" }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{ ...inputStyle, paddingLeft: 38 }}
                />
              </div>
            </label>
            <label style={{ fontSize: 13, fontWeight: 600 }}>
              Confirm Password
              <div style={{ position: "relative", marginTop: 6 }}>
                <FiLock style={{ position: "absolute", left: 12, top: 14, color: "var(--text-muted)" }} />
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  style={{ ...inputStyle, paddingLeft: 38 }}
                />
              </div>
            </label>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
