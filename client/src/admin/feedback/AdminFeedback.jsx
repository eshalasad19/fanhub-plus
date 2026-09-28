import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Trash2 } from "lucide-react";
import PageHeader from "../shared/PageHeader.jsx";
import Badge from "../shared/Badge.jsx";
import ConfirmDialog from "../shared/ConfirmDialog.jsx";
import FeedbackDetailModal from "./FeedbackDetailModal.jsx";

const iconBtnStyle = {
  width: 30,
  height: 30,
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--bg)",
  color: "var(--text)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const selectStyle = {
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
  borderRadius: 10,
  padding: "8px 12px",
  fontSize: 13.5,
  cursor: "pointer",
};

const TYPES = ["bug", "suggestion", "query", "experience"];
const STATUSES = ["open", "reviewed", "resolved"];

const AdminFeedback = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    const params = {};
    if (typeFilter) params.type = typeFilter;
    if (statusFilter) params.status = statusFilter;
    axios
      .get("/api/admin/feedback", { params })
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [typeFilter, statusFilter]);

  const handleDelete = async () => {
    await axios.delete(`/api/admin/feedback/${deleteTarget._id}`);
    setDeleteTarget(null);
    load();
  };

  const handleUpdated = () => {
    setSelected(null);
    load();
  };

  return (
    <div>
      <PageHeader title="Feedback" subtitle="Review bug reports, suggestions, and queries from users." />

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <select style={selectStyle} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select style={selectStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading feedback…</p>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
          No feedback matches these filters.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((fb) => (
            <div
              key={fb._id}
              className="card"
              style={{
                padding: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <Badge label={fb.type} />
                  <Badge label={fb.status} />
                  {fb.rating && <Badge label={`${fb.rating} Stars`} />}
                </div>
                <p
                  style={{
                    fontSize: 13.5,
                    color: "var(--text)",
                    margin: "0 0 6px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {fb.message}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
                  {fb.user?.name || "Unknown user"} · {fb.user?.email} · {new Date(fb.createdAt).toLocaleString()}
                </p>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button onClick={() => setSelected(fb)} aria-label="View" style={iconBtnStyle}>
                  <Eye size={14} strokeWidth={2} />
                </button>
                <button
                  onClick={() => setDeleteTarget(fb)}
                  aria-label="Delete"
                  style={{ ...iconBtnStyle, color: "#ef4444" }}
                >
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FeedbackDetailModal
        open={!!selected}
        onClose={() => setSelected(null)}
        feedback={selected}
        onUpdated={handleUpdated}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete feedback"
        message="Delete this feedback entry? This cannot be undone."
      />
    </div>
  );
};

export default AdminFeedback;
