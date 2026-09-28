import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiShield, FiArrowLeft } from "react-icons/fi";
import useApi from "../hooks/useApi.js";
import LoadingGrid from "../components/LoadingGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";

const ContributorProfile = () => {
  const { id } = useParams();
  const { data, loading, error } = useApi(`/community/${id}`);

  if (loading) return <div className="container" style={{ paddingTop: 40 }}><LoadingGrid count={4} height={140} /></div>;
  if (error || !data) return <div className="container" style={{ paddingTop: 40 }}><EmptyState message="Contributor not found." /></div>;

  const { user, submissions } = data;

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Breadcrumb items={[{ label: "Contributors", to: "/community" }, { label: user.name }]} />
      <Link to="/community" style={{ fontSize: 13, color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
        <FiArrowLeft size={14} /> All Contributors
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 26, marginBottom: 28, display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <div
          style={{
            width: 64, height: 64, borderRadius: "50%",
            background: user.avatar ? `url(${user.avatar}) center/cover` : "var(--gradient)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 22, color: "#fff", flexShrink: 0,
          }}
        >
          {!user.avatar && (user.name?.[0]?.toUpperCase() || "?")}
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
            {user.name}
            {user.role === "admin" && <FiShield size={14} color="#a855f7" />}
          </div>
          {user.bio && <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: 13.5 }}>{user.bio}</p>}
          {user.favoriteCategories?.length > 0 && (
            <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: 12.5 }}>
              Fandoms: {user.favoriteCategories.map((f) => f.name).join(", ")}
            </p>
          )}
        </div>
      </motion.div>

      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Approved Fan Content ({submissions.length})</h2>
      {submissions.length === 0 ? (
        <EmptyState message="No approved posts yet." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
          {submissions.map((s) => (
            <div key={s._id} className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--accent)", marginBottom: 6 }}>{s.category}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{s.title}</div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 10px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                {s.content}
              </p>
              <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                <FiEye size={13} /> {s.views || 0} views
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContributorProfile;
