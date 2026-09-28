import { useState } from "react";
import { motion } from "framer-motion";
import { FiEdit3, FiPlus, FiTrash2, FiSave, FiX } from "react-icons/fi";
import useApi from "../hooks/useApi.js";
import api from "../api/client.js";
import EmptyState from "../components/EmptyState.jsx";
import LoadingGrid from "../components/LoadingGrid.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--bg-soft)",
  color: "var(--text)",
  fontSize: 14,
  fontFamily: "inherit",
};

const Notes = () => {
  const { data: notes, loading, refetch } = useApi("/notes");
  const [creating, setCreating] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", body: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", body: "" });
  const [saving, setSaving] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newNote.body.trim()) return;
    setSaving(true);
    try {
      await api.post("/notes", newNote);
      setNewNote({ title: "", body: "" });
      setCreating(false);
      refetch();
    } catch (err) {
      console.error("Failed to create note", err);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditForm({ title: note.title || "", body: note.body });
  };

  const handleUpdate = async (id) => {
    setSaving(true);
    try {
      await api.put(`/notes/${id}`, editForm);
      setEditingId(null);
      refetch();
    } catch (err) {
      console.error("Failed to update note", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      refetch();
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 720, paddingTop: 40, paddingBottom: 80 }}>
      <Breadcrumb items={[{ label: "Notes" }]} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 28, display: "flex", alignItems: "center", gap: 10 }}
        >
          <FiEdit3 /> Your <span className="gradient-text">Notes</span>
        </motion.h1>
        {!creating && (
          <button className="btn" onClick={() => setCreating(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <FiPlus /> New Note
          </button>
        )}
      </div>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Jot down thoughts, theories, or reminders about your fandoms.</p>

      {creating && (
        <form onSubmit={handleCreate} className="card" style={{ padding: 18, marginBottom: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="text"
            placeholder="Title (optional)"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            style={inputStyle}
          />
          <textarea
            placeholder="Write your note..."
            rows={4}
            required
            value={newNote.body}
            onChange={(e) => setNewNote({ ...newNote, body: e.target.value })}
            style={{ ...inputStyle, resize: "vertical" }}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" className="btn" disabled={saving} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <FiSave size={14} /> {saving ? "Saving..." : "Save Note"}
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              style={{ border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", borderRadius: 999, padding: "10px 18px", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <LoadingGrid count={4} height={100} />
      ) : !notes || notes.length === 0 ? (
        !creating && <EmptyState message="No notes yet. Click 'New Note' to add your first one." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {notes.map((n) =>
            editingId === n._id ? (
              <div key={n._id} className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  type="text"
                  placeholder="Title (optional)"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  style={inputStyle}
                />
                <textarea
                  rows={4}
                  value={editForm.body}
                  onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => handleUpdate(n._id)} className="btn" disabled={saving} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <FiSave size={14} /> Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{ border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", borderRadius: 999, padding: "10px 18px", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div key={n._id} className="card" style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{n.title || "Untitled note"}</div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => startEdit(n)} title="Edit" style={{ border: "none", background: "transparent", color: "var(--text-muted)", cursor: "pointer" }}>
                      <FiEdit3 size={15} />
                    </button>
                    <button onClick={() => handleDelete(n._id)} title="Delete" style={{ border: "none", background: "transparent", color: "var(--text-muted)", cursor: "pointer" }}>
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
                <p style={{ color: "var(--text-muted)", marginTop: 8, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{n.body}</p>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 10 }}>
                  Updated {new Date(n.updatedAt).toLocaleString()}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Notes;
