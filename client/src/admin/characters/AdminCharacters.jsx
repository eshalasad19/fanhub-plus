import { UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Pencil, Trash2, Search } from "lucide-react";
import PageHeader from "../shared/PageHeader.jsx";
import ConfirmDialog from "../shared/ConfirmDialog.jsx";
import Modal from "../shared/Modal.jsx";

const CATS = ["Anime","Gaming","Movies","TV Shows","K-Pop","Comics","Manga","Cosplay"];
const inputStyle = { width:"100%", padding:"10px 12px", borderRadius:9, border:"1px solid var(--border)", background:"var(--bg)", color:"var(--text)", fontSize:13.5, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };
const lbl = { fontSize:12.5, fontWeight:600, color:"var(--text-muted)", marginBottom:6, display:"block" };
const EMPTY = { name:"", category:"Anime", bio:"", image:"", series:"", tags:"" };

const AdminCharacters = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
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
    if (search) params.search = search;
    axios.get("/api/admin/characters", { params }).then((r) => {
      const d = r.data; setItems(Array.isArray(d) ? d : d?.data || d?.items || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [catFilter]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(null); setFormOpen(true); };
  const openEdit = (c) => { setEditing(c); setForm({ ...c, tags: c.tags?.join(", ") || "" }); setError(null); setFormOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError(null);
    const payload = { ...form, tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [] };
    try {
      if (editing) await axios.put(`/api/admin/characters/${editing._id}`, payload);
      else await axios.post("/api/admin/characters", payload);
      setFormOpen(false); load();
    } catch (err) { setError(err.response?.data?.message || "Error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => { await axios.delete(`/api/admin/characters/${deleteTarget._id}`); setDeleteTarget(null); load(); };
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  return (
    <div>
      <PageHeader title="Characters" subtitle="Manage fandom character profiles." actionLabel="Add Character" onAction={openCreate} />

      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap" }}>
        <form onSubmit={(e)=>{e.preventDefault();load();}} style={{ display:"flex", gap:8, flex:1, minWidth:200 }}>
          <div style={{ position:"relative", flex:1 }}><Search size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-muted)" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search characters…" style={{ ...inputStyle, padding:"9px 12px 9px 30px" }} /></div>
          <button type="submit" style={{ padding:"9px 14px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#8b5cf6,#6d28d9)", color:"#fff", fontWeight:700, cursor:"pointer" }}>Go</button>
        </form>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={{ ...inputStyle, width:"auto", flex:"none" }}>
          <option value="">All Categories</option>{CATS.map((c)=><option key={c}>{c}</option>)}
        </select>
      </div>

      {loading ? <p style={{ color:"var(--text-muted)" }}>Loading…</p> : items.length === 0 ? (
        <div className="card" style={{ padding:40, textAlign:"center", color:"var(--text-muted)" }}>No characters found.</div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:14 }}>
          {items.map((c) => (
            <motion.div key={c._id} whileHover={{ y:-3 }} className="card" style={{ padding:16 }}>
              {c.image ? <img src={c.image} alt={c.name} style={{ width:"100%", height:120, objectFit:"cover", borderRadius:10, marginBottom:10 }} onError={(e)=>{e.target.style.display="none"}} />
                : <div style={{ width:"100%", height:120, borderRadius:10, background:"linear-gradient(135deg,#4c1d95,#7c3aed)", marginBottom:10, display:"flex", alignItems:"center", justifyContent:"center" }}><UserCheck size={32} color="#fff" /></div>}
              <div style={{ fontWeight:700, fontSize:14 }}>{c.name}</div>
              <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:3 }}>{typeof c.category === "object" ? c.category?.name : c.category}{c.series ? ` · ${c.series}` : ""}</div>
              <p style={{ fontSize:12.5, color:"var(--text-muted)", margin:"8px 0 12px", lineHeight:1.5, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{c.bio || "No bio."}</p>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => openEdit(c)} style={{ flex:1, padding:"7px", borderRadius:8, border:"1px solid var(--border)", background:"var(--bg)", color:"var(--text)", cursor:"pointer", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}><Pencil size={11}/> Edit</button>
                <button onClick={() => setDeleteTarget(c)} style={{ padding:"7px 10px", borderRadius:8, border:"none", background:"rgba(239,68,68,0.1)", color:"#ef4444", cursor:"pointer" }}><Trash2 size={13}/></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing?"Edit Character":"Add Character"} width={480}>
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:13 }}>
          <div><label style={lbl}>Name</label><input style={inputStyle} value={form.name} onChange={set("name")} required /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={lbl}>Category</label><select style={inputStyle} value={form.category} onChange={set("category")}>{CATS.map((c)=><option key={c}>{c}</option>)}</select></div>
            <div><label style={lbl}>Series / Show</label><input style={inputStyle} value={form.series} onChange={set("series")} placeholder="e.g. One Piece" /></div>
          </div>
          <div><label style={lbl}>Biography</label><textarea style={{ ...inputStyle, minHeight:80, resize:"vertical" }} value={form.bio} onChange={set("bio")} /></div>
          <div><label style={lbl}>Image URL</label><input style={inputStyle} value={form.image} onChange={set("image")} placeholder="https://…" /></div>
          <div><label style={lbl}>Tags (comma separated)</label><input style={inputStyle} value={form.tags} onChange={set("tags")} placeholder="hero, shounen…" /></div>
          {error && <p style={{ color:"#ef4444", fontSize:12.5, margin:0 }}>{error}</p>}
          <button type="submit" disabled={saving} style={{ padding:"11px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#8b5cf6,#6d28d9)", color:"#fff", fontSize:14, fontWeight:700, cursor:saving?"not-allowed":"pointer", opacity:saving?0.7:1 }}>
            {saving?"Saving…":editing?"Save Changes":"Add Character"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete character" message={`Delete "${deleteTarget?.name}"?`} />
    </div>
  );
};

export default AdminCharacters;
