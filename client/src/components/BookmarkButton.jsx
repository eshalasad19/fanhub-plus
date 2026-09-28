import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiBookmark } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";


const BookmarkButton = ({ itemType, itemId, size = 16 }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !itemId) {
      setChecked(true);
      return;
    }
    api
      .get("/bookmarks/check", { params: { itemType, itemId } })
      .then((res) => setBookmarked(res.data.bookmarked))
      .catch(() => {})
      .finally(() => setChecked(true));
  }, [isAuthenticated, itemType, itemId]);

  const toggle = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      if (bookmarked) {
        await api.delete("/bookmarks/by-item", { params: { itemType, itemId } });
        setBookmarked(false);
      } else {
        await api.post("/bookmarks", { itemType, itemId });
        setBookmarked(true);
      }
    } catch (err) {
      console.error("Failed to toggle bookmark", err);
    } finally {
      setBusy(false);
    }
  };

  if (!checked) return null;

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.9 }}
      disabled={busy}
      title={bookmarked ? "Remove bookmark" : "Bookmark this"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        border: "1px solid var(--border)",
        background: bookmarked ? "var(--gradient)" : "var(--surface)",
        color: bookmarked ? "#fff" : "var(--text)",
        borderRadius: 999,
        padding: "8px 14px",
        fontSize: 13,
        fontWeight: 600,
        cursor: busy ? "default" : "pointer",
        opacity: busy ? 0.7 : 1,
      }}
    >
      <FiBookmark size={size} fill={bookmarked ? "#fff" : "none"} />
      {bookmarked ? "Bookmarked" : "Bookmark"}
    </motion.button>
  );
};

export default BookmarkButton;
