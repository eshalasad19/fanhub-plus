import CategoryIcon from "../components/CategoryIcon.jsx";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ShoppingBag, Star, Search } from "lucide-react";

const CATS = ["All","Anime","Gaming","Movies","TV Shows","K-Pop","Comics","Manga","Cosplay"];

const SORTS = [
  { label: "Latest",    value: "-createdAt" },
  { label: "Top Rated", value: "-ratingAvg" },
  { label: "Price ↑",   value: "price" },
  { label: "Price ↓",   value: "-price" },
];

const Merchandise = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [category, setCat]    = useState("All");
  const [sort, setSort]       = useState("-createdAt");

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== "All") params.category = category;
    if (sort)               params.sort = sort;
    axios.get("/api/merchandise", { params })
      .then((r) => {
        const raw = r.data;
        setItems(Array.isArray(raw) ? raw : raw?.data || raw?.items || []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [category, sort]);

  const filtered = Array.isArray(items)
    ? (search.trim() ? items.filter((i) => i.name?.toLowerCase().includes(search.toLowerCase())) : items)
    : [];

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#431407,#9a3412,#f97316)", padding: "48px 24px 36px", textAlign: "center" }}>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ margin: 0, fontSize: 34, fontWeight: 900, color: "#fff" }}>
          Merchandise
        </motion.h1>
        <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 8, fontSize: 15 }}>
          Figures · Posters · Apparel · Collectibles · More
        </p>
        <div style={{ position: "relative", maxWidth: 400, margin: "18px auto 0" }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.5)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search merchandise…"
            style={{ width: "100%", padding: "9px 12px 9px 34px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 13.5, outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>

      <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: "6px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${category === c ? "transparent" : "var(--border)"}`,
              background: category === c ? "linear-gradient(135deg,#f97316,#ea580c)" : "var(--surface)",
              color: category === c ? "#fff" : "var(--text)",
            }}>
              {c !== "All" && <CategoryIcon name={c} size={13} style={{ marginRight: 4 }} />}{c}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 22, alignItems: "center" }}>
          <span style={{ fontSize: 12.5, color: "var(--text-muted)", fontWeight: 700 }}>Sort:</span>
          {SORTS.map((s) => (
            <button key={s.value} onClick={() => setSort(s.value)} style={{
              padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${sort === s.value ? "#f97316" : "var(--border)"}`,
              background: sort === s.value ? "rgba(249,115,22,0.12)" : "transparent",
              color: sort === s.value ? "#f97316" : "var(--text-muted)",
            }}>{s.label}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div key={i} animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }}
                style={{ height: 300, borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>
            <ShoppingBag size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <div>No merchandise found.</div>
          </div>
        ) : (
          <motion.div initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
            {filtered.map((item) => (
              <motion.div key={item._id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                <motion.div whileHover={{ y: -5, boxShadow: "0 14px 36px rgba(249,115,22,0.18)" }}
                  className="card" style={{ padding: 0, overflow: "hidden" }}>
                  {item.images?.[0]
                    ? <img src={item.images[0]} alt={item.name} style={{ width: "100%", height: 200, objectFit: "cover" }} onError={(e) => (e.target.style.display = "none")} />
                    : <div style={{ height: 200, background: "linear-gradient(135deg,#431407,#9a3412)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}><ShoppingBag size={48} color="#fff" /></div>
                  }
                  <div style={{ padding: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 4 }}>{item.name}</div>
                    {item.description && (
                      <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "0 0 10px", lineHeight: 1.5,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {item.description}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {item.price != null && (
                        <span style={{ fontSize: 16, fontWeight: 900, color: "#f97316" }}>
                          ${item.price.toFixed(2)}
                        </span>
                      )}
                      {item.ratingAvg > 0 && (
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12.5, color: "#f59e0b" }}>
                          <Star size={12} fill="#f59e0b" /> {item.ratingAvg.toFixed(1)}
                        </span>
                      )}
                    </div>
                    {item.stock === 0 && (
                      <div style={{ marginTop: 8, fontSize: 11.5, fontWeight: 700, color: "#ef4444" }}>Out of Stock</div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Merchandise;
