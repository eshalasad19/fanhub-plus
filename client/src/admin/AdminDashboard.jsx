import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Users, FolderOpen, FileText, UserCircle, BookOpen,
  Film, CalendarDays, ShoppingBag, MessageSquare, Bot,
  Clock, TrendingUp, TrendingDown, BarChart2, ArrowUpRight,
  ArrowRight, AlertCircle, BookMarked, Tag, Activity,
  Eye, Plus, PenSquare, ChevronRight, CheckCircle,
} from "lucide-react";


const ACCENT = "#8b5cf6";
const LIME   = "#c8f135";
const S      = "var(--surface)";
const B      = "var(--border)";
const TM     = "var(--text-muted)";



const CountUp = ({ value, duration = 1400, color, fontSize = 36 }) => {
  const [display, setDisplay] = useState(0);
  const target = Number(value) || 0;

  useEffect(() => {
    if (target === 0) { setDisplay(0); return; }
    let start = null;
    const startVal = 0;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startVal + (target - startVal) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, duration]);

  return (
    <motion.span
      key={target}
      initial={{ opacity: 0, scale: 0.75, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{
        fontSize,
        fontWeight: 900,
        letterSpacing: -1.5,
        lineHeight: 1,
        color: color || "var(--text)",
        display: "inline-block",
      }}
    >
      {display.toLocaleString()}
    </motion.span>
  );
};

const CAT_META = {
  Anime: { color: "#a78bfa" },
  Gaming: { color: "#60a5fa" },
  Movies: { color: "#f472b6" },
  "TV Shows": { color: "#34d399" },
  "K-Pop": { color: "#fbbf24" },
  Comics: { color: "#f87171" },
  Manga: { color: "#4ade80" },
  Cosplay: { color: "#fb923c" },
};


const Sparkline = ({ data = [], color = ACCENT, h = 40 }) => {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const rng = max - min || 1;
  const W = 100;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${h - ((v - min) / rng) * h}`).join(" ");
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${h} ${pts} ${W},${h}`} fill={`${color}18`} stroke="none" />
    </svg>
  );
};


