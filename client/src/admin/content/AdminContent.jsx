import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Pencil, Trash2, Search, Eye, EyeOff } from "lucide-react";
import PageHeader from "../shared/PageHeader.jsx";
import Badge from "../shared/Badge.jsx";
import ConfirmDialog from "../shared/ConfirmDialog.jsx";
import Modal from "../shared/Modal.jsx";

const CATS = ["Anime","Gaming","Movies","TV Shows","K-Pop","Comics","Manga","Cosplay"];
const TYPES = ["article","video","audio","image","trailer"];
const inputStyle = { width:"100%", padding:"10px 12px", borderRadius:9, border:"1px solid var(--border)", background:"var(--bg)", color:"var(--text)", fontSize:13.5, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };
const label = { fontSize:12.5, fontWeight:600, color:"var(--text-muted)", marginBottom:6, display:"block" };
const EMPTY = { title:"", type:"article", category:"Anime", description:"", mediaUrl:"", thumbnail:"", tags:"", releaseYear:"", isPublished:false };

const iconBtn = (extra={}) => ({ width:28, height:28, borderRadius:8, border:"1px solid var(--border)", background:"var(--bg)", color:"var(--text)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, ...extra });

const AdminContent = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
    if (search) params.search = search;
    axios.get("/api/admin/content", { params }).then((r) => {
      const d = r.data; setItems(Array.isArray(d) ? d : d?.data || d?.items || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [catFilter, typeFilter]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(null); setFormOpen(true); };
  const openEdit = (c) => { setEditing(c); setForm({ ...c, tags: c.tags?.join(", ") || "", releaseYear: c.releaseYear || "" }); setError(null); setFormOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError(null);
    const payload = { ...form, tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [], releaseYear: form.releaseYear ? Number(form.releaseYear) : undefined };
    try {
      if (editing) await axios.put(`/api/admin/content/${editing._id}`, payload);
      else await axios.post("/api/admin/content", payload);
      setFormOpen(false); load();
    } catch (err) { setError(err.response?.data?.message || "Something went wrong"); }
    finally { setSaving(false); }
  };

  const togglePublish = async (c) => { await axios.put(`/api/admin/content/${c._id}`, { isPublished: !c.isPublished }); load(); };
  const handleDelete = async () => { await axios.delete(`/api/admin/content/${deleteTarget._id}`); setDeleteTarget(null); load(); };
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  return (
    <div>
      <PageHeader title="Content" subtitle="Manage all fandom content." actionLabel="Add Content" onAction={openCreate} />

      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
        <form onSubmit={(e) => { e.preventDefault(); load(); }} style={{ display:"flex", gap:8, flex:1, minWidth:200 }}>
          <div style={{ position:"relative", flex:1 }}>
            <Search size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-muted)" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search content…" style={{ ...inputStyle, padding:"9px 12px 9px 30px" }} />
          </div>
          <button type="submit" style={{ padding:"9px 14px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#8b5cf6,#6d28d9)", color:"#fff", fontWeight:700, cursor:"pointer" }}>Go</button>
        </form>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={{ ...inputStyle, width:"auto", flex:"none" }}>
          <option value="">All Categories</option>{CATS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ ...inputStyle, width:"auto", flex:"none" }}>
          <option value="">All Types</option>{TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      {loading ? <p style={{ color:"var(--text-muted)" }}>Loading…</p> : items.length === 0 ? (
        <div className="card" style={{ padding:40, textAlign:"center", color:"var(--text-muted)" }}>No content found.</div>
      ) : (
        <div className="card" style={{ padding:0, overflow:"hidden" }}>
          {items.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ display:"flex", gap:12, alignItems:"center", padding:"13px 18px", borderBottom:i<items.length-1?"1px solid var(--border)":"none" }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:13.5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.title}</div>
                <div style={{ fontSize:11.5, color:"var(--text-muted)", marginTop:2 }}>
                  {typeof c.category === "object" ? c.category?.name : c.category} · {c.type} {c.releaseYear ? `· ${c.releaseYear}` : ""}
                </div>
              </div>
              <span style={{ padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:700, background:c.isPublished?"rgba(16,185,129,0.12)":"rgba(245,158,11,0.12)", color:c.isPublished?"#10b981":"#f59e0b" }}>{c.isPublished?"Published":"Draft"}</span>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={() => togglePublish(c)} title={c.isPublished?"Unpublish":"Publish"} style={iconBtn({ color:c.isPublished?"#f59e0b":"#10b981" })}>{c.isPublished?<EyeOff size={12}/>:<Eye size={12}/>}</button>
                <button onClick={() => openEdit(c)} style={iconBtn()}><Pencil size={12}/></button>
                <button onClick={() => setDeleteTarget(c)} style={iconBtn({ color:"#ef4444" })}><Trash2 size={12}/></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing?"Edit Content":"Add Content"} width={520}>
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:13 }}>
          <div><label style={label}>Title</label><input style={inputStyle} value={form.title} onChange={set("title")} required /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={label}>Type</label>
              <select style={inputStyle} value={form.type} onChange={set("type")}>{TYPES.map((t)=><option key={t}>{t}</option>)}</select></div>
            <div><label style={label}>Category</label>
              <select style={inputStyle} value={form.category} onChange={set("category")}>{CATS.map((c)=><option key={c}>{c}</option>)}</select></div>
          </div>
          <div><label style={label}>Description</label><textarea style={{ ...inputStyle, minHeight:70, resize:"vertical" }} value={form.description} onChange={set("description")} /></div>
          <div><label style={label}>Media URL</label><input style={inputStyle} value={form.mediaUrl} onChange={set("mediaUrl")} placeholder="https://…" /></div>
          <div><label style={label}>Thumbnail URL</label><input style={inputStyle} value={form.thumbnail} onChange={set("thumbnail")} placeholder="https://…" /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={label}>Tags (comma separated)</label><input style={inputStyle} value={form.tags} onChange={set("tags")} placeholder="action, adventure…" /></div>
            <div><label style={label}>Release Year</label><input type="number" style={inputStyle} value={form.releaseYear} onChange={set("releaseYear")} placeholder="2024" /></div>
          </div>
          <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:13.5, cursor:"pointer" }}>
            <input type="checkbox" checked={form.isPublished} onChange={set("isPublished")} /> Publish immediately
          </label>
          {error && <p style={{ color:"#ef4444", fontSize:12.5, margin:0 }}>{error}</p>}
          <button type="submit" disabled={saving} style={{ padding:"11px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#8b5cf6,#6d28d9)", color:"#fff", fontSize:14, fontWeight:700, cursor:saving?"not-allowed":"pointer", opacity:saving?0.7:1 }}>
            {saving?"Saving…":editing?"Save Changes":"Add Content"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete content" message={`Delete "${deleteTarget?.title}"? This cannot be undone.`} />
    </div>
  );
};

export default AdminContent;
