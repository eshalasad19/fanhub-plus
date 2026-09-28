import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import useApi from "../hooks/useApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import ContentCard from "../components/ContentCard.jsx";
import LoadingGrid from "../components/LoadingGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";




const Favourites = () => {
  const { user } = useAuth();
  const { data, loading, error } = useApi("/content/recommended", { limit: 24 });
  const favoriteCategories = user?.favoriteCategories || [];

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Breadcrumb items={[{ label: "Favourites" }]} />
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 28, marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
        <FiHeart /> Your <span className="gradient-text">Favourites</span>
      </motion.h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
        Content picked from the fandoms you follow{favoriteCategories.length > 0 ? `: ${favoriteCategories.map((c) => c.name).join(", ")}` : "."}
      </p>

      {favoriteCategories.length === 0 && (
        <div className="card" style={{ padding: 28, textAlign: "center", marginBottom: 28 }}>
          <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "0 0 14px" }}>
            You haven't picked your favorite fandom categories yet.
          </p>
          <Link to="/profile" className="btn" style={{ fontSize: 13, padding: "8px 18px", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <FiHeart size={14} /> Select Favorite Fandoms
          </Link>
        </div>
      )}

      {loading && <LoadingGrid />}
      {!loading && error && <EmptyState message="Couldn't load your favourites right now." />}
      {!loading && !error && favoriteCategories.length > 0 && (data?.items?.length || 0) === 0 && (
        <EmptyState message="No content published in your fandoms yet — check back soon." />
      )}

      {!loading && !error && data?.items?.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}
        >
          {data.items.map((item) => (
            <ContentCard key={item._id} item={item} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Favourites;
