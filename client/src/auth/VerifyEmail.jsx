import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const VerifyEmail = () => {
  const { token } = useParams();
  const { refreshUser, isAuthenticated } = useAuth();
  const [status, setStatus] = useState("verifying"); 
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get(`/auth/verify-email/${token}`)
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message);
        if (isAuthenticated) refreshUser().catch(() => {});
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification link is invalid or has expired.");
      });
    
  }, [token]);

  return (
    <div className="container" style={{ maxWidth: 420, paddingTop: 100, paddingBottom: 80, textAlign: "center" }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 36 }}>
        {status === "verifying" && (
          <>
            <FiLoader size={32} style={{ marginBottom: 12, animation: "spin 1s linear infinite" }} />
            <p style={{ color: "var(--text-muted)" }}>Verifying your email...</p>
          </>
        )}
        {status === "success" && (
          <>
            <FiCheckCircle size={36} color="#22c55e" style={{ marginBottom: 12 }} />
            <h2 style={{ marginBottom: 8 }}>Email verified!</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <FiXCircle size={36} color="#ef4444" style={{ marginBottom: 12 }} />
            <h2 style={{ marginBottom: 8 }}>Verification failed</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>{message}</p>
          </>
        )}
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="btn" style={{ display: "inline-block" }}>
          {isAuthenticated ? "Go to Dashboard" : "Go to Login"}
        </Link>
      </motion.div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default VerifyEmail;
