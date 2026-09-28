import CategoryIcon from "../components/CategoryIcon.jsx";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Calendar, Clock, Rocket } from "lucide-react";

const CATS = ["All","Anime","Gaming","Movies","TV Shows","K-Pop","Comics","Manga","Cosplay"];
const TYPES = ["All","anime","game","movie","tv","comic","manga","merchandise"];


const TYPE_COLORS = { anime:"#a78bfa", game:"#60a5fa", movie:"#f472b6", tv:"#34d399", comic:"#f87171", manga:"#4ade80", merchandise:"#fb923c" };


const groupByMonth = (items) => {
  const groups = {};
  items.forEach((r) => {
    const key = new Date(r.releaseDate).toLocaleDateString(undefined, { month: "long", year: "numeric" });
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  });
  return Object.entries(groups);
};

const isUpcoming = (date) => new Date(date) >= new Date();

const Releases = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCat]    = useState("All");
  const [type, setType]       = useState("All");
  const [view, setView]       = useState("upcoming"); 

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== "All")  params.category    = category;
    if (type !== "All")      params.releaseType  = type;
    if (view === "upcoming") params.upcoming     = "true";
    axios.get("/api/releases", { params })
      .then((r) => {
        const raw = r.data;
        setItems(Array.isArray(raw) ? raw : raw?.items || raw?.data || []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [category, type, view]);

  const grouped = groupByMonth(items);

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#064e3b,#065f46,#10b981)", padding: "48px 24px 36px", textAlign: "center" }}>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ margin: 0, fontSize: 34, fontWeight: 900, color: "#fff" }}>
          Upcoming Releases
        </motion.h1>
        <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 8, fontSize: 15 }}>
          Anime · Games · Movies · TV Shows · Comics · Manga · Merchandise
        </p>
      </div>

      <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[{ label: "Upcoming", value: "upcoming" }, { label: "All Releases", value: "all" }].map((v) => (
            <button key={v.value} onClick={() => setView(v.value)} style={{
              padding: "7px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${view === v.value ? "transparent" : "var(--border)"}`,
              background: view === v.value ? "linear-gradient(135deg,#10b981,#059669)" : "var(--surface)",
              color: view === v.value ? "#fff" : "var(--text)",
            }}>{v.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: "6px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${category === c ? "transparent" : "var(--border)"}`,
              background: category === c ? "linear-gradient(135deg,#10b981,#059669)" : "var(--surface)",
              color: category === c ? "#fff" : "var(--text)",
            }}>
              {c !== "All" && <CategoryIcon name={c} size={13} style={{ marginRight: 4 }} />}{c}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {TYPES.map((t) => (
            <button key={t} onClick={() => setType(t)} style={{
              padding: "5px 13px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${type === t ? TYPE_COLORS[t] || "#10b981" : "var(--border)"}`,
              background: type === t ? `${TYPE_COLORS[t] || "#10b981"}18` : "transparent",
              color: type === t ? TYPE_COLORS[t] || "#10b981" : "var(--text-muted)",
              textTransform: "capitalize", display: "flex", alignItems: "center", gap: 4,
            }}>
              {null && <span>{null}</span>}{t}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {[1, 2].map((g) => (
              <div key={g}>
                <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }}
                  style={{ width: 160, height: 16, borderRadius: 6, background: "var(--border)", marginBottom: 14 }} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
                  {[1, 2, 3].map((i) => (
                    <motion.div key={i} animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.1 }}
                      style={{ height: 110, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)" }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="card" style={{ padding: 52, textAlign: "center", color: "var(--text-muted)" }}>
            <Rocket size={42} style={{ marginBottom: 14, opacity: 0.35 }} />
            <div style={{ fontSize: 15, fontWeight: 600 }}>No releases found</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Try switching to "All Releases" or changing filters.</div>
          </div>
        ) : grouped.length === 0 ? null : (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {grouped.map(([month, releases]) => (
              <div key={month}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  <span style={{ fontSize: 12.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: "#10b981", padding: "4px 14px", borderRadius: 999, border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)" }}>
                    {month}
                  </span>
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
                  {releases.map((release, i) => (
                    <motion.div key={release._id}
                      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <motion.div whileHover={{ y: -4, boxShadow: "0 10px 28px rgba(16,185,129,0.15)" }}
                        className="card" style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: 14, position: "relative", overflow: "hidden" }}>

                        {isUpcoming(release.releaseDate) && (
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#10b981,#34d399)" }} />
                        )}

                        <div style={{ flexShrink: 0 }}>
                          {release.coverImage
                            ? <img src={release.coverImage} alt={release.title} style={{ width: 64, height: 80, objectFit: "cover", borderRadius: 8 }} onError={(e) => (e.target.style.display = "none")} />
                            : <div style={{ width: 64, height: 80, borderRadius: 8, background: `${TYPE_COLORS[release.releaseType] || "#10b981"}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                                <Calendar size={18} />
                              </div>
                          }
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{
                            padding: "2px 8px", borderRadius: 999, fontSize: 10.5, fontWeight: 700, display: "inline-block", marginBottom: 5,
                            background: `${TYPE_COLORS[release.releaseType] || "#10b981"}18`,
                            color: TYPE_COLORS[release.releaseType] || "#10b981",
                            textTransform: "capitalize",
                          }}>{release.releaseType}</span>

                          <div style={{ fontWeight: 700, fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{release.title}</div>

                          {release.description && (
                            <p style={{ fontSize: 11.5, color: "var(--text-muted)", margin: "4px 0 0", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {release.description}
                            </p>
                          )}

                          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 7, fontSize: 11.5, color: isUpcoming(release.releaseDate) ? "#10b981" : "var(--text-muted)", fontWeight: 600 }}>
                            {isUpcoming(release.releaseDate) ? <Clock size={11} /> : <Calendar size={11} />}
                            {new Date(release.releaseDate).toLocaleDateString(undefined, { dateStyle: "medium" })}
                            {isUpcoming(release.releaseDate) && (
                              <span style={{ padding: "1px 6px", borderRadius: 999, fontSize: 10, fontWeight: 800, background: "rgba(16,185,129,0.15)", color: "#10b981", marginLeft: 4 }}>UPCOMING</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Releases;
