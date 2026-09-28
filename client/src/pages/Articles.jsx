import CategoryIcon from "../components/CategoryIcon.jsx";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { Calendar, Search, BookOpen } from "lucide-react";

const CATS = ["All","Anime","Gaming","Movies","TV Shows","K-Pop","Comics","Manga","Cosplay"];


const Articles = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [category, setCat]    = useState("All");

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== "All") params.category = category;
    axios.get("/api/articles", { params })
      .then((r) => {
        const raw = r.data;
        setItems(Array.isArray(raw) ? raw : raw?.data || raw?.items || []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [category]);

  const filtered = Array.isArray(items)
    ? (search.trim() ? items.filter((i) => i.title?.toLowerCase().includes(search.toLowerCase())) : items)
    : [];

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1,#0ea5e9)", padding: "48px 24px 36px", textAlign: "center" }}>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ margin: 0, fontSize: 34, fontWeight: 900, color: "#fff" }}>
          Featured Articles
        </motion.h1>
        <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 8, fontSize: 15 }}>
          Deep dives, news, reviews and stories from the fandom world
        </p>
        <div style={{ position: "relative", maxWidth: 420, margin: "18px auto 0" }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.5)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles…"
            style={{ width: "100%", padding: "9px 12px 9px 34px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 13.5, outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>

      <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: "6px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${category === c ? "transparent" : "var(--border)"}`,
              background: category === c ? "linear-gradient(135deg,#0369a1,#0ea5e9)" : "var(--surface)",
              color: category === c ? "#fff" : "var(--text)",
            }}>
              {c !== "All" && <CategoryIcon name={c} size={13} style={{ marginRight: 4 }} />}{c}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div key={i} animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }}
                style={{ height: 120, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>
            <BookOpen size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <div>No articles found.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((article, i) => (
              <motion.div key={article._id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <motion.div whileHover={{ y: -3, boxShadow: "0 8px 28px rgba(3,105,161,0.15)" }}
                  className="card" style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: 18 }}>
                  {article.coverImage
                    ? <img src={article.coverImage} alt={article.title}
                        style={{ width: 110, height: 80, objectFit: "cover", borderRadius: 10, flexShrink: 0 }}
                        onError={(e) => (e.target.style.display = "none")} />
                    : <div style={{ width: 110, height: 80, borderRadius: 10, flexShrink: 0, background: "linear-gradient(135deg,#0c4a6e,#0369a1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}><FileText size={24} color="#fff" /></div>
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15.5, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{article.title}</div>
                    {article.body && (
                      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 10px", lineHeight: 1.5,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {article.body?.replace(/<[^>]*>/g, "").slice(0, 160)}…
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "var(--text-muted)" }}>
                      {article.publishedAt && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Calendar size={11} /> {new Date(article.publishedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                        </span>
                      )}
                      {article.timeline?.length > 0 && (
                        <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10.5, fontWeight: 700, background: "rgba(14,165,233,0.12)", color: "#0ea5e9" }}>
                          Timeline
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
