import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiBookmark, FiX } from "react-icons/fi";
import useApi from "../hooks/useApi.js";
import api from "../api/client.js";
import EmptyState from "../components/EmptyState.jsx";
import LoadingGrid from "../components/LoadingGrid.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";

const Bookmarks = () => {
  const { data: bookmarks, loading, refetch } = useApi("/bookmarks");

  const handleRemove = async (bookmarkId) => {
    try {
      await api.delete(`/bookmarks/${bookmarkId}`);
      refetch();
    } catch (err) {
      console.error("Failed to remove bookmark", err);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Breadcrumb items={[{ label: "Bookmarks" }]} />
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 28, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}
      >
        <FiBookmark /> Your <span className="gradient-text">Bookmarks</span>
      </motion.h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>
        Everything you've saved across Fan Hub Plus, in one place.
      </p>

      {loading ? (
        <LoadingGrid count={8} height={110} />
      ) : !bookmarks || bookmarks.length === 0 ? (
        <EmptyState message="No bookmarks yet. Browse content, characters, articles or merch and tap Bookmark to save them here." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {bookmarks.map((b) => (
            <div key={b.bookmarkId} className="card" style={{ padding: 14, display: "flex", gap: 12, alignItems: "center", position: "relative" }}>
              <Link to={b.item.link} style={{ display: "flex", gap: 12, alignItems: "center", flex: 1, overflow: "hidden" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    flexShrink: 0,
                    background: b.item.image ? `url(${b.item.image}) center/cover` : "var(--gradient)",
                  }}
                />
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {b.item.title}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "capitalize" }}>
                    {b.item.itemType} · {b.item.subtitle}
                  </div>
                </div>
              </Link>
              <button
                onClick={() => handleRemove(b.bookmarkId)}
                title="Remove bookmark"
                style={{
                  border: "none",
                  background: "transparent",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: 6,
                  flexShrink: 0,
                }}
              >
                <FiX size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
