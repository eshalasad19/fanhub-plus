import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiUsers, FiEye, FiFeather, FiShield } from "react-icons/fi";
import useApi from "../hooks/useApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingGrid from "../components/LoadingGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";

const ContributorCard = ({ c }) => (
  <Link to={`/community/${c._id}`} style={{ textDecoration: "none", color: "inherit" }}>
    <motion.div whileHover={{ y: -3 }} className="card" style={{ padding: 20, height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: c.avatar ? `url(${c.avatar}) center/cover` : "var(--gradient)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {!c.avatar && (c.name?.[0]?.toUpperCase() || "?")}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}>
            {c.name}
            {c.role === "admin" && <FiShield size={12} color="#a855f7" />}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {c.favoriteCategories?.length ? c.favoriteCategories.map((f) => f.name).join(", ") : "Fan Hub contributor"}
          </div>
        </div>
      </div>
      {c.bio && <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 14px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{c.bio}</p>}
      <div style={{ display: "flex", gap: 16, fontSize: 12.5, color: "var(--text-muted)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <FiFeather size={13} /> {c.approvedCount} posts
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <FiEye size={13} /> {c.totalViews} views
        </span>
      </div>
    </motion.div>
  </Link>
);

const Community = () => {
  const { user } = useAuth();
  const { data: contributors, loading, error } = useApi("/community");
  const isContributor = user?.role === "user" || user?.role === "admin";

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Breadcrumb items={[{ label: "Contributors" }]} />
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 28, marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
        <FiUsers /> Fan <span className="gradient-text">Contributors</span>
      </motion.h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
        Everyone who can submit fan content, once their account is upgraded and approved by our team.
      </p>

      {!isContributor && (
        <div className="card" style={{ padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13.5, color: "var(--text-muted)" }}>Want to join this list? Convert your account to a contributor from your profile.</span>
          <Link to="/profile" className="btn" style={{ fontSize: 12.5, padding: "8px 16px" }}>Become a Contributor</Link>
        </div>
      )}

      {loading && <LoadingGrid count={6} height={140} />}
      {!loading && error && <EmptyState message="Couldn't load contributors right now." />}
      {!loading && !error && (contributors?.length || 0) === 0 && <EmptyState message="No contributors yet — be the first!" />}

      {!loading && !error && contributors?.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
          {contributors.map((c) => (
            <ContributorCard key={c._id} c={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;
