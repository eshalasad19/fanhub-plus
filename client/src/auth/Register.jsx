import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiAlertCircle, FiCheckCircle, FiSend } from "react-icons/fi";
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

const Register = () => {
  const { user, register, resendVerification, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
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

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setRegisteredEmail(res.email);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerification(registeredEmail);
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } finally {
      setResending(false);
    }
  };

  if (registeredEmail) {
    return (
      <div className="container" style={{ maxWidth: 420, paddingTop: 80, paddingBottom: 80 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{ padding: 32, textAlign: "center" }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "var(--gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
              color: "#fff",
            }}
          >
            <FiMail size={26} />
          </div>
          <h1 style={{ fontSize: 22, marginBottom: 8 }}>Verify your email</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
            We sent a verification link to
          </p>
          <p style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 20 }}>{registeredEmail}</p>
          <p style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
            You'll need to verify your email before you can log in. Check your inbox and spam folder.
          </p>

          <button
            onClick={handleResend}
            disabled={resending}
            className="btn"
            style={{
              width: "100%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 14,
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
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 14,
              }}
            >
              <FiCheckCircle size={14} /> Verification email sent
            </div>
          )}

          <Link to="/login" style={{ color: "var(--accent)", fontWeight: 600, fontSize: 13.5 }}>
            Back to login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 420, paddingTop: 80, paddingBottom: 80 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ padding: 32 }}
      >
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>
          Join the <span className="gradient-text">fandom</span>
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 24, fontSize: 14 }}>
          Create your Fan Hub Plus account.
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 600 }}>
            Name
            <div style={{ position: "relative", marginTop: 6 }}>
              <FiUser style={{ position: "absolute", left: 12, top: 14, color: "var(--text-muted)" }} />
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                style={{ ...inputStyle, paddingLeft: 38 }}
              />
            </div>
          </label>

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
                name="confirm"
                required
                value={form.confirm}
                onChange={handleChange}
                placeholder="Repeat password"
                style={{ ...inputStyle, paddingLeft: 38 }}
              />
            </div>
          </label>

          <button type="submit" className="btn" disabled={submitting} style={{ marginTop: 4 }}>
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent)", fontWeight: 600 }}>
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
