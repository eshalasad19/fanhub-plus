import CategoryIcon from "../components/CategoryIcon.jsx";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Play, Music, Film, Clock } from "lucide-react";

const CATS = ["All","Anime","Gaming","Movies","TV Shows","K-Pop","Comics","Manga","Cosplay"];
const TYPES = ["All","video","trailer","audio","podcast","soundtrack"];


const TYPE_COLORS = { video:"#8b5cf6", trailer:"#ec4899", audio:"#10b981", podcast:"#f59e0b", soundtrack:"#06b6d4" };

const Multimedia = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCat]    = useState("All");
  const [type, setType]       = useState("All");
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== "All") params.category = category;
    if (type !== "All")     params.mediaType = type;
    axios.get("/api/media", { params })
      .then((r) => {
        const raw = r.data;
        setItems(Array.isArray(raw) ? raw : raw?.data || raw?.items || []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [category, type]);

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#1a0533,#4a1d96,#7c3aed)", padding: "48px 24px 36px", textAlign: "center" }}>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ margin: 0, fontSize: 34, fontWeight: 900, color: "#fff" }}>
          Multimedia Center
        </motion.h1>
        <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 8, fontSize: 15 }}>
          Videos · Trailers · Audio · Podcasts · Soundtracks
        </p>
      </div>

      <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
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

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
          {TYPES.map((t) => (
            <button key={t} onClick={() => setType(t)} style={{
              padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${type === t ? TYPE_COLORS[t] || "var(--border)" : "var(--border)"}`,
              background: type === t ? `${TYPE_COLORS[t] || "#8b5cf6"}18` : "transparent",
              color: type === t ? TYPE_COLORS[t] || "#8b5cf6" : "var(--text-muted)",
              textTransform: "capitalize", display: "flex", alignItems: "center", gap: 5,
            }}>
              {null && <span>{null}</span>}{t}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={i} animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }}
                style={{ height: 220, borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)" }} />
            ))}
          </div>
        ) : !Array.isArray(items) || items.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 40, marginBottom: 12, display: "flex", justifyContent: "center" }}><Film size={36} color="var(--text-muted)" /></div>
            No media found.
          </div>
        ) : (
          <motion.div initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
            {items.map((media) => (
              <motion.div key={media._id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                <motion.div whileHover={{ y: -4 }} className="card" style={{ padding: 0, overflow: "hidden" }}>
                  <div style={{ position: "relative" }}>
                    {media.thumbnail
                      ? <img src={media.thumbnail} alt={media.title} style={{ width: "100%", height: 160, objectFit: "cover" }} onError={(e) => (e.target.style.display = "none")} />
                      : <div style={{ height: 160, background: "linear-gradient(135deg,#1a0533,#4a1d96)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
                          <Film size={18} />
                        </div>
                    }
                    {(media.mediaType === "video" || media.mediaType === "trailer") && (
                      <a href={media.url} target="_blank" rel="noreferrer"
                        style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)", textDecoration: "none" }}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(139,92,246,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Play size={20} style={{ color: "#fff", marginLeft: 3 }} fill="#fff" />
                        </div>
                      </a>
                    )}
                    <span style={{
                      position: "absolute", top: 10, left: 10,
                      padding: "3px 9px", borderRadius: 999, fontSize: 10.5, fontWeight: 700,
                      background: `${TYPE_COLORS[media.mediaType] || "#8b5cf6"}dd`,
                      color: "#fff", textTransform: "capitalize",
                    }}>{media.mediaType}</span>
                  </div>
                  <div style={{ padding: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{media.title}</div>
                    {media.duration && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-muted)" }}>
                        <Clock size={11} /> {media.duration}
                      </div>
                    )}
                    {(media.mediaType === "audio" || media.mediaType === "podcast" || media.mediaType === "soundtrack") && media.url && (
                      <a href={media.url} target="_blank" rel="noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, fontSize: 12.5, color: "#8b5cf6", fontWeight: 600, textDecoration: "none" }}>
                        <Music size={12} /> Listen
                      </a>
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

export default Multimedia;
