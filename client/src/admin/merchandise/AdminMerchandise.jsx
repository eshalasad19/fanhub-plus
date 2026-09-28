import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ShoppingBag, Pencil, Trash2, Plus, Search, ExternalLink, Tag as TagIcon, DollarSign, Sparkles } from "lucide-react";
import PageHeader from "../shared/PageHeader.jsx";
import ConfirmDialog from "../shared/ConfirmDialog.jsx";
import Modal from "../shared/Modal.jsx";
import ImageUploadInput from "../shared/ImageUploadInput.jsx";

const CATS = ["Anime", "Gaming", "Movies", "TV Shows", "K-Pop", "Comics", "Manga", "Cosplay"];
const TAGS = ["Limited Edition", "Pre-Order", "Collectible", "New", "Trending"];

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--bg)",
  color: "var(--text)",
  fontSize: 13.5,
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const lbl = {
  fontSize: 12.5,
  fontWeight: 700,
  color: "var(--text-muted)",
  marginBottom: 6,
  display: "block",
};

const EMPTY = {
  name: "",
  category: "Anime",
  description: "",
  image: "",
  images: [],
  price: 29.99,
  tag: "New",
  stock: 15,
  isUpcoming: false,
  externalLink: "",
};

const TAG_COLORS = {
  "Limited Edition": "#ec4899",
  "Pre-Order": "#f59e0b",
  "Collectible": "#8b5cf6",
  "New": "#10b981",
  "Trending": "#06b6d4",
};

