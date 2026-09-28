import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Sparkles } from "lucide-react";
import PageHeader from "../shared/PageHeader.jsx";
import ConfirmDialog from "../shared/ConfirmDialog.jsx";
import FaqFormModal from "./FaqFormModal.jsx";

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

const AdminChatbot = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadFaqs = () => {
    setLoading(true);
    axios.get("/api/chatbot/faqs").then((res) => setFaqs(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const openCreate = () => {
    setEditingFaq(null);
    setFormOpen(true);
  };

  const openEdit = (faq) => {
    setEditingFaq(faq);
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    loadFaqs();
  };

  const handleDelete = async () => {
    await axios.delete(`/api/chatbot/faqs/${deleteTarget._id}`);
    setDeleteTarget(null);
    loadFaqs();
  };

  const toggleActive = async (faq) => {
    await axios.put(`/api/chatbot/faqs/${faq._id}`, { isActive: !faq.isActive });
    loadFaqs();
  };

  return (
    <div>
      <PageHeader
        title="Chatbot Knowledge Base"
        subtitle="Manage the FAQ entries the assistant responds with."
        actionLabel="New FAQ"
        onAction={openCreate}
      />

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading FAQs…</p>
      ) : faqs.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
          No FAQ entries yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((faq) => (
            <div key={faq._id} className="card" style={{ padding: 16, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "rgba(168,85,247,0.15)",
                  color: "#a855f7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Sparkles size={16} strokeWidth={2} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{faq.question}</div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "6px 0", lineHeight: 1.5 }}>{faq.answer}</p>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", textTransform: "capitalize" }}>{faq.category}</div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => toggleActive(faq)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 999,
                    border: "none",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    background: faq.isActive ? "rgba(16,185,129,0.15)" : "var(--border)",
                    color: faq.isActive ? "#10b981" : "var(--text-muted)",
                  }}
                >
                  {faq.isActive ? "Active" : "Inactive"}
                </button>
                <button onClick={() => openEdit(faq)} aria-label="Edit" style={iconBtnStyle}>
                  <Pencil size={14} strokeWidth={2} />
                </button>
                <button onClick={() => setDeleteTarget(faq)} aria-label="Delete" style={{ ...iconBtnStyle, color: "#ef4444" }}>
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FaqFormModal open={formOpen} onClose={() => setFormOpen(false)} onSaved={handleSaved} faq={editingFaq} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete FAQ"
        message={`Delete "${deleteTarget?.question}"?`}
      />
    </div>
  );
};

export default AdminChatbot;