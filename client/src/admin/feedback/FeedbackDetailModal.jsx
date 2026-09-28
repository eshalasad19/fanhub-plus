import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../shared/Modal.jsx";
import Badge from "../shared/Badge.jsx";

const STATUSES = ["open", "reviewed", "resolved"];

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 9,
  border: "1px solid var(--border)",
  background: "var(--bg)",
  color: "var(--text)",
  fontSize: 13.5,
  outline: "none",
  fontFamily: "inherit",
};

const labelStyle = { fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" };

const FeedbackDetailModal = ({ open, onClose, feedback, onUpdated }) => {
  const [status, setStatus] = useState("open");
  const [adminResponse, setAdminResponse] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (feedback) {
      setStatus(feedback.status);
      setAdminResponse(feedback.adminResponse || "");
    }
  }, [feedback]);

  if (!feedback) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/feedback/${feedback._id}`, { status, adminResponse });
      onUpdated();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Feedback Detail" width={480}>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <Badge label={feedback.type} />
        <Badge label={feedback.status} />
        {feedback.rating && <Badge label={`${feedback.rating} Stars`} />}
      </div>

      <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text)", margin: "0 0 6px" }}>{feedback.message}</p>
      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 20px" }}>
        {feedback.user?.name || "Unknown user"} · {feedback.user?.email} · {new Date(feedback.createdAt).toLocaleString()}
      </p>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Status</label>
        <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Admin Response</label>
        <textarea
          style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
          value={adminResponse}
          onChange={(e) => setAdminResponse(e.target.value)}
          placeholder="Optional note visible to the user…"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          width: "100%",
          padding: "11px 16px",
          borderRadius: 10,
          border: "none",
          background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
          color: "#fff",
          fontSize: 14,
          fontWeight: 700,
          cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </Modal>
  );
};

export default FeedbackDetailModal;