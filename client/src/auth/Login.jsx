import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiLock, FiAlertCircle, FiSend, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--bg-soft)",
  color: "var(--text)",
  fontSize: 14,
};

const Login = () => {
  const { user, login, resendVerification, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUnverifiedEmail("");
    setSubmitting(true);
    try {
      const loggedInUser = await login({
        email: form.email.trim(),
        password: form.password,
      });
      if (loggedInUser?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(location.state?.from || "/dashboard", { replace: true });
      }
    } catch (err) {
      if (err.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        setUnverifiedEmail(err.response.data.email || form.email.trim());
        setError(err.response.data.message);
      } else {
        setError(err.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerification(unverifiedEmail);
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } finally {
      setResending(false);
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
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>
          Welcome <span className="gradient-text">back</span>
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 24, fontSize: 14 }}>
          Log in to your Fan Hub Plus account.
        </p>

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
              marginBottom: 18,
            }}
          >
            <FiAlertCircle /> {error}
          </div>
        )}

        {unverifiedEmail && (
          <div style={{ marginBottom: 18 }}>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="btn"
              style={{
                width: "100%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <FiSend size={14} /> {resending ? "Sending..." : "Resend verification email"}
            </button>
            {resent && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  color: "#22c55e",
                  fontSize: 12.5,
                  fontWeight: 600,
                  marginTop: 10,
                }}
              >
                <FiCheckCircle size={13} /> Verification email sent
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 600 }}>
            Email
            <div style={{ position: "relative", marginTop: 6 }}>
              <FiMail style={{ position: "absolute", left: 12, top: 14, color: "var(--text-muted)" }} />
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={{ ...inputStyle, paddingLeft: 38 }}
              />
            </div>
          </label>

          <label style={{ fontSize: 13, fontWeight: 600 }}>
            Password
            <div style={{ position: "relative", marginTop: 6 }}>
              <FiLock style={{ position: "absolute", left: 12, top: 14, color: "var(--text-muted)" }} />
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{ ...inputStyle, paddingLeft: 38 }}
              />
            </div>
          </label>

          <div style={{ textAlign: "right" }}>
            <Link to="/forgot-password" style={{ fontSize: 12, color: "var(--accent)" }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn" disabled={submitting} style={{ marginTop: 4 }}>
            {submitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--accent)", fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;