const AdminMerchandise = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
    if (search) params.search = search;
    axios
      .get("/api/admin/merchandise", { params })
      .then((r) => {
        const d = r.data;
        setItems(Array.isArray(d) ? d : d?.data || d?.items || []);
      })
      .catch((err) => {
        console.error("Failed to load admin merchandise:", err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [catFilter, tagFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setError(null);
    setFormOpen(true);
  };

  const openEdit = (m) => {
    setEditing(m);
    setForm({
      ...m,
      image: m.image || m.images?.[0] || "",
      images: m.images || (m.image ? [m.image] : []),
      price: m.price ?? 0,
      stock: m.stock ?? 10,
    });
    setError(null);
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      images: form.image ? [form.image] : (form.images || []),
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
    };

    try {
      if (editing) {
        await axios.put(`/api/admin/merchandise/${editing._id}`, payload);
      } else {
        await axios.post("/api/admin/merchandise", payload);
      }
      setFormOpen(false);
      load();
    } catch (err) {
      console.error("Save merch error:", err);
      setError(err.response?.data?.message || err.response?.data?.error || "Error saving merchandise item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/admin/merchandise/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } catch (err) {
      alert("Failed to delete merchandise item: " + (err.response?.data?.message || err.message));
    }
  };

  const set = (f) => (e) =>
    setForm((p) => ({
      ...p,
      [f]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const filteredItems = items.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.name?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      (typeof item.category === "object" ? item.category?.name : item.category)?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <PageHeader
        title="Merchandise Showcase"
        subtitle="Manage official collectibles, figures, apparel, and pre-orders."
        actionLabel="Add Merchandise"
        onAction={openCreate}
      />

      <div style={{ display: "flex", gap: 12, marginBottom: 22, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 380 }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search merchandise by title or keyword…"
            style={{ ...inputStyle, paddingLeft: 34 }}
          />
        </div>

        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          style={{ ...inputStyle, width: "auto" }}
        >
          <option value="">All Categories</option>
          {CATS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          style={{ ...inputStyle, width: "auto" }}
        >
          <option value="">All Tags</option>
          {TAGS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="card"
              style={{
                height: 260,
                opacity: 0.5,
                background: "var(--surface)",
                animation: "funkyPulse 1.5s infinite ease-in-out",
              }}
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>
          <ShoppingBag size={48} style={{ opacity: 0.35, marginBottom: 14 }} />
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 8px", color: "var(--text)" }}>
            No merchandise items found
          </h3>
          <p style={{ margin: "0 0 16px", fontSize: 13.5 }}>
            Add new merchandise or clear active filters to view all products.
          </p>
          <button onClick={openCreate} className="btn" style={{ padding: "8px 18px", fontSize: 13 }}>
            <Plus size={14} style={{ marginRight: 6 }} /> Add First Item
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 18 }}>
          <AnimatePresence>
            {filteredItems.map((m) => {
              const itemImg = m.image || m.images?.[0];
              const tagColor = TAG_COLORS[m.tag] || "#ec4899";
              const catName = typeof m.category === "object" ? m.category?.name : m.category;

              return (
                <motion.div
                  key={m._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -5, boxShadow: `0 14px 30px ${tagColor}25` }}
                  className="card"
                  style={{
                    padding: 0,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  <div style={{ position: "relative", height: 160, background: "var(--bg-soft)", overflow: "hidden" }}>
                    {itemImg ? (
                      <img
                        src={itemImg}
                        alt={m.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: "100%",
                          background: "linear-gradient(135deg,#ec4899,#8b5cf6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ShoppingBag size={44} color="#fff" />
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        padding: "3px 9px",
                        borderRadius: 999,
                        fontSize: 10.5,
                        fontWeight: 800,
                        background: "rgba(0,0,0,0.65)",
                        backdropFilter: "blur(6px)",
                        color: tagColor,
                        border: `1px solid ${tagColor}50`,
                      }}
                    >
                      {m.tag || "Merch"}
                    </div>
                    {m.price != null && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 10,
                          right: 10,
                          padding: "4px 10px",
                          borderRadius: 8,
                          fontSize: 12.5,
                          fontWeight: 900,
                          background: "var(--gradient)",
                          color: "#fff",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        }}
                      >
                        ${Number(m.price).toFixed(2)}
                      </div>
                    )}
                  </div>

                  <div style={{ padding: 14, display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4, lineHeight: 1.3 }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
                        {catName} {m.isUpcoming ? " · Upcoming" : ""} {m.stock != null ? ` · ${m.stock} in stock` : ""}
                      </div>
                      {m.description && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                            margin: "0 0 12px",
                            lineHeight: 1.4,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {m.description}
                        </p>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button
                        onClick={() => openEdit(m)}
                        style={{
                          flex: 1,
                          padding: "8px",
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          background: "var(--bg-soft)",
                          color: "var(--text)",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 5,
                        }}
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(m)}
                        style={{
                          padding: "8px 11px",
                          borderRadius: 8,
                          border: "none",
                          background: "rgba(239,68,68,0.12)",
                          color: "#ef4444",
                          cursor: "pointer",
                        }}
                        title="Delete item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit Merchandise Item" : "Add Merchandise Item"}
        width={520}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={lbl}>Item Name *</label>
            <input
              style={inputStyle}
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. Cyberpunk Katana Replica 1:1"
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={lbl}>Category *</label>
              <select style={inputStyle} value={form.category} onChange={set("category")}>
                {CATS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={lbl}>Showcase Tag</label>
              <select style={inputStyle} value={form.tag} onChange={set("tag")}>
                {TAGS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={lbl}>Price (USD $)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                style={inputStyle}
                value={form.price}
                onChange={set("price")}
                placeholder="49.99"
              />
            </div>
            <div>
              <label style={lbl}>Units in Stock</label>
              <input
                type="number"
                min="0"
                style={inputStyle}
                value={form.stock}
                onChange={set("stock")}
                placeholder="10"
              />
            </div>
          </div>

          <ImageUploadInput
            label="Merchandise Photo (Upload or Paste URL) *"
            value={form.image}
            onChange={(val) => setForm((p) => ({ ...p, image: val }))}
          />

          <div>
            <label style={lbl}>Description</label>
            <textarea
              style={{ ...inputStyle, minHeight: 75, resize: "vertical" }}
              value={form.description}
              onChange={set("description")}
              placeholder="Item material, scale, authentic collector details…"
            />
          </div>

          <div>
            <label style={lbl}>External Buy / Reference Link (optional)</label>
            <input
              style={inputStyle}
              value={form.externalLink}
              onChange={set("externalLink")}
              placeholder="https://store.example.com/item"
            />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={form.isUpcoming}
              onChange={set("isUpcoming")}
              style={{ accentColor: "var(--primary)" }}
            />
            Mark as Upcoming Release / Pre-Order Only
          </label>

          {error && (
            <div
              style={{
                color: "#ef4444",
                fontSize: 12.5,
                padding: "8px 12px",
                borderRadius: 8,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn"
            style={{
              padding: "12px",
              fontSize: 14,
              fontWeight: 800,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
              width: "100%",
            }}
          >
            {saving ? "Saving…" : editing ? "Save Changes" : "Create Merchandise Item"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Item"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default AdminMerchandise;
