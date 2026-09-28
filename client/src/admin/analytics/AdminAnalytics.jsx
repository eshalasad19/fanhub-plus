import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  CalendarDays, MessageSquare, Bot, Users, BarChart2, FileText, CheckCircle, Clock, TrendingUp,
} from "lucide-react";
import PageHeader from "../shared/PageHeader.jsx";


const StatCard = ({ icon: Icon, label, value, sub, color = "#8b5cf6" }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="card"
    style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 13,
        background: `${color}20`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon size={22} style={{ color }} />
    </div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{value ?? "—"}</div>
      <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 3 }}>{label}</div>
      {sub && <div style={{ fontSize: 11.5, color, marginTop: 2, fontWeight: 600 }}>{sub}</div>}
    </div>
  </motion.div>
);


const Section = ({ title, children }) => (
  <div style={{ marginTop: 32 }}>
    <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8 }}>
      {title}
    </h3>
    {children}
  </div>
);


const Bar = ({ label, count, max, color = "#8b5cf6" }) => {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
      <div style={{ width: 110, fontSize: 13, fontWeight: 600, flexShrink: 0, textTransform: "capitalize" }}>{label}</div>
      <div style={{ flex: 1, height: 10, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ height: "100%", borderRadius: 999, background: `linear-gradient(90deg,${color},#a855f7)` }}
        />
      </div>
      <div style={{ width: 28, fontSize: 12.5, color: "var(--text-muted)", textAlign: "right", flexShrink: 0 }}>{count}</div>
    </div>
  );
};

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [eventsByCategory, setEventsByCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      axios.get("/api/analytics/summary"),
      axios.get("/api/analytics/events-by-category"),
    ]).then(([summary, evtCat]) => {
      if (summary.status === "fulfilled") setData(summary.value.data);
      if (evtCat.status === "fulfilled") setEventsByCategory(evtCat.value.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: "var(--text-muted)" }}>Loading analytics…</p>;
  if (!data) return <p style={{ color: "#ef4444" }}>Failed to load analytics data.</p>;

  const maxFeedbackType = Math.max(...(data.feedback.byType?.map((t) => t.count) || [1]));
  const maxChatSource = Math.max(...(data.chatbot.sourceBreakdown?.map((s) => s.count) || [1]));
  const maxEvtCat = Math.max(...(eventsByCategory.map((e) => e.count) || [1]));

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Platform-wide statistics and activity overview."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
        <StatCard icon={CalendarDays} label="Total Events" value={data.events.total} sub={`${data.events.upcoming} upcoming`} color="#8b5cf6" />
        <StatCard icon={MessageSquare} label="Total Feedback" value={data.feedback.total} sub={`${data.feedback.open} open`} color="#06b6d4" />
        <StatCard icon={CheckCircle} label="Resolved Feedback" value={data.feedback.resolved} color="#10b981" />
        <StatCard icon={Bot} label="Chatbot Messages" value={data.chatbot.totalMessages} sub={`${data.chatbot.activeFaqs} active FAQs`} color="#f59e0b" />
        <StatCard icon={FileText} label="Fan Submissions" value={data.submissions.total} sub={`${data.submissions.pending} pending`} color="#ec4899" />
        <StatCard icon={CheckCircle} label="Approved Submissions" value={data.submissions.approved} color="#10b981" />
      </div>

      {data.feedback.byType?.length > 0 && (
        <Section title="Feedback by Type">
          <div className="card" style={{ padding: 20 }}>
            {data.feedback.byType.map((t) => (
              <Bar key={t._id} label={t._id} count={t.count} max={maxFeedbackType} color="#06b6d4" />
            ))}
          </div>
        </Section>
      )}

      {data.chatbot.sourceBreakdown?.length > 0 && (
        <Section title="Chatbot Reply Sources">
          <div className="card" style={{ padding: 20 }}>
            {data.chatbot.sourceBreakdown.map((s) => (
              <Bar key={s._id} label={s._id} count={s.count} max={maxChatSource} color="#f59e0b" />
            ))}
          </div>
        </Section>
      )}

      {eventsByCategory.length > 0 && (
        <Section title="Events by Category">
          <div className="card" style={{ padding: 20 }}>
            {eventsByCategory.map((e) => (
              <Bar key={e._id} label={e._id} count={e.count} max={maxEvtCat} color="#8b5cf6" />
            ))}
          </div>
        </Section>
      )}

      {data.recent.feedback?.length > 0 && (
        <Section title="Recent Feedback">
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {data.recent.feedback.map((f, i) => (
              <div
                key={f._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "13px 18px",
                  borderBottom: i < data.recent.feedback.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: 11.5,
                    fontWeight: 700,
                    background: "rgba(6,182,212,0.12)",
                    color: "#06b6d4",
                    textTransform: "capitalize",
                    flexShrink: 0,
                  }}
                >
                  {f.type}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {f.message}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
                    {f.user?.name || "Unknown"} · {new Date(f.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    background: f.status === "open" ? "rgba(245,158,11,0.12)" : "rgba(16,185,129,0.12)",
                    color: f.status === "open" ? "#f59e0b" : "#10b981",
                    textTransform: "capitalize",
                    flexShrink: 0,
                  }}
                >
                  {f.status}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.recent.submissions?.length > 0 && (
        <Section title="Recent Fan Submissions">
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {data.recent.submissions.map((s, i) => (
              <div
                key={s._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "13px 18px",
                  borderBottom: i < data.recent.submissions.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: 11.5,
                    fontWeight: 700,
                    background: "rgba(236,72,153,0.12)",
                    color: "#ec4899",
                    flexShrink: 0,
                  }}
                >
                  {s.category}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
                    {s.user?.name || "Unknown"} · {new Date(s.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    background:
                      s.status === "approved" ? "rgba(16,185,129,0.12)"
                      : s.status === "rejected" ? "rgba(239,68,68,0.12)"
                      : "rgba(245,158,11,0.12)",
                    color:
                      s.status === "approved" ? "#10b981"
                      : s.status === "rejected" ? "#ef4444"
                      : "#f59e0b",
                    textTransform: "capitalize",
                    flexShrink: 0,
                  }}
                >
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default AdminAnalytics;
