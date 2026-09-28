import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import PageHeader from "../shared/PageHeader.jsx";
import ConfirmDialog from "../shared/ConfirmDialog.jsx";
import Modal from "../shared/Modal.jsx";

const CATS = ["Anime","Gaming","Movies","TV Shows","K-Pop","Comics","Manga","Cosplay"];
const inputStyle = { width:"100%", padding:"10px 12px", borderRadius:9, border:"1px solid var(--border)", background:"var(--bg)", color:"var(--text)", fontSize:13.5, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };
const lbl = { fontSize:12.5, fontWeight:600, color:"var(--text-muted)", marginBottom:6, display:"block" };
const EMPTY = { title:"", category:"Anime", excerpt:"", content:"", coverImage:"", tags:"", isPublished:false, isFeatured:false };
const iconBtn = (extra={}) => ({ width:28, height:28, borderRadius:8, border:"1px solid var(--border)", background:"var(--bg)", color:"var(--text)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, ...extra });

const AdminArticles = () => {
  const [items, setItems] = useState([]);
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
    axios.get("/api/admin/articles", { params }).then((r) => {
      const d = r.data; setItems(Array.isArray(d) ? d : d?.data || d?.items || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [catFilter]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(null); setFormOpen(true); };
  const openEdit = (a) => { setEditing(a); setForm({ ...a, tags: a.tags?.join(", ") || "" }); setError(null); setFormOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError(null);
    const payload = { ...form, tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [] };
    try {
      if (editing) await axios.put(`/api/admin/articles/${editing._id}`, payload);
      else await axios.post("/api/admin/articles", payload);
      setFormOpen(false); load();
    } catch (err) { setError(err.response?.data?.message || "Error"); }
    finally { setSaving(false); }
  };

  const togglePublish = async (a) => { await axios.put(`/api/admin/articles/${a._id}`, { isPublished: !a.isPublished }); load(); };
  const toggleFeatured = async (a) => { await axios.put(`/api/admin/articles/${a._id}`, { isFeatured: !a.isFeatured }); load(); };
  const handleDelete = async () => { await axios.delete(`/api/admin/articles/${deleteTarget._id}`); setDeleteTarget(null); load(); };
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  return (
    <div>
      <PageHeader title="Articles" subtitle="Manage featured articles and posts." actionLabel="Add Article" onAction={openCreate} />

      <div style={{ display:"flex", gap:8, marginBottom:18 }}>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={{ ...inputStyle, width:"auto" }}>
          <option value="">All Categories</option>{CATS.map((c)=><option key={c}>{c}</option>)}
        </select>
      </div>

      {loading ? <p style={{ color:"var(--text-muted)" }}>Loading…</p> : items.length === 0 ? (
        <div className="card" style={{ padding:40, textAlign:"center", color:"var(--text-muted)" }}>No articles yet.</div>
      ) : (
        <div className="card" style={{ padding:0, overflow:"hidden" }}>
          {items.map((a, i) => (
            <motion.div key={a._id} initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ display:"flex", gap:12, alignItems:"center", padding:"13px 18px", borderBottom:i<items.length-1?"1px solid var(--border)":"none" }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:13.5, display:"flex", alignItems:"center", gap:6 }}>
                  {a.isFeatured && <Star size={12} style={{ color:"#f59e0b", flexShrink:0 }} />}
                  <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.title}</span>
                </div>
                <div style={{ fontSize:11.5, color:"var(--text-muted)", marginTop:2 }}>{typeof a.category === "object" ? a.category?.name : a.category}</div>
              </div>
              <span style={{ padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:700, background:a.isPublished?"rgba(16,185,129,0.12)":"rgba(245,158,11,0.12)", color:a.isPublished?"#10b981":"#f59e0b", flexShrink:0 }}>{a.isPublished?"Published":"Draft"}</span>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={() => toggleFeatured(a)} title="Toggle Featured" style={iconBtn({ color: a.isFeatured?"#f59e0b":"var(--text-muted)" })}><Star size={12}/></button>
                <button onClick={() => togglePublish(a)} title={a.isPublished?"Unpublish":"Publish"} style={iconBtn({ color:a.isPublished?"#f59e0b":"#10b981" })}>{a.isPublished?<EyeOff size={12}/>:<Eye size={12}/>}</button>
                <button onClick={() => openEdit(a)} style={iconBtn()}><Pencil size={12}/></button>
                <button onClick={() => setDeleteTarget(a)} style={iconBtn({ color:"#ef4444" })}><Trash2 size={12}/></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing?"Edit Article":"Add Article"} width={560}>
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:13 }}>
          <div><label style={lbl}>Title</label><input style={inputStyle} value={form.title} onChange={set("title")} required /></div>
          <div><label style={lbl}>Category</label><select style={inputStyle} value={form.category} onChange={set("category")}>{CATS.map((c)=><option key={c}>{c}</option>)}</select></div>
          <div><label style={lbl}>Excerpt</label><input style={inputStyle} value={form.excerpt} onChange={set("excerpt")} placeholder="Short summary…" /></div>
          <div><label style={lbl}>Content (rich text / HTML)</label><textarea style={{ ...inputStyle, minHeight:120, resize:"vertical", fontFamily:"monospace", fontSize:13 }} value={form.content} onChange={set("content")} required /></div>
          <div><label style={lbl}>Cover Image URL</label><input style={inputStyle} value={form.coverImage} onChange={set("coverImage")} placeholder="https://…" /></div>
          <div><label style={lbl}>Tags (comma separated)</label><input style={inputStyle} value={form.tags} onChange={set("tags")} /></div>
          <div style={{ display:"flex", gap:20 }}>
            <label style={{ display:"flex", alignItems:"center", gap:7, fontSize:13.5, cursor:"pointer" }}><input type="checkbox" checked={form.isPublished} onChange={set("isPublished")} /> Publish</label>
            <label style={{ display:"flex", alignItems:"center", gap:7, fontSize:13.5, cursor:"pointer" }}><input type="checkbox" checked={form.isFeatured} onChange={set("isFeatured")} /> Featured</label>
          </div>
          {error && <p style={{ color:"#ef4444", fontSize:12.5, margin:0 }}>{error}</p>}
          <button type="submit" disabled={saving} style={{ padding:"11px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#8b5cf6,#6d28d9)", color:"#fff", fontSize:14, fontWeight:700, cursor:saving?"not-allowed":"pointer", opacity:saving?0.7:1 }}>
            {saving?"Saving…":editing?"Save Changes":"Add Article"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete article" message={`Delete "${deleteTarget?.title}"?`} />
    </div>
  );
};

export default AdminArticles;
