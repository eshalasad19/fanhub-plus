import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../shared/Modal.jsx";

const EMPTY_FORM = { question: "", answer: "", category: "general", keywords: "" };

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

const FaqFormModal = ({ open, onClose, onSaved, faq }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (faq) {
      setForm({
        question: faq.question || "",
        answer: faq.answer || "",
        category: faq.category || "general",
        keywords: (faq.keywords || []).join(", "),
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError(null);
  }, [faq, open]);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      question: form.question,
      answer: form.answer,
      category: form.category,
      keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
    };
    try {
      if (faq) await axios.put(`/api/chatbot/faqs/${faq._id}`, payload);
      else await axios.post("/api/chatbot/faqs", payload);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={faq ? "Edit FAQ" : "New FAQ"} width={520}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={labelStyle}>Question</label>
          <input style={inputStyle} value={form.question} onChange={handleChange("question")} required />
        </div>

        <div>
          <label style={labelStyle}>Answer</label>
          <textarea
            style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
            value={form.answer}
            onChange={handleChange("answer")}
            required
          />
        </div>

        <div>
          <label style={labelStyle}>Category</label>
          <input style={inputStyle} value={form.category} onChange={handleChange("category")} />
        </div>

        <div>
          <label style={labelStyle}>Keywords (comma separated)</label>
          <input style={inputStyle} value={form.keywords} onChange={handleChange("keywords")} placeholder="bookmark, save, favorites" />
        </div>

        {error && <p style={{ color: "#ef4444", fontSize: 12.5, margin: 0 }}>{error}</p>}

        <button
          type="submit"
          disabled={saving}
          style={{
            marginTop: 4,
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
          {saving ? "Saving…" : faq ? "Save Changes" : "Create FAQ"}
        </button>
      </form>
    </Modal>
  );
};

export default FaqFormModal;