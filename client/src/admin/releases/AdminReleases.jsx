import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Pencil, Trash2, Rocket, Calendar } from "lucide-react";
import PageHeader from "../shared/PageHeader.jsx";
import ConfirmDialog from "../shared/ConfirmDialog.jsx";
import Modal from "../shared/Modal.jsx";

const RELEASE_TYPES = [
  { value: "anime", label: "Anime" },
  { value: "game", label: "Game" },
  { value: "movie", label: "Movie" },
  { value: "tv", label: "TV Show" },
  { value: "comic", label: "Comic" },
  { value: "manga", label: "Manga" },
  { value: "merchandise", label: "Merchandise" },
];

const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 9, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13.5, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
const lbl = { fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" };
const EMPTY = { title: "", category: "", releaseType: "anime", releaseDate: "", coverImage: "", description: "" };

const AdminReleases = () => {
  const [releases, setReleases] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    const params = typeFilter ? { releaseType: typeFilter, limit: 100 } : { limit: 100 };
    axios.get("/api/admin/releases", { params }).then((r) => {
      const d = r.data;
      setReleases(Array.isArray(d) ? d : d?.items || d?.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [typeFilter]);
  useEffect(() => {
    axios.get("/api/admin/categories").then((r) => {
      const d = r.data;
      setCategories(Array.isArray(d) ? d : d?.data || d?.items || []);
    });
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY, category: categories[0]?._id || "" });
    setError(null);
    setFormOpen(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({
      title: r.title,
      category: r.category?._id || r.category || "",
      releaseType: r.releaseType,
      releaseDate: r.releaseDate ? r.releaseDate.slice(0, 10) : "",
      coverImage: r.coverImage || "",
      description: r.description || "",
    });
    setError(null);
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editing) await axios.put(`/api/admin/releases/${editing._id}`, form);
      else await axios.post("/api/admin/releases", form);
      setFormOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await axios.delete(`/api/admin/releases/${deleteTarget._id}`);
    setDeleteTarget(null);
    load();
  };

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  return (
    <div>
      <PageHeader title="Releases" subtitle="Upcoming anime, game, movie, TV, comic, manga and merchandise releases." actionLabel="Add Release" onAction={openCreate} />

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
          <option value="">All Types</option>
          {RELEASE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading…</p>
      ) : releases.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
          <Rocket size={22} style={{ marginBottom: 8, opacity: 0.6 }} />
          <div>No releases yet.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {releases.map((r) => (
            <motion.div key={r._id} whileHover={{ y: -2 }} className="card"
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: r.coverImage ? `url(${r.coverImage}) center/cover` : "linear-gradient(135deg,#8b5cf6,#6d28d9)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {!r.coverImage && <Rocket size={18} color="#fff" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{r.title}</div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 2, fontSize: 12, color: "var(--text-muted)" }}>
                  <span style={{ textTransform: "capitalize" }}>{r.releaseType}</span>
                  <span>•</span>
                  <span>{r.category?.name || "—"}</span>
                  <span>•</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={11} /> {r.releaseDate ? new Date(r.releaseDate).toLocaleDateString() : "TBA"}
                  </span>
                </div>
              </div>
              <button onClick={() => openEdit(r)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6, color: "var(--text-muted)", display: "flex" }}><Pencil size={14} /></button>
              <button onClick={() => setDeleteTarget(r)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6, color: "#ef4444", display: "flex" }}><Trash2 size={14} /></button>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit Release" : "Add Release"} width={460}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label style={lbl}>Title</label><input style={inputStyle} value={form.title} onChange={set("title")} required placeholder="e.g. One Piece: Egghead Arc" /></div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={lbl}>Category</label>
              <select style={inputStyle} value={form.category} onChange={set("category")} required>
                <option value="" disabled>Select…</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={lbl}>Type</label>
              <select style={inputStyle} value={form.releaseType} onChange={set("releaseType")}>
                {RELEASE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div><label style={lbl}>Release Date</label><input type="date" style={inputStyle} value={form.releaseDate} onChange={set("releaseDate")} required /></div>
          <div><label style={lbl}>Cover Image URL</label><input style={inputStyle} value={form.coverImage} onChange={set("coverImage")} placeholder="https://…" /></div>
          <div><label style={lbl}>Description</label><textarea style={{ ...inputStyle, resize: "vertical" }} rows={3} value={form.description} onChange={set("description")} placeholder="Short summary…" /></div>
          {error && <p style={{ color: "#ef4444", fontSize: 12.5, margin: 0 }}>{error}</p>}
          <button type="submit" disabled={saving} style={{ padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving…" : editing ? "Save Changes" : "Add Release"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete release" message={`Delete "${deleteTarget?.title}"?`} />
    </div>
  );
};

export default AdminReleases;
