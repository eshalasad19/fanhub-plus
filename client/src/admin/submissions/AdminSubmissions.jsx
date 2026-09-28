import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Eye, Trash2, CheckCircle, XCircle } from "lucide-react";
import PageHeader from "../shared/PageHeader.jsx";
import Badge from "../shared/Badge.jsx";
import ConfirmDialog from "../shared/ConfirmDialog.jsx";
import Modal from "../shared/Modal.jsx";

const FILTERS = ["all", "pending", "approved", "rejected"];

const CATEGORIES = ["All", "Anime", "Gaming", "Movies", "TV Shows", "K-Pop", "Comics", "Manga", "Cosplay"];

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
  flexShrink: 0,
};

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadSubmissions = () => {
    setLoading(true);
    const params = {};
    if (statusFilter !== "all") params.status = statusFilter;
    if (categoryFilter !== "All") params.category = categoryFilter;
    axios
      .get("/api/submissions", { params })
      .then((res) => setSubmissions(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSubmissions();
  }, [statusFilter, categoryFilter]);

  const handleStatusChange = async (id, status) => {
    await axios.put(`/api/submissions/${id}`, { status });
    loadSubmissions();
    if (selected?._id === id) setSelected(null);
  };

  const handleDelete = async () => {
    await axios.delete(`/api/submissions/${deleteTarget._id}`);
    setDeleteTarget(null);
    loadSubmissions();
  };

  return (
    <div>
      <PageHeader
        title="Fan Submissions"
        subtitle="Review and approve fan-submitted content."
      />

      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              border: "1px solid var(--border)",
              background: statusFilter === f ? "linear-gradient(135deg,#8b5cf6,#6d28d9)" : "var(--surface)",
              color: statusFilter === f ? "#fff" : "var(--text)",
              fontSize: 12.5,
              fontWeight: 600,
              textTransform: "capitalize",
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            style={{
              padding: "5px 12px",
              borderRadius: 999,
              border: "1px solid var(--border)",
              background: categoryFilter === cat ? "rgba(139,92,246,0.15)" : "transparent",
              color: categoryFilter === cat ? "#8b5cf6" : "var(--text-muted)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading submissions…</p>
      ) : submissions.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>
          No submissions in this view.
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {submissions.map((sub, i) => (
            <motion.div
              key={sub._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 18px",
                borderBottom: i < submissions.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <Badge label={sub.category} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {sub.title}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
                  {sub.user?.name || "Unknown"} · {new Date(sub.createdAt).toLocaleDateString()}
                </div>
              </div>
              <Badge label={sub.status} />

              {sub.status === "pending" && (
                <>
                  <button
                    onClick={() => handleStatusChange(sub._id, "approved")}
                    aria-label="Approve"
                    title="Approve"
                    style={{ ...iconBtnStyle, color: "#10b981" }}
                  >
                    <CheckCircle size={14} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => handleStatusChange(sub._id, "rejected")}
                    aria-label="Reject"
                    title="Reject"
                    style={{ ...iconBtnStyle, color: "#ef4444" }}
                  >
                    <XCircle size={14} strokeWidth={2} />
                  </button>
                </>
              )}

              <button onClick={() => setSelected(sub)} aria-label="View" style={iconBtnStyle}>
                <Eye size={14} strokeWidth={2} />
              </button>
              <button
                onClick={() => setDeleteTarget(sub)}
                aria-label="Delete"
                style={{ ...iconBtnStyle, color: "#ef4444" }}
              >
                <Trash2 size={14} strokeWidth={2} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Submission Detail" width={540}>
        {selected && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <Badge label={selected.category} />
              <Badge label={selected.status} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>
                Title
              </div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{selected.title}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>
                Content
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>{selected.content}</p>
            </div>
            {selected.image && (
              <img
                src={selected.image}
                alt="submission"
                style={{ width: "100%", borderRadius: 10, objectFit: "cover", maxHeight: 200 }}
              />
            )}
            <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
              Submitted by <strong>{selected.user?.name || "Unknown"}</strong> · {new Date(selected.createdAt).toLocaleDateString()}
            </div>
            {selected.status === "pending" && (
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button
                  onClick={() => handleStatusChange(selected._id, "approved")}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    borderRadius: 10,
                    border: "none",
                    background: "#10b981",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13.5,
                    cursor: "pointer",
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange(selected._id, "rejected")}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    borderRadius: 10,
                    border: "none",
                    background: "#ef4444",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13.5,
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete submission"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
      />
    </div>
  );
};

export default AdminSubmissions;
