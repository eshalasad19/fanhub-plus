import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import PageHeader from "../shared/PageHeader.jsx";
import ConfirmDialog from "../shared/ConfirmDialog.jsx";
import Modal from "../shared/Modal.jsx";

const CATS = ["Anime","Gaming","Movies","TV Shows","K-Pop","Comics","Manga","Cosplay"];
const TAGS = ["Limited Edition","Pre-Order","Collectible","New","Trending"];
const inputStyle = { width:"100%", padding:"10px 12px", borderRadius:9, border:"1px solid var(--border)", background:"var(--bg)", color:"var(--text)", fontSize:13.5, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };
const lbl = { fontSize:12.5, fontWeight:600, color:"var(--text-muted)", marginBottom:6, display:"block" };
const EMPTY = { name:"", category:"Anime", description:"", image:"", tag:"New", isUpcoming:false, externalLink:"" };

const TAG_COLORS = { "Limited Edition":"#ef4444", "Pre-Order":"#f59e0b", "Collectible":"#8b5cf6", "New":"#10b981", "Trending":"#06b6d4" };

const AdminMerchandise = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
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
    if (tagFilter) params.tag = tagFilter;
    axios.get("/api/admin/merchandise", { params }).then((r) => {
      const d = r.data; setItems(Array.isArray(d) ? d : d?.data || d?.items || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [catFilter, tagFilter]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(null); setFormOpen(true); };
  const openEdit = (m) => { setEditing(m); setForm({ ...m }); setError(null); setFormOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError(null);
    try {
      if (editing) await axios.put(`/api/admin/merchandise/${editing._id}`, form);
      else await axios.post("/api/admin/merchandise", form);
      setFormOpen(false); load();
    } catch (err) { setError(err.response?.data?.message || "Error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => { await axios.delete(`/api/admin/merchandise/${deleteTarget._id}`); setDeleteTarget(null); load(); };
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  return (
    <div>
      <PageHeader title="Merchandise" subtitle="Manage fandom merchandise showcase." actionLabel="Add Item" onAction={openCreate} />

      <div style={{ display:"flex", gap:10, marginBottom:18 }}>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={{ ...inputStyle, width:"auto" }}>
          <option value="">All Categories</option>{CATS.map((c)=><option key={c}>{c}</option>)}
        </select>
        <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} style={{ ...inputStyle, width:"auto" }}>
          <option value="">All Tags</option>{TAGS.map((t)=><option key={t}>{t}</option>)}
        </select>
      </div>

      {loading ? <p style={{ color:"var(--text-muted)" }}>Loading…</p> : items.length === 0 ? (
        <div className="card" style={{ padding:40, textAlign:"center", color:"var(--text-muted)" }}>No merchandise found.</div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:14 }}>
          {items.map((m) => (
            <motion.div key={m._id} whileHover={{ y:-3 }} className="card" style={{ padding:0, overflow:"hidden" }}>
              {m.image ? <img src={m.image} alt={m.name} style={{ width:"100%", height:150, objectFit:"cover" }} onError={(e)=>{e.target.style.display="none"}} />
                : <div style={{ height:150, background:"linear-gradient(135deg,#451a03,#92400e)", display:"flex", alignItems:"center", justifyContent:"center" }}><ShoppingBag size={40} color="#fff" /></div>}
              <div style={{ padding:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:6 }}>
                  <div style={{ fontWeight:700, fontSize:13.5 }}>{m.name}</div>
                  <span style={{ padding:"3px 8px", borderRadius:999, fontSize:10.5, fontWeight:800, background:`${TAG_COLORS[m.tag]||"#6b7280"}20`, color:TAG_COLORS[m.tag]||"#6b7280", flexShrink:0 }}>{m.tag}</span>
                </div>
                <div style={{ fontSize:12, color:"var(--text-muted)", marginBottom:8 }}>{m.category}{m.isUpcoming ? " · Upcoming" : ""}</div>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => openEdit(m)} style={{ flex:1, padding:"7px", borderRadius:8, border:"1px solid var(--border)", background:"var(--bg)", color:"var(--text)", cursor:"pointer", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}><Pencil size={11}/> Edit</button>
                  <button onClick={() => setDeleteTarget(m)} style={{ padding:"7px 10px", borderRadius:8, border:"none", background:"rgba(239,68,68,0.1)", color:"#ef4444", cursor:"pointer" }}><Trash2 size={13}/></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing?"Edit Item":"Add Merchandise"} width={480}>
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:13 }}>
          <div><label style={lbl}>Name</label><input style={inputStyle} value={form.name} onChange={set("name")} required /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={lbl}>Category</label><select style={inputStyle} value={form.category} onChange={set("category")}>{CATS.map((c)=><option key={c}>{c}</option>)}</select></div>
            <div><label style={lbl}>Tag</label><select style={inputStyle} value={form.tag} onChange={set("tag")}>{TAGS.map((t)=><option key={t}>{t}</option>)}</select></div>
          </div>
          <div><label style={lbl}>Description</label><textarea style={{ ...inputStyle, minHeight:70, resize:"vertical" }} value={form.description} onChange={set("description")} /></div>
          <div><label style={lbl}>Image URL</label><input style={inputStyle} value={form.image} onChange={set("image")} placeholder="https://…" /></div>
          <div><label style={lbl}>External Link (optional)</label><input style={inputStyle} value={form.externalLink} onChange={set("externalLink")} placeholder="https://…" /></div>
          <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:13.5, cursor:"pointer" }}>
            <input type="checkbox" checked={form.isUpcoming} onChange={set("isUpcoming")} /> Mark as upcoming release
          </label>
          {error && <p style={{ color:"#ef4444", fontSize:12.5, margin:0 }}>{error}</p>}
          <button type="submit" disabled={saving} style={{ padding:"11px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#8b5cf6,#6d28d9)", color:"#fff", fontSize:14, fontWeight:700, cursor:saving?"not-allowed":"pointer", opacity:saving?0.7:1 }}>
            {saving?"Saving…":editing?"Save Changes":"Add Item"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete item" message={`Delete "${deleteTarget?.name}"?`} />
    </div>
  );
};

export default AdminMerchandise;
