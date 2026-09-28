import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiBarChart2, FiEye, FiCheckCircle, FiClock, FiXCircle, FiFeather } from "react-icons/fi";
import useApi from "../hooks/useApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingGrid from "../components/LoadingGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";

const StatBox = ({ label, value, color, icon: Icon }) => (
  <div className="card" style={{ padding: "18px 20px", flex: "1 1 140px", display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}1c`, color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon size={17} />
    </div>
    <div>
      <div style={{ fontSize: 20, fontWeight: 900 }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
    </div>
  </div>
);

const STATUS_STYLE = {
  approved: { color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  pending: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  rejected: { color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

const ContentAnalytics = () => {
  const { user } = useAuth();
  const isContributor = user?.role === "user" || user?.role === "admin";
  const { data, loading, error } = useApi(isContributor ? "/fan-content/analytics" : null);

  if (!isContributor) {
    return (
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <Breadcrumb items={[{ label: "My Content Analytics" }]} />
        <div className="card" style={{ padding: 28, textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: 14 }}>Analytics are available once you become a contributor.</p>
          <Link to="/profile" className="btn" style={{ fontSize: 13, padding: "8px 18px", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <FiFeather size={14} /> Become a Contributor
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="container" style={{ paddingTop: 40 }}><LoadingGrid count={4} height={90} /></div>;
  if (error || !data) return <div className="container" style={{ paddingTop: 40 }}><EmptyState message="Couldn't load your analytics right now." /></div>;

  const { summary, topContent } = data;

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Breadcrumb items={[{ label: "My Content Analytics" }]} />
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 28, marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
        <FiBarChart2 /> Content <span className="gradient-text">Analytics</span>
      </motion.h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>How your fan submissions are performing.</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 36 }}>
        <StatBox label="Total Submissions" value={summary.total} color="#8b5cf6" icon={FiFeather} />
        <StatBox label="Approved" value={summary.approved} color="#10b981" icon={FiCheckCircle} />
        <StatBox label="Pending Review" value={summary.pending} color="#f59e0b" icon={FiClock} />
        <StatBox label="Rejected" value={summary.rejected} color="#ef4444" icon={FiXCircle} />
        <StatBox label="Total Views" value={summary.totalViews} color="#3b82f6" icon={FiEye} />
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Your Content, By Views</h2>
      {topContent.length === 0 ? (
        <div className="card" style={{ padding: 28, textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: 14 }}>You haven't submitted any fan content yet.</p>
          <Link to="/submit" className="btn" style={{ fontSize: 13, padding: "8px 18px" }}>Share Fan Content</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {topContent.map((s) => {
            const st = STATUS_STYLE[s.status] || STATUS_STYLE.pending;
            return (
              <div key={s._id} className="card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.category}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: st.bg, color: st.color, textTransform: "capitalize" }}>
                    {s.status}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-muted)" }}>
                    <FiEye size={13} /> {s.views}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContentAnalytics;
