import CategoryIcon from "../components/CategoryIcon.jsx";
import { UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Search } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb.jsx";

const CATS = ["All","Anime","Gaming","Movies","TV Shows","K-Pop","Comics","Manga","Cosplay"];

const ROLES = ["All","protagonist","antagonist","supporting"];
const ROLE_COLORS = { protagonist:"#10b981", antagonist:"#ef4444", supporting:"#8b5cf6" };

const Characters = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [category, setCat]    = useState("All");
  const [role, setRole]       = useState("All");

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== "All") params.category = category;
    if (role !== "All")     params.role = role;
    axios.get("/api/characters", { params })
      .then((r) => {
        const raw = r.data;
        setItems(Array.isArray(raw) ? raw : raw?.data || raw?.items || []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [category, role]);

  const filtered = Array.isArray(items)
    ? (search.trim() ? items.filter((i) => i.name?.toLowerCase().includes(search.toLowerCase())) : items)
    : [];

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#1e1b4b,#4c1d95)", padding: "48px 24px 36px", textAlign: "center" }}>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ margin: 0, fontSize: 34, fontWeight: 900, color: "#fff" }}>
          Character Profiles
        </motion.h1>
        <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 8, fontSize: 15 }}>
          Explore heroes, villains, and icons from every fandom
        </p>
        <div style={{ position: "relative", maxWidth: 400, margin: "18px auto 0" }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.5)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search characters…"
            style={{ width: "100%", padding: "9px 12px 9px 34px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 13.5, outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>

      <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>
        <Breadcrumb items={[{ label: "Characters" }]} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
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

        <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
          {ROLES.map((r) => (
            <button key={r} onClick={() => setRole(r)} style={{
              padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${role === r ? ROLE_COLORS[r] || "var(--border)" : "var(--border)"}`,
              background: role === r ? `${ROLE_COLORS[r] || "#8b5cf6"}18` : "transparent",
              color: role === r ? ROLE_COLORS[r] || "#8b5cf6" : "var(--text-muted)",
              textTransform: "capitalize",
            }}>{r}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div key={i} animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }}
                style={{ height: 260, borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 40, marginBottom: 12, display: "flex", justifyContent: "center" }}><UserCheck size={36} /></div>
            No characters found.
          </div>
        ) : (
          <motion.div initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
            {filtered.map((char) => (
              <motion.div key={char._id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                <motion.div whileHover={{ y: -5, boxShadow: "0 14px 36px rgba(139,92,246,0.2)" }}
                  className="card" style={{ padding: 0, overflow: "hidden" }}>
                  {char.image
                    ? <img src={char.image} alt={char.name} style={{ width: "100%", height: 180, objectFit: "cover" }} onError={(e) => (e.target.style.display = "none")} />
                    : <div style={{ height: 180, background: "linear-gradient(135deg,#312e81,#6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}><UserCheck size={48} color="#fff" /></div>
                  }
                  <div style={{ padding: 14 }}>
                    {char.role && (
                      <span style={{
                        padding: "2px 8px", borderRadius: 999, fontSize: 10.5, fontWeight: 700, display: "inline-block", marginBottom: 6,
                        background: `${ROLE_COLORS[char.role] || "#8b5cf6"}18`,
                        color: ROLE_COLORS[char.role] || "#8b5cf6",
                        textTransform: "capitalize",
                      }}>{char.role}</span>
                    )}
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{char.name}</div>
                    {char.description && (
                      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "6px 0 0", lineHeight: 1.5,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {char.description}
                      </p>
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

export default Characters;
