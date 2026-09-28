import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Pencil, Trash2, Tag } from "lucide-react";
import PageHeader from "../shared/PageHeader.jsx";
import ConfirmDialog from "../shared/ConfirmDialog.jsx";
import Modal from "../shared/Modal.jsx";

const CATS = ["General","Anime","Gaming","Movies","TV Shows","K-Pop","Comics","Manga","Cosplay"];
const inputStyle = { width:"100%", padding:"10px 12px", borderRadius:9, border:"1px solid var(--border)", background:"var(--bg)", color:"var(--text)", fontSize:13.5, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };
const lbl = { fontSize:12.5, fontWeight:600, color:"var(--text-muted)", marginBottom:6, display:"block" };
const EMPTY = { name:"", category:"General", color:"#8b5cf6" };

const AdminTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    const params = catFilter ? { category: catFilter } : {};
    axios.get("/api/admin/tags", { params }).then((r) => {
      const d = r.data; setTags(Array.isArray(d) ? d : d?.data || d?.items || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [catFilter]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(null); setFormOpen(true); };
  const openEdit = (t) => { setEditing(t); setForm({ name: t.name, category: t.category, color: t.color || "#8b5cf6" }); setError(null); setFormOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError(null);
    try {
      if (editing) await axios.put(`/api/admin/tags/${editing._id}`, form);
      else await axios.post("/api/admin/tags", form);
      setFormOpen(false); load();
    } catch (err) { setError(err.response?.data?.message || "Error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => { await axios.delete(`/api/admin/tags/${deleteTarget._id}`); setDeleteTarget(null); load(); };
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  return (
    <div>
      <PageHeader title="Tags" subtitle="Manage tags used across content, media, and merchandise." actionLabel="Add Tag" onAction={openCreate} />

      <div style={{ display:"flex", gap:8, marginBottom:18 }}>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={{ ...inputStyle, width:"auto" }}>
          <option value="">All Categories</option>{CATS.map((c)=><option key={c}>{c}</option>)}
        </select>
      </div>

      {loading ? <p style={{ color:"var(--text-muted)" }}>Loading…</p> : tags.length === 0 ? (
        <div className="card" style={{ padding:40, textAlign:"center", color:"var(--text-muted)" }}>No tags yet.</div>
      ) : (
        <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
          {tags.map((t) => (
            <motion.div key={t._id} whileHover={{ y:-2 }}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 14px", borderRadius:999, border:`1.5px solid ${t.color || "#8b5cf6"}`, background:`${t.color || "#8b5cf6"}12` }}>
              <Tag size={12} style={{ color: t.color || "#8b5cf6" }} />
              <span style={{ fontSize:13, fontWeight:700, color: t.color || "#8b5cf6" }}>{t.name}</span>
              <span style={{ fontSize:11, color:"var(--text-muted)" }}>{t.category}</span>
              <button onClick={() => openEdit(t)} style={{ background:"transparent", border:"none", cursor:"pointer", padding:2, color:"var(--text-muted)", display:"flex" }}><Pencil size={11}/></button>
              <button onClick={() => setDeleteTarget(t)} style={{ background:"transparent", border:"none", cursor:"pointer", padding:2, color:"#ef4444", display:"flex" }}><Trash2 size={11}/></button>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing?"Edit Tag":"Add Tag"} width={380}>
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div><label style={lbl}>Tag Name</label><input style={inputStyle} value={form.name} onChange={set("name")} required placeholder="e.g. Limited Edition" /></div>
          <div><label style={lbl}>Category</label><select style={inputStyle} value={form.category} onChange={set("category")}>{CATS.map((c)=><option key={c}>{c}</option>)}</select></div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ flex:1 }}><label style={lbl}>Color</label><input type="color" value={form.color} onChange={set("color")} style={{ width:"100%", height:40, borderRadius:8, border:"1px solid var(--border)", cursor:"pointer", background:"transparent" }} /></div>
            <div style={{ marginTop:22, padding:"8px 16px", borderRadius:999, border:`2px solid ${form.color}`, background:`${form.color}18`, fontSize:13, fontWeight:700, color:form.color }}>{form.name || "Preview"}</div>
          </div>
          {error && <p style={{ color:"#ef4444", fontSize:12.5, margin:0 }}>{error}</p>}
          <button type="submit" disabled={saving} style={{ padding:"11px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#8b5cf6,#6d28d9)", color:"#fff", fontSize:14, fontWeight:700, cursor:saving?"not-allowed":"pointer", opacity:saving?0.7:1 }}>
            {saving?"Saving…":editing?"Save Changes":"Add Tag"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete tag" message={`Delete tag "${deleteTarget?.name}"?`} />
    </div>
  );
};

export default AdminTags;