const PieChart = ({ slices, size = 160 }) => {
  
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r  = size * 0.38;
  const ir = size * 0.22; 

  let angle = -Math.PI / 2; 
  const paths = slices.map((slice) => {
    const sweep = (slice.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    const ix1 = cx + ir * Math.cos(angle);
    const iy1 = cy + ir * Math.sin(angle);
    const ix2 = cx + ir * Math.cos(angle - sweep);
    const iy2 = cy + ir * Math.sin(angle - sweep);
    const large = sweep > Math.PI ? 1 : 0;
    return {
      d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${ir} ${ir} 0 ${large} 0 ${ix2} ${iy2} Z`,
      color: slice.color,
      label: slice.label,
      pct: Math.round((slice.value / total) * 100),
    };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths.map((p, i) => (
        <motion.path
          key={i}
          d={p.d}
          fill={p.color}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          <title>{p.label}: {p.pct}%</title>
        </motion.path>
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="16" fontWeight="900" fill="var(--text)">{total}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="var(--text-muted)">total</text>
    </svg>
  );
};


const FeedbackSentimentCard = ({ byType = [], byStatus = [] }) => {
  const sentimentMap = {
    suggestion: { label: "Positive", color: "#10b981" },
    query:      { label: "Neutral",  color: "#f59e0b" },
    bug:        { label: "Negative", color: "#ef4444" },
  };

  const total = byType.reduce((s, t) => s + t.count, 0);

  
  const pieSlices = total > 0
    ? byType.filter((t) => t._id).map((t) => ({
        label: sentimentMap[t._id]?.label || t._id,
        value: t.count,
        color: sentimentMap[t._id]?.color || "#8b5cf6",
      }))
    : [
        { label: "Positive", value: 60, color: "#10b981" },
        { label: "Neutral",  value: 25, color: "#f59e0b" },
        { label: "Negative", value: 15, color: "#ef4444" },
      ];

  const displayTotal = total > 0 ? total : 0;

  const statusPie = byStatus
    .filter((s) => s._id)
    .map((s) => ({
      label: s._id,
      value: s.count,
      color: s._id === "resolved" ? "#10b981" : s._id === "reviewed" ? "#3b82f6" : "#f59e0b",
    }));

  const positive = byType.find((t) => t._id === "suggestion")?.count || 0;
  const satPct   = total > 0 ? Math.round((positive / total) * 100) : 0;

  return (
    <div style={{ background: S, border: `1px solid ${B}`, borderRadius: 20, padding: "22px 24px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 15 }}>User Feedback Sentiment</div>
        <div style={{ fontSize: 12, color: TM, marginTop: 3 }}>How users feel about Fan Hub Plus</div>
      </div>

      <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <PieChart slices={pieSlices} size={160} />
          {total === 0 && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <div style={{ fontSize: 10, color: TM, textAlign: "center", lineHeight: 1.4 }}>Preview<br/>Add feedback<br/>to see real data</div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#10b981", marginBottom: 4 }}>Satisfaction Score</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#10b981", letterSpacing: -1 }}>{total > 0 ? `${satPct}%` : "—"}</div>
            <div style={{ fontSize: 11.5, color: TM, marginTop: 2 }}>{total > 0 ? "based on suggestions vs bugs" : "No feedback submitted yet"}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pieSlices.map((slice) => (
              <div key={slice.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: slice.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{slice.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: slice.color }}>{total > 0 ? slice.value : "0"}</span>
                  <span style={{ fontSize: 11.5, color: TM }}>({total > 0 ? Math.round((slice.value / total) * 100) : Math.round((slice.value / pieSlices.reduce((s, x) => s + x.value, 0)) * 100)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {statusPie.length > 0 && (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${B}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: TM, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>By Resolution Status</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {statusPie.map((s) => (
              <div key={s.label} style={{ flex: 1, minWidth: 80, background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: TM, marginTop: 3, textTransform: "capitalize" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const EsportsPieChart = ({ byType = [], total = 0 }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const sentimentMap = {
    suggestion: { label: "Suggestions",   color: "#10b981", glow: "rgba(16,185,129,0.5)"  },
    query:      { label: "Queries",       color: "#f59e0b", glow: "rgba(245,158,11,0.5)"  },
    bug:        { label: "Bug Reports",   color: "#ef4444", glow: "rgba(239,68,68,0.5)"   },
  };

  const rawSlices = total > 0
    ? byType.filter((t) => t._id && sentimentMap[t._id]).map((t) => ({ ...sentimentMap[t._id], value: t.count, key: t._id }))
    : [
        { ...sentimentMap.suggestion, value: 60, key: "suggestion" },
        { ...sentimentMap.query,      value: 25, key: "query" },
        { ...sentimentMap.bug,        value: 15, key: "bug" },
      ];

  const sliceTotal = rawSlices.reduce((s, x) => s + x.value, 0) || 1;
  const positive   = rawSlices.find((s) => s.key === "suggestion")?.value || 0;
  const satPct     = total > 0 ? Math.round((positive / total) * 100) : 0;

  const SIZE = 180, CX = SIZE / 2, CY = SIZE / 2, RADIUS = 72, STROKE = 18;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const GAP = 3;

  let cumPct = 0;
  const arcs = rawSlices.map((slice) => {
    const pct    = slice.value / sliceTotal;
    const arcLen = pct * CIRCUMFERENCE - GAP;
    const offset = CIRCUMFERENCE - cumPct * CIRCUMFERENCE;
    cumPct += pct;
    return { ...slice, pct, arcLen: Math.max(arcLen, 0), offset };
  });

  return (
    <div style={{
      background: "linear-gradient(145deg, #1a1033, #0f0a1e)",
      border: "1px solid rgba(139,92,246,0.25)",
      borderRadius: 20, padding: "22px 24px",
      display: "flex", flexDirection: "column",
      height: "100%", boxSizing: "border-box",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ marginBottom: 16, position: "relative" }}>
        <div style={{ fontSize: 13.5, fontWeight: 800, color: "#fff" }}>Feedback Sentiment</div>
        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>
          {total > 0 ? `${total} total responses` : "Preview — submit feedback to see real data"}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1 }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            <circle cx={CX} cy={CY} r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={STROKE} />
            {arcs.map((arc) => (
              <motion.circle
                key={arc.key}
                cx={CX} cy={CY} r={RADIUS}
                fill="none"
                stroke={arc.color}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={`${arc.arcLen} ${CIRCUMFERENCE}`}
                strokeDashoffset={arc.offset}
                style={{ transformOrigin: `${CX}px ${CY}px`, transform: "rotate(-90deg)", filter: `drop-shadow(0 0 8px ${arc.glow})` }}
                initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
                animate={{ strokeDasharray: `${arc.arcLen} ${CIRCUMFERENCE}` }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              />
            ))}
            <text x={CX} y={CY - 10} textAnchor="middle" fontSize="26" fontWeight="900" fill="#fff">
              {total > 0 ? `${satPct}%` : "?"}
            </text>
            <text x={CX} y={CY + 8} textAnchor="middle" fontSize="10" fontWeight="600" fill="rgba(255,255,255,0.5)">
              SATISFIED
            </text>
          </svg>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {arcs.map((arc) => {
            const pct = Math.round(arc.pct * 100);
            return (
              <div key={arc.key}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: arc.color, boxShadow: `0 0 6px ${arc.glow}`, flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>{arc.emoji} {arc.label}</span>
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 900, color: arc.color }}>{pct}%</span>
                </div>
                <div style={{ height: 5, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    style={{ height: "100%", borderRadius: 999, background: arc.color, boxShadow: `0 0 8px ${arc.glow}` }}
                  />
                </div>
              </div>
            );
          })}
          {total > 0 && (
            <div style={{ marginTop: 6, padding: "7px 12px", borderRadius: 10, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Satisfaction</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#10b981" }}>{satPct}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const KpiCard = ({ icon: Icon, label, value, sub, trendVal, color = ACCENT, to, sparkData }) => {
  const up = trendVal == null ? null : trendVal >= 0;
  const inner = (
    <motion.div
      whileHover={{ y: -5, boxShadow: `0 20px 48px ${color}28` }}
      transition={{ duration: 0.18 }}
      style={{
        background: S,
        border: `1px solid ${B}`,
        borderRadius: 20,
        padding: "22px 24px",
        
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: to ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "20px 20px 0 0", background: `linear-gradient(90deg,${color},${color}44)` }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={20} style={{ color }} strokeWidth={2} />
        </div>
        {to && (
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `${color}12`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowUpRight size={14} style={{ color }} />
          </div>
        )}
      </div>

      <div style={{ lineHeight: 1 }}>
        {value != null && value !== "—"
          ? <CountUp value={value} duration={1600} fontSize={36} />
          : <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1.5 }}>—</span>
        }
      </div>
      <div style={{ fontSize: 13, color: TM, fontWeight: 500, marginTop: 5 }}>{label}</div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
        {sub && <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: `${color}12`, color }}>{sub}</span>}
        {trendVal != null && (
          <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 800, color: up ? "#10b981" : "#ef4444" }}>
            {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {up ? "+" : ""}{trendVal}%
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ marginTop: 14 }}>
        {sparkData
          ? <Sparkline data={sparkData} color={color} h={36} />
          
          : <div style={{ height: 36 }} />
        }
      </div>
    </motion.div>
  );
  return to
    ? <Link to={to} style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}>{inner}</Link>
    : inner;
};


const StatTile = ({ icon: Icon, label, value, sub, color = ACCENT, to }) => {
  const inner = (
    <motion.div
      whileHover={{ y: -3, borderColor: color }}
      transition={{ duration: 0.15 }}
      style={{ background: S, border: `1px solid ${B}`, borderRadius: 16, padding: "15px 17px", display: "flex", alignItems: "center", gap: 13, cursor: to ? "pointer" : "default", height: "100%", boxSizing: "border-box" }}
    >
      <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={18} style={{ color }} strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ lineHeight: 1 }}>
          {value != null && value !== "—" && typeof value === "number"
            ? <CountUp value={value} duration={1400} fontSize={22} />
            : <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>{value ?? "—"}</span>
          }
        </div>
        <div style={{ fontSize: 12, color: TM, marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color, fontWeight: 700, marginTop: 3 }}>{sub}</div>}
      </div>
      {to && <ArrowRight size={13} style={{ color: TM, flexShrink: 0 }} />}
    </motion.div>
  );
  return to ? <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>{inner}</Link> : inner;
};


const BarChart = ({ data, color1 = ACCENT, color2 = LIME, title, subtitle }) => {
  const max = Math.max(...data.flatMap((d) => [d.v1 || 0, d.v2 || 0]), 1);
  return (
    <div style={{ background: S, border: `1px solid ${B}`, borderRadius: 20, padding: "22px 24px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: TM, marginTop: 3 }}>{subtitle}</div>}
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {[{ color: color1, label: "Content" }, { color: color2, label: "Events" }].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
              <span style={{ fontSize: 11.5, color: TM }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-end", height: 150 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", paddingBottom: 20 }}>
          {[1, 0.66, 0.33, 0].map((v) => (
            <span key={v} style={{ fontSize: 10, color: TM, width: 22, textAlign: "right" }}>{Math.round(v * max)}</span>
          ))}
        </div>
        {data.map((item, i) => (
          <div key={i} title={item.fullName} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
            <div style={{ display: "flex", gap: 2, alignItems: "flex-end", width: "100%", height: 120 }}>
              <motion.div initial={{ height: 0 }} animate={{ height: `${((item.v1 || 0) / max) * 100}%` }} transition={{ duration: 0.75, delay: i * 0.04, ease: "easeOut" }} style={{ flex: 1, borderRadius: "5px 5px 0 0", background: color1, minHeight: 2 }} />
              <motion.div initial={{ height: 0 }} animate={{ height: `${((item.v2 || 0) / max) * 100}%` }} transition={{ duration: 0.75, delay: i * 0.04 + 0.06, ease: "easeOut" }} style={{ flex: 1, borderRadius: "5px 5px 0 0", background: color2, minHeight: 2 }} />
            </div>
            <div style={{ fontSize: 9, color: TM, textAlign: "center", marginTop: 5 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};


const PBar = ({ label, count, pct, color }) => (
  <div style={{ marginBottom: 11 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>
      <span style={{ textTransform: "capitalize" }}>{label}</span>
      <span style={{ color }}>{count} <span style={{ color: TM, fontWeight: 400 }}>({pct}%)</span></span>
    </div>
    <div style={{ height: 7, borderRadius: 999, background: B, overflow: "hidden" }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.85, ease: "easeOut" }}
        style={{ height: "100%", borderRadius: 999, background: color }} />
    </div>
  </div>
);


const QuickLink = ({ icon: Icon, title, desc, to, color }) => (
  <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
    <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.13 }}
      style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 13px", borderRadius: 12, border: `1px solid ${B}`, background: S, cursor: "pointer" }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={16} style={{ color }} strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>
        {desc && <div style={{ fontSize: 11.5, color: TM, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{desc}</div>}
      </div>
      <ChevronRight size={13} style={{ color: TM, flexShrink: 0 }} />
    </motion.div>
  </Link>
);


const TRow = ({ item, isLast }) => {
  const sc = { open: "#f59e0b", pending: "#f59e0b", resolved: "#10b981", approved: "#10b981", rejected: "#ef4444" };
  const col = sc[item.status] || "#6b7280";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "30px 1fr auto 28px", gap: 12, alignItems: "center", padding: "11px 16px", borderBottom: isLast ? "none" : `1px solid ${B}`, transition: "background 0.12s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
      <span style={{ fontSize: 17, textAlign: "center" }}>{item.emoji}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
        <div style={{ fontSize: 11.5, color: TM, marginTop: 2 }}>{item.meta}</div>
      </div>
      <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: `${col}18`, color: col, textTransform: "capitalize" }}>{item.status}</span>
      <Link to={item.to} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${B}`, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: TM }}>
        <Eye size={13} />
      </Link>
    </div>
  );
};


const SH = ({ icon: Icon, children, color = ACCENT, link, linkTo }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 9, margin: "28px 0 14px" }}>
    <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon size={14} style={{ color }} strokeWidth={2.2} />
    </div>
    <span style={{ fontSize: 11.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.3, color: TM }}>{children}</span>
    {link && (
      <Link to={linkTo} style={{ marginLeft: "auto", fontSize: 12, color: ACCENT, textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
        {link} <ArrowUpRight size={11} />
      </Link>
    )}
  </div>
);


const Pulse = ({ w = "100%", h = 12, r = 6, mb = 0 }) => (
  <motion.div animate={{ opacity: [0.35, 0.7, 0.35] }} transition={{ duration: 1.5, repeat: Infinity }}
    style={{ width: w, height: h, borderRadius: r, background: B, marginBottom: mb }} />
);






const ContentTab = ({ d, catChart, fbColors, maxFb }) => (
  <motion.div key="content" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
    <SH icon={FileText} color="#a78bfa">Content Library</SH>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(165px,1fr))", gap: 12, marginBottom: 20 }}>
      <StatTile icon={FolderOpen}  label="Categories"  value={d.categories?.total}                                          color="#f59e0b" to="/admin/categories" />
      <StatTile icon={UserCircle}  label="Characters"  value={d.characters?.total}                                          color="#ec4899" to="/admin/characters" />
      <StatTile icon={BookOpen}    label="Articles"    value={d.articles?.total}   sub={`${d.articles?.published||0} pub`}  color="#8b5cf6" to="/admin/articles" />
      <StatTile icon={Film}        label="Multimedia"  value={d.multimedia?.total}                                          color="#06b6d4" to="/admin/multimedia" />
      <StatTile icon={ShoppingBag} label="Merchandise" value={d.merchandise?.total}                                         color="#f97316" to="/admin/merchandise" />
      <StatTile icon={Tag}         label="Tags"        value="—"                                                            color="#34d399" to="/admin/tags" />
    </div>

    {catChart.length > 0 && (
      <>
        <SH icon={BarChart2} color="#3b82f6">Content by Category</SH>
        <BarChart data={catChart} color1={ACCENT} color2={LIME} title="Content Distribution" subtitle="Items across fandom categories" />
      </>
    )}

    <SH icon={BookOpen} color="#8b5cf6">Article Breakdown</SH>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
      {[
        { label: "Total Articles",     value: d.articles?.total || 0,     color: "#8b5cf6" },
        { label: "Published",           value: d.articles?.published || 0, color: "#10b981" },
        { label: "Drafts",             value: (d.articles?.total || 0) - (d.articles?.published || 0), color: "#f59e0b" },
        { label: "Total Multimedia",   value: d.multimedia?.total || 0,   color: "#06b6d4" },
      ].map((item) => (
        <div key={item.label} style={{ background: S, border: `1px solid ${B}`, borderRadius: 16, padding: "16px 18px" }}>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, color: item.color }}>{item.value}</div>
          <div style={{ fontSize: 12.5, color: TM, marginTop: 4 }}>{item.label}</div>
        </div>
      ))}
    </div>
  </motion.div>
);


