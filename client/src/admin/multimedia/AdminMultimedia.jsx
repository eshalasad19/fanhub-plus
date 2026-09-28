import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Pencil, Trash2, Film } from "lucide-react";
import PageHeader from "../shared/PageHeader.jsx";
import ConfirmDialog from "../shared/ConfirmDialog.jsx";
import Modal from "../shared/Modal.jsx";

const CATS = ["Anime","Gaming","Movies","TV Shows","K-Pop","Comics","Manga","Cosplay"];
const TYPES = ["video","trailer","audio","podcast","soundtrack","explainer"];
const inputStyle = { width:"100%", padding:"10px 12px", borderRadius:9, border:"1px solid var(--border)", background:"var(--bg)", color:"var(--text)", fontSize:13.5, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };
const lbl = { fontSize:12.5, fontWeight:600, color:"var(--text-muted)", marginBottom:6, display:"block" };
const EMPTY = { title:"", type:"video", category:"Anime", mediaUrl:"", thumbnail:"", description:"", tags:"", duration:"" };
const iconBtn = (extra={}) => ({ width:28, height:28, borderRadius:8, border:"1px solid var(--border)", background:"var(--bg)", color:"var(--text)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, ...extra });


const AdminMultimedia = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    const params = {};
    if (catFilter) params.category = catFilter;
    if (typeFilter) params.type = typeFilter;
    axios.get("/api/admin/multimedia", { params }).then((r) => {
      const d = r.data; setItems(Array.isArray(d) ? d : d?.data || d?.items || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [catFilter, typeFilter]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(null); setFormOpen(true); };
  const openEdit = (m) => { setEditing(m); setForm({ ...m, tags: m.tags?.join(", ") || "" }); setError(null); setFormOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError(null);
    const payload = { ...form, tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [] };
    try {
      if (editing) await axios.put(`/api/admin/multimedia/${editing._id}`, payload);
      else await axios.post("/api/admin/multimedia", payload);
      setFormOpen(false); load();
    } catch (err) { setError(err.response?.data?.message || "Error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => { await axios.delete(`/api/admin/multimedia/${deleteTarget._id}`); setDeleteTarget(null); load(); };
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  return (
    <div>
      <PageHeader title="Multimedia" subtitle="Manage videos, trailers, audio & more." actionLabel="Add Media" onAction={openCreate} />

      <div style={{ display:"flex", gap:10, marginBottom:18 }}>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={{ ...inputStyle, width:"auto" }}>
          <option value="">All Categories</option>{CATS.map((c)=><option key={c}>{c}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ ...inputStyle, width:"auto" }}>
          <option value="">All Types</option>{TYPES.map((t)=><option key={t}>{t}</option>)}
        </select>
      </div>

      {loading ? <p style={{ color:"var(--text-muted)" }}>Loading…</p> : items.length === 0 ? (
        <div className="card" style={{ padding:40, textAlign:"center", color:"var(--text-muted)" }}>No media found.</div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:14 }}>
          {items.map((m) => (
            <motion.div key={m._id} whileHover={{ y:-3 }} className="card" style={{ padding:0, overflow:"hidden" }}>
              {m.thumbnail ? <img src={m.thumbnail} alt={m.title} style={{ width:"100%", height:130, objectFit:"cover" }} onError={(e)=>{e.target.style.display="none"}} />
                : <div style={{ height:130, background:"linear-gradient(135deg,#1e1b4b,#4c1d95)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:40 }}><Film size={36} color="#fff" /></div>}
              <div style={{ padding:14 }}>
                <div style={{ fontWeight:700, fontSize:13.5, marginBottom:4 }}>{m.title}</div>
                <div style={{ fontSize:12, color:"var(--text-muted)", marginBottom:10 }}>{typeof m.category === "object" ? m.category?.name : m.category} · {m.type}{m.duration ? ` · ${m.duration}` : ""}</div>
                {m.tags?.length > 0 && (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
                    {m.tags.map((t) => <span key={t} style={{ padding:"2px 8px", borderRadius:999, fontSize:10.5, fontWeight:700, background:"rgba(139,92,246,0.12)", color:"#8b5cf6" }}>{t}</span>)}
                  </div>
                )}
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => openEdit(m)} style={{ flex:1, padding:"7px", borderRadius:8, border:"1px solid var(--border)", background:"var(--bg)", color:"var(--text)", cursor:"pointer", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}><Pencil size={11}/> Edit</button>
                  <button onClick={() => setDeleteTarget(m)} style={{ padding:"7px 10px", borderRadius:8, border:"none", background:"rgba(239,68,68,0.1)", color:"#ef4444", cursor:"pointer" }}><Trash2 size={13}/></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing?"Edit Media":"Add Media"} width={500}>
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:13 }}>
          <div><label style={lbl}>Title</label><input style={inputStyle} value={form.title} onChange={set("title")} required /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={lbl}>Type</label><select style={inputStyle} value={form.type} onChange={set("type")}>{TYPES.map((t)=><option key={t}>{t}</option>)}</select></div>
            <div><label style={lbl}>Category</label><select style={inputStyle} value={form.category} onChange={set("category")}>{CATS.map((c)=><option key={c}>{c}</option>)}</select></div>
          </div>
          <div><label style={lbl}>Media URL *</label><input style={inputStyle} value={form.mediaUrl} onChange={set("mediaUrl")} placeholder="https://youtube.com/…" required /></div>
          <div><label style={lbl}>Thumbnail URL</label><input style={inputStyle} value={form.thumbnail} onChange={set("thumbnail")} placeholder="https://…" /></div>
          <div><label style={lbl}>Description</label><textarea style={{ ...inputStyle, minHeight:70, resize:"vertical" }} value={form.description} onChange={set("description")} /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={lbl}>Tags (comma separated)</label><input style={inputStyle} value={form.tags} onChange={set("tags")} placeholder="action, dub…" /></div>
            <div><label style={lbl}>Duration</label><input style={inputStyle} value={form.duration} onChange={set("duration")} placeholder="e.g. 24:00" /></div>
          </div>
          {error && <p style={{ color:"#ef4444", fontSize:12.5, margin:0 }}>{error}</p>}
          <button type="submit" disabled={saving} style={{ padding:"11px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#8b5cf6,#6d28d9)", color:"#fff", fontSize:14, fontWeight:700, cursor:saving?"not-allowed":"pointer", opacity:saving?0.7:1 }}>
            {saving?"Saving…":editing?"Save Changes":"Add Media"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete media" message={`Delete "${deleteTarget?.title}"?`} />
    </div>
  );
};

export default AdminMultimedia;
