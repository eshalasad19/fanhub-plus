import CategoryIcon from "../components/CategoryIcon.jsx";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search, Filter, Star, TrendingUp } from "lucide-react";

const CATS = ["All","Anime","Gaming","Movies","TV Shows","K-Pop","Comics","Manga","Cosplay"];
const TYPES = ["All","anime","game","movie","tv","kpop","comic","manga","cosplay"];
const SORTS = [
  { label: "Latest",      value: "-createdAt" },
  { label: "Popular",     value: "-popularity" },
  { label: "Top Rated",   value: "-ratingAvg"  },
  { label: "Alphabetical",value: "title"       },
];
const STATUS = ["All","ongoing","completed","upcoming"];


const inputStyle = {
  padding: "9px 12px", borderRadius: 10, border: "1px solid var(--border)",
  background: "var(--surface)", color: "var(--text)", fontSize: 13.5,
  outline: "none", fontFamily: "inherit",
};

const Explore = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [category, setCat]    = useState("All");
  const [sort, setSort]       = useState("-createdAt");
  const [status, setStatus]   = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search)            params.search   = search;
    if (category !== "All") params.category = category;
    if (status !== "All")   params.status   = status;
    if (sort)               params.sort     = sort;
    axios.get("/api/content", { params })
      .then((r) => {
        const raw = r.data;
        setItems(Array.isArray(raw) ? raw : raw?.data || raw?.items || []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [category, sort, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    const params = { search, sort };
    if (category !== "All") params.category = category;
    axios.get("/api/content", { params })
      .then((r) => setItems(r.data?.data || r.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#4c1d95,#6d28d9,#a855f7)", padding: "52px 24px 40px", textAlign: "center" }}>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ margin: 0, fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>
          Explore Fandoms
        </motion.h1>
        <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 10, fontSize: 16 }}>
          Anime · Gaming · Movies · TV · K-Pop · Comics · Manga · Cosplay
        </p>

        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, maxWidth: 520, margin: "20px auto 0", justifyContent: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.5)" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search titles, genres…"
              style={{ ...inputStyle, paddingLeft: 34, width: "100%", background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", boxSizing: "border-box" }} />
          </div>
          <button type="submit" style={{ padding: "9px 20px", borderRadius: 10, border: "none", background: "#fff", color: "#6d28d9", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
            Search
          </button>
          <button type="button" onClick={() => setShowFilters((f) => !f)}
            style={{ padding: "9px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "#fff", cursor: "pointer" }}>
            <Filter size={15} />
          </button>
        </form>
      </div>

      <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: "6px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${category === c ? "transparent" : "var(--border)"}`,
              background: category === c ? "linear-gradient(135deg,#8b5cf6,#6d28d9)" : "var(--surface)",
              color: category === c ? "#fff" : "var(--text)",
            }}>
              {c !== "All" && <CategoryIcon name={c} size={13} style={{ marginRight: 4 }} />}{c}
            </button>
          ))}
        </div>

        {showFilters && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18, padding: "14px 18px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-muted)" }}>Sort:</span>
              {SORTS.map((s) => (
                <button key={s.value} onClick={() => setSort(s.value)} style={{
                  padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: "pointer",
                  border: `1px solid ${sort === s.value ? "transparent" : "var(--border)"}`,
                  background: sort === s.value ? "#8b5cf6" : "transparent",
                  color: sort === s.value ? "#fff" : "var(--text-muted)",
                }}>{s.label}</button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-muted)" }}>Status:</span>
              {STATUS.map((s) => (
                <button key={s} onClick={() => setStatus(s)} style={{
                  padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: "pointer",
                  border: `1px solid ${status === s ? "transparent" : "var(--border)"}`,
                  background: status === s ? "#6d28d9" : "transparent",
                  color: status === s ? "#fff" : "var(--text-muted)",
                  textTransform: "capitalize",
                }}>{s}</button>
              ))}
            </div>
          </motion.div>
        )}

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div key={i} animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }}
                style={{ height: 280, borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)" }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 40, marginBottom: 12, display: "flex", justifyContent: "center" }}><Search size={36} color="var(--text-muted)" /></div>
            No content found. Try different filters.
          </div>
        ) : (
          <motion.div
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}
          >
            {items.map((item) => <ContentCard key={item._id} item={item} />)}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const ContentCard = ({ item }) => (
  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
    <motion.div whileHover={{ y: -4, boxShadow: "0 14px 36px rgba(139,92,246,0.2)" }} className="card"
      style={{ padding: 0, overflow: "hidden", cursor: "pointer" }}>
      {item.coverImage
        ? <img src={item.coverImage} alt={item.title} style={{ width: "100%", height: 160, objectFit: "cover" }} onError={(e) => (e.target.style.display = "none")} />
        : <div style={{ height: 160, background: "linear-gradient(135deg,#4c1d95,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42 }}>
            <Sparkles size={16} />
          </div>
      }
      <div style={{ padding: 14 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10.5, fontWeight: 700, background: "rgba(139,92,246,0.15)", color: "#8b5cf6", textTransform: "capitalize" }}>
            {item.contentType}
          </span>
          {item.status && item.status !== "completed" && (
            <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10.5, fontWeight: 700,
              background: item.status === "ongoing" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
              color: item.status === "ongoing" ? "#10b981" : "#f59e0b", textTransform: "capitalize" }}>
              {item.status}
            </span>
          )}
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
        {item.releaseYear && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.releaseYear}</div>}
        {item.ratingAvg > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, fontSize: 12, color: "#f59e0b" }}>
            <Star size={11} fill="#f59e0b" /> {item.ratingAvg.toFixed(1)}
          </div>
        )}
      </div>
    </motion.div>
  </motion.div>
);

export default Explore;
