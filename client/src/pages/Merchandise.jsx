import CategoryIcon from "../components/CategoryIcon.jsx";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ShoppingBag, Star, Search, Sparkles, Filter, ExternalLink } from "lucide-react";
import MerchCard from "../components/MerchCard.jsx";

const CATS = ["All", "Anime", "Gaming", "Movies", "TV Shows", "K-Pop", "Comics", "Manga", "Cosplay"];

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
    ? (search.trim() ? items.filter((i) => i.name?.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase())) : items)
    : [];

  return (
    <div>
      <div style={{
        background: "var(--gradient-hero)",
        padding: "60px 24px 44px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.15) 0%, transparent 70%)",
        }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 2,
              color: "#fff",
              marginBottom: 12,
              textTransform: "uppercase",
            }}
          >
            <Sparkles size={13} /> Official Collector Vault
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            style={{ margin: 0, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, color: "#fff", letterSpacing: -1 }}>
            Merchandise & Collectibles
          </motion.h1>
          <p style={{ color: "rgba(255,255,255,0.85)", marginTop: 10, fontSize: 16, maxWidth: 580, margin: "10px auto 0" }}>
            Figures · Replicas · Statues · Apparel · Limited Editions
          </p>
          <div style={{ position: "relative", maxWidth: 440, margin: "22px auto 0" }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.6)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search merchandise by title or universe…"
              style={{
                width: "100%",
                padding: "12px 14px 12px 40px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(12px)",
                color: "#fff",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28, paddingBottom: 80 }}>
        {/* Category filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                padding: "7px 16px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                border: `1px solid ${category === c ? "transparent" : "var(--border)"}`,
                background: category === c ? "var(--gradient)" : "var(--surface)",
                color: category === c ? "#fff" : "var(--text)",
                boxShadow: category === c ? "0 4px 14px rgba(219,39,119,0.35)" : "none",
                transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            >
              {c !== "All" && <CategoryIcon name={c} size={13} style={{ marginRight: 5 }} />}{c}
            </button>
          ))}
        </div>

        {/* Sort & Count Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-muted)" }}>
            Showing <span style={{ color: "var(--primary)", fontWeight: 900 }}>{filtered.length}</span> merchandise items
          </div>

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 12.5, color: "var(--text-muted)", fontWeight: 700, marginRight: 4 }}>Sort:</span>
            {SORTS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSort(s.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  border: `1px solid ${sort === s.value ? "var(--primary)" : "var(--border)"}`,
                  background: sort === s.value ? "rgba(219,39,119,0.15)" : "transparent",
                  color: sort === s.value ? "var(--primary)" : "var(--text-muted)",
                  transition: "all 0.15s",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 20 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 290,
                  borderRadius: 18,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  animation: "funkyPulse 1.5s infinite ease-in-out",
                }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding: 56, textAlign: "center", color: "var(--text-muted)" }}>
            <ShoppingBag size={48} style={{ marginBottom: 14, opacity: 0.35, color: "var(--primary)" }} />
            <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 8px", color: "var(--text)" }}>No merchandise found</h3>
            <p style={{ margin: "0 0 16px", fontSize: 13.5 }}>Try adjusting your search query or switching categories.</p>
            <button onClick={() => { setCat("All"); setSearch(""); }} className="btn" style={{ padding: "8px 18px", fontSize: 13 }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 20 }}
          >
            {filtered.map((item) => (
              <motion.div
                key={item._id}
                variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
              >
                <MerchCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Merchandise;