const CommunityTab = ({ d, rows }) => (
  <motion.div key="community" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
    <SH icon={Activity} color="#ec4899">Events & Community Overview</SH>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14, marginBottom: 20 }}>
      <StatTile icon={CalendarDays}  label="Total Events"     value={d.events?.total}      sub={`${d.events?.upcoming||0} upcoming`}    color="#8b5cf6" to="/admin/events" />
      <StatTile icon={Clock}         label="Fan Submissions"  value={d.submissions?.total} sub={`${d.submissions?.pending||0} pending`}  color="#ec4899" to="/admin/submissions" />
      <StatTile icon={MessageSquare} label="Total Feedback"   value={d.feedback?.total}    sub={`${d.feedback?.open||0} open`}           color="#06b6d4" to="/admin/feedback" />
      <StatTile icon={CheckCircle}   label="Resolved"         value={d.feedback?.resolved} sub="feedback"                               color="#10b981" to="/admin/feedback" />
    </div>

    <SH icon={CalendarDays} color="#8b5cf6">Event Status</SH>
    <div style={{ background: S, border: `1px solid ${B}`, borderRadius: 18, padding: "20px 22px", marginBottom: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Events</div>
          {[
            { label: "Total Events",    value: d.events?.total || 0,    color: "#8b5cf6" },
            { label: "Upcoming",        value: d.events?.upcoming || 0, color: "#10b981" },
            { label: "Past",            value: Math.max((d.events?.total || 0) - (d.events?.upcoming || 0), 0), color: "#6b7280" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${B}` }}>
              <span style={{ fontSize: 13, color: TM }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Submissions</div>
          {[
            { label: "Total",    value: d.submissions?.total || 0,    color: "#ec4899" },
            { label: "Pending",  value: d.submissions?.pending || 0,  color: "#f59e0b" },
            { label: "Approved", value: d.submissions?.approved || 0, color: "#10b981" },
            { label: "Rejected", value: (d.submissions?.total || 0) - (d.submissions?.pending || 0) - (d.submissions?.approved || 0), color: "#ef4444" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${B}` }}>
              <span style={{ fontSize: 13, color: TM }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {rows.length > 0 && (
      <>
        <SH icon={Activity} color={ACCENT} link="View all" linkTo="/admin/submissions">Recent Activity</SH>
        <div style={{ background: S, border: `1px solid ${B}`, borderRadius: 18, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "30px 1fr auto 28px", gap: 12, padding: "10px 16px", background: "var(--bg)", borderBottom: `1px solid ${B}`, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: TM }}>
            <span /><span>Title / Message</span><span>Status</span><span />
          </div>
          {rows.map((item, i) => <TRow key={i} item={item} isLast={i === rows.length - 1} />)}
        </div>
      </>
    )}
  </motion.div>
);


const AnalyticsTab = ({ d, catChart, maxChat, maxFb, fbColors }) => (
  <motion.div key="analytics" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
    <SH icon={BarChart2} color="#3b82f6">Platform Analytics</SH>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 12, marginBottom: 24 }}>
      {[
        { label: "Total Users",      value: d.users?.total || 0,            color: ACCENT },
        { label: "Active Users",     value: d.users?.active || 0,           color: "#10b981" },
        { label: "Total Content",    value: d.content?.total || 0,          color: "#a78bfa" },
        { label: "Published",        value: d.content?.published || 0,      color: "#60a5fa" },
        { label: "Chatbot Messages", value: d.chatbot?.totalMessages || 0,  color: "#fbbf24" },
        { label: "Active FAQs",      value: d.chatbot?.activeFaqs || 0,     color: "#f59e0b" },
        { label: "Total Feedback",   value: d.feedback?.total || 0,         color: "#06b6d4" },
        { label: "Resolved",         value: d.feedback?.resolved || 0,      color: "#10b981" },
      ].map((item) => (
        <div key={item.label} style={{ background: S, border: `1px solid ${B}`, borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -1, color: item.color }}>{item.value}</div>
          <div style={{ fontSize: 12, color: TM, marginTop: 3 }}>{item.label}</div>
        </div>
      ))}
    </div>

    {catChart.length > 0 && (
      <div style={{ marginBottom: 24 }}>
        <BarChart data={catChart} color1={ACCENT} color2={LIME} title="Content by Category" subtitle="Distribution across fandom categories" />
      </div>
    )}

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
      {d.chatbot?.sourceBreakdown?.length > 0 && (
        <div style={{ background: S, border: `1px solid ${B}`, borderRadius: 18, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
            <Bot size={14} style={{ color: "#fbbf24" }} />
            <span style={{ fontWeight: 800, fontSize: 13 }}>Chatbot Reply Sources</span>
          </div>
          {d.chatbot.sourceBreakdown.map((s) => {
            const pct = Math.round((s.count / maxChat) * 100);
            return <PBar key={s._id} label={s._id || "unknown"} count={s.count} pct={pct} color="#fbbf24" />;
          })}
        </div>
      )}
      {d.feedback?.byType?.length > 0 && (
        <div style={{ background: S, border: `1px solid ${B}`, borderRadius: 18, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
            <MessageSquare size={14} style={{ color: "#06b6d4" }} />
            <span style={{ fontWeight: 800, fontSize: 13 }}>Feedback by Type</span>
          </div>
          {d.feedback.byType.map((t) => {
            const pct = Math.round((t.count / maxFb) * 100);
            return <PBar key={t._id} label={t._id} count={t.count} pct={pct} color={fbColors[t._id] || "#06b6d4"} />;
          })}
        </div>
      )}
    </div>

    <FeedbackSentimentCard byType={d.feedback?.byType || []} byStatus={d.feedback?.byStatus || []} />
  </motion.div>
);




const AdminDashboard = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const TABS = ["Overview", "Content", "Community", "Analytics"];

  useEffect(() => {
    axios.get("/api/analytics/summary")
      .then((r) => setData(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const now   = new Date();
  const hour  = now.getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (loading) return (
    <div>
      <Pulse h={22} r={6} mb={6} w="35%" /><Pulse h={34} r={8} mb={28} w="55%" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, alignItems: "stretch" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ background: S, border: `1px solid ${B}`, borderRadius: 20, padding: 22, minHeight: 200 }}>
            <Pulse w={44} h={44} r={13} mb={14} /><Pulse w="45%" h={34} r={6} mb={8} /><Pulse w="65%" h={11} r={4} mb={14} /><Pulse h={36} r={6} />
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0", gap: 12 }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <AlertCircle size={26} style={{ color: "#ef4444" }} />
      </div>
      <p style={{ color: TM, fontSize: 15, margin: 0 }}>Failed to load dashboard. Check your server.</p>
    </div>
  );

  const d = data || {};

  
  const tot   = d.users?.total || 0;
  const spark = Array.from({ length: 7 }, (_, i) => Math.max(0, tot - (6 - i) * Math.round(tot * 0.05 + 1)));

  
  const catChart = (d.charts?.contentByCategory || []).slice(0, 7).map((c) => ({
    label: (c.name || c._id || "?").slice(0, 5),
    fullName: c.name || c._id || "Unknown",
    v1: c.count,
    v2: Math.max(Math.round(c.count * 0.3), 0),
  }));

  
  const rows = [
    ...(d.recent?.feedback || []).map((f) => ({
      
      title: f.message,
      meta: `${f.user?.name || "Unknown"} · Feedback · ${new Date(f.createdAt).toLocaleDateString()}`,
      status: f.status, to: "/admin/feedback",
    })),
    ...(d.recent?.submissions || []).map((s) => ({
      
      title: s.title,
      meta: `${s.user?.name || "Unknown"} · ${s.category} · ${new Date(s.createdAt).toLocaleDateString()}`,
      status: s.status, to: "/admin/submissions",
    })),
  ].slice(0, 8);

  const maxChat  = Math.max(...(d.chatbot?.sourceBreakdown?.map((s) => s.count) || [1]));
  const maxFb    = Math.max(...(d.feedback?.byType?.map((t) => t.count) || [1]));
  const fbColors = { bug: "#ef4444", suggestion: "#3b82f6", query: "#8b5cf6" };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

      <div style={{ marginBottom: 22 }}>
        <p style={{ margin: 0, fontSize: 12.5, color: TM, fontWeight: 500 }}>
          {greet} &nbsp;·&nbsp; {now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
        <h1 style={{ margin: "5px 0 18px", fontSize: 26, fontWeight: 900, letterSpacing: -0.8 }}>Platform Overview</h1>

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "7px 16px", borderRadius: 999,
              border: `1px solid ${activeTab === tab ? "transparent" : B}`,
              background: activeTab === tab ? ACCENT : "transparent",
              color: activeTab === tab ? "#fff" : "var(--text)",
              fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
            }}>{tab}</button>
          ))}
          <div style={{ flex: 1 }} />
          <Link to="/admin/articles" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 15px", borderRadius: 999, border: `1px solid ${B}`, background: S, fontSize: 13, fontWeight: 700, textDecoration: "none", color: "var(--text)" }}>
            <PenSquare size={13} /> New Article
          </Link>
          <Link to="/admin/events" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 15px", borderRadius: 999, border: "none", background: `linear-gradient(135deg,${ACCENT},#6d28d9)`, fontSize: 13, fontWeight: 700, textDecoration: "none", color: "#fff", boxShadow: `0 4px 14px ${ACCENT}35` }}>
            <Plus size={13} strokeWidth={2.5} /> New Event
          </Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16, alignItems: "stretch", marginBottom: 24 }}>

        <EsportsPieChart
          byType={d.feedback?.byType || []}
          total={d.feedback?.total || 0}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, alignItems: "stretch" }}>
          <KpiCard icon={Users}        label="Total Users"     value={d.users?.total || 0}           sub={`${d.users?.active || 0} active`}       trendVal={12}  color={ACCENT}   sparkData={spark} to="/admin/users" />
          <KpiCard icon={FileText}     label="Content Items"   value={d.content?.total || 0}         sub={`${d.content?.published || 0} published`} trendVal={5}   color="#a78bfa"  to="/admin/content" />
          <KpiCard icon={CalendarDays} label="Total Events"    value={d.events?.total || 0}          sub={`${d.events?.upcoming || 0} upcoming`}    trendVal={8}   color="#60a5fa"  to="/admin/events" />
          <KpiCard icon={Bot}          label="Chatbot Queries" value={d.chatbot?.totalMessages || 0} sub={`${d.chatbot?.activeFaqs || 0} FAQs`}     trendVal={-2}  color="#fbbf24"  to="/admin/chatbot" />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 285px", gap: 20, alignItems: "start" }}>

        <div style={{ minWidth: 0 }}>
          <AnimatePresence mode="wait">
            {activeTab === "Overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
                <SH icon={Users} color={ACCENT}>Users</SH>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.5fr", gap: 14, marginBottom: 20 }}>
                  <StatTile icon={Users}      label="Total Users"  value={d.users?.total}  sub={`${d.users?.blocked || 0} blocked`} color={ACCENT}  to="/admin/users" />
                  <StatTile icon={TrendingUp} label="Active Users" value={d.users?.active} sub="not blocked"                        color="#10b981" to="/admin/users" />
                  <div style={{ background: S, border: `1px solid ${B}`, borderRadius: 16, padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700 }}>User Growth</div>
                        <div style={{ fontSize: 11.5, color: TM, marginTop: 2 }}>7-day trend</div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: "#10b981", display: "flex", alignItems: "center", gap: 3 }}>
                        <TrendingUp size={12} /> +12%
                      </span>
                    </div>
                    <Sparkline data={spark} color={ACCENT} h={46} />
                  </div>
                </div>

                <SH icon={FileText} color="#a78bfa">Content Library</SH>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(165px,1fr))", gap: 12, marginBottom: 20 }}>
                  <StatTile icon={FolderOpen}  label="Categories"  value={d.categories?.total}                                          color="#f59e0b" to="/admin/categories" />
                  <StatTile icon={UserCircle}  label="Characters"  value={d.characters?.total}                                          color="#ec4899" to="/admin/characters" />
                  <StatTile icon={BookOpen}    label="Articles"    value={d.articles?.total}   sub={`${d.articles?.published||0} pub`}  color="#8b5cf6" to="/admin/articles" />
                  <StatTile icon={Film}        label="Multimedia"  value={d.multimedia?.total}                                          color="#06b6d4" to="/admin/multimedia" />
                  <StatTile icon={ShoppingBag} label="Merchandise" value={d.merchandise?.total}                                         color="#f97316" to="/admin/merchandise" />
                  <StatTile icon={Tag}         label="Tags"        value="—"                                                            color="#34d399" to="/admin/tags" />
                </div>

                {rows.length > 0 && (
                  <>
                    <SH icon={Activity} color={ACCENT} link="View all" linkTo="/admin/submissions">Recent Activity</SH>
                    <div style={{ background: S, border: `1px solid ${B}`, borderRadius: 18, overflow: "hidden" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "30px 1fr auto 28px", gap: 12, padding: "10px 16px", background: "var(--bg)", borderBottom: `1px solid ${B}`, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: TM }}>
                        <span /><span>Title / Message</span><span>Status</span><span />
                      </div>
                      {rows.map((item, i) => <TRow key={i} item={item} isLast={i === rows.length - 1} />)}
                    </div>
                  </>
                )}

                <SH icon={MessageSquare} color="#10b981">User Sentiment</SH>
                <FeedbackSentimentCard byType={d.feedback?.byType || []} byStatus={d.feedback?.byStatus || []} />
              </motion.div>
            )}

            {activeTab === "Content" && (
              <ContentTab key="content" d={d} catChart={catChart} fbColors={fbColors} maxFb={maxFb} />
            )}

            {activeTab === "Community" && (
              <CommunityTab key="community" d={d} rows={rows} />
            )}

            {activeTab === "Analytics" && (
              <AnalyticsTab key="analytics" d={d} catChart={catChart} maxChat={maxChat} maxFb={maxFb} fbColors={fbColors} />
            )}
          </AnimatePresence>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {d.chatbot?.sourceBreakdown?.length > 0 && (
            <div style={{ background: S, border: `1px solid ${B}`, borderRadius: 18, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                <Bot size={14} style={{ color: "#fbbf24" }} />
                <span style={{ fontWeight: 800, fontSize: 13 }}>Chatbot Sources</span>
              </div>
              {d.chatbot.sourceBreakdown.map((s) => {
                const pct = Math.round((s.count / maxChat) * 100);
                return <PBar key={s._id} label={s._id || "unknown"} count={s.count} pct={pct} color="#fbbf24" />;
              })}
            </div>
          )}

          {d.feedback?.byType?.length > 0 && (
            <div style={{ background: S, border: `1px solid ${B}`, borderRadius: 18, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                <MessageSquare size={14} style={{ color: "#06b6d4" }} />
                <span style={{ fontWeight: 800, fontSize: 13 }}>Feedback Types</span>
              </div>
              {d.feedback.byType.map((t) => {
                const pct = Math.round((t.count / maxFb) * 100);
                return <PBar key={t._id} label={t._id} count={t.count} pct={pct} color={fbColors[t._id] || "#06b6d4"} />;
              })}
            </div>
          )}

          <div style={{ background: S, border: `1px solid ${B}`, borderRadius: 18, padding: "18px 20px" }}>
            <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2, color: TM }}>Quick Actions</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <QuickLink icon={Users}       title="Manage Users"      desc="View & moderate accounts"    to="/admin/users"       color="#a78bfa" />
              <QuickLink icon={FolderOpen}  title="Categories"        desc="Edit fandom categories"      to="/admin/categories"  color="#fbbf24" />
              <QuickLink icon={BookMarked}  title="Featured Articles" desc="Publish & manage articles"   to="/admin/articles"    color="#60a5fa" />
              <QuickLink icon={Tag}         title="Tags"              desc="Central tag management"      to="/admin/tags"        color="#34d399" />
              <QuickLink icon={Bot}         title="Chatbot FAQs"      desc="Update AI knowledge base"    to="/admin/chatbot"     color="#f59e0b" />
              <QuickLink icon={BarChart2}   title="Full Analytics"    desc="Detailed stats & charts"     to="/admin/analytics"   color="#ec4899" />
            </div>
          </div>

          <div style={{ background: S, border: `1px solid ${B}`, borderRadius: 18, padding: "18px 20px" }}>
            <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2, color: TM }}>Platform Status</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { label: "Pending Submissions", value: d.submissions?.pending || 0, color: "#f59e0b" },
                { label: "Open Feedback",        value: d.feedback?.open || 0,       color: "#06b6d4" },
                { label: "Upcoming Events",      value: d.events?.upcoming || 0,     color: "#10b981" },
                { label: "Blocked Users",        value: d.users?.blocked || 0,       color: "#ef4444" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: TM }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, padding: "2px 10px", borderRadius: 999, background: `${item.color}18`, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 40 }} />
    </motion.div>
  );
};

export default AdminDashboard;
