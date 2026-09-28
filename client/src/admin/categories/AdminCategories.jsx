import CategoryIcon from "../../components/CategoryIcon.jsx";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import PageHeader from "../shared/PageHeader.jsx";
import ConfirmDialog from "../shared/ConfirmDialog.jsx";
import Modal from "../shared/Modal.jsx";

const NAMES = ["Anime","Gaming","Movies","TV Shows","K-Pop","Comics","Manga","Cosplay"];

const inputStyle = { width:"100%", padding:"10px 12px", borderRadius:9, border:"1px solid var(--border)", background:"var(--bg)", color:"var(--text)", fontSize:13.5, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };
const labelStyle = { fontSize:12.5, fontWeight:600, color:"var(--text-muted)", marginBottom:6, display:"block" };

const EMPTY = { name: "Anime", description: "", coverImage: "" };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => { setLoading(true); axios.get("/api/admin/categories").then((r) => {
    const d = r.data; setCategories(Array.isArray(d) ? d : d?.data || d?.items || []);
  }).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(null); setFormOpen(true); };
  const openEdit = (cat) => { setEditing(cat); setForm({ name: cat.name, description: cat.description || "", coverImage: cat.coverImage || "" }); setError(null); setFormOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError(null);
    try {
      if (editing) await axios.put(`/api/admin/categories/${editing._id}`, form);
      else await axios.post("/api/admin/categories", form);
      setFormOpen(false); load();
    } catch (err) { setError(err.response?.data?.message || "Something went wrong"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => { await axios.delete(`/api/admin/categories/${deleteTarget._id}`); setDeleteTarget(null); load(); };
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  return (
    <div>
      <PageHeader title="Categories" subtitle="Manage the 8 fandom categories." actionLabel="Add Category" onAction={openCreate} />

      {loading ? <p style={{ color:"var(--text-muted)" }}>Loading…</p> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:14 }}>
          {categories.map((cat) => (
            <motion.div key={cat._id} whileHover={{ y:-3 }} className="card" style={{ padding:18 }}>
              <div style={{ fontSize:36, marginBottom:10, display: "flex", alignItems: "center" }}><CategoryIcon name={cat.name} size={36} /></div>
              <div style={{ fontWeight:700, fontSize:15 }}>{cat.name}</div>
              <p style={{ fontSize:13, color:"var(--text-muted)", margin:"6px 0 14px", lineHeight:1.5 }}>{cat.description || "No description"}</p>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => openEdit(cat)} style={{ flex:1, padding:"7px 0", borderRadius:8, border:"1px solid var(--border)", background:"var(--bg)", color:"var(--text)", cursor:"pointer", fontSize:12.5, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}><Pencil size={12} /> Edit</button>
                <button onClick={() => setDeleteTarget(cat)} style={{ padding:"7px 12px", borderRadius:8, border:"none", background:"rgba(239,68,68,0.1)", color:"#ef4444", cursor:"pointer" }}><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
          {categories.length === 0 && <div className="card" style={{ padding:40, textAlign:"center", color:"var(--text-muted)", gridColumn:"1/-1" }}>No categories yet.</div>}
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit Category" : "Add Category"} width={460}>
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div><label style={labelStyle}>Name</label>
            <select style={inputStyle} value={form.name} onChange={set("name")}>
              {NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div><label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, minHeight:80, resize:"vertical" }} value={form.description} onChange={set("description")} />
          </div>
          <div><label style={labelStyle}>Cover Image URL</label>
            <input style={inputStyle} value={form.coverImage} onChange={set("coverImage")} placeholder="https://…" />
          </div>
          {error && <p style={{ color:"#ef4444", fontSize:12.5, margin:0 }}>{error}</p>}
          <button type="submit" disabled={saving} style={{ padding:"11px 16px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#8b5cf6,#6d28d9)", color:"#fff", fontSize:14, fontWeight:700, cursor:saving?"not-allowed":"pointer", opacity:saving?0.7:1 }}>
            {saving ? "Saving…" : editing ? "Save Changes" : "Add Category"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete category" message={`Delete "${deleteTarget?.name}"? This cannot be undone.`} />
    </div>
  );
};

export default AdminCategories;
