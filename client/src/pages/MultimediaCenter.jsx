import { useState } from "react";
import useApi from "../hooks/useApi.js";
import { CATEGORIES } from "../constants/taxonomy.js";
import SearchBar from "../components/SearchBar.jsx";
import LoadingGrid from "../components/LoadingGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Pagination from "../components/Pagination.jsx";
import MediaPlayer from "../components/MediaPlayer.jsx";
import { motion } from "framer-motion";
import { FiPlayCircle, FiHeadphones, FiFilm, FiMusic, FiRadio } from "react-icons/fi";
import RatingStars from "../components/RatingStars.jsx";

import Breadcrumb from "../components/Breadcrumb.jsx";

const MEDIA_TYPES = [
  { value: "video",      label: "Videos" },
  { value: "trailer",    label: "Trailers" },
  { value: "audio",      label: "Audio" },
  { value: "podcast",    label: "Podcasts" },
  { value: "soundtrack", label: "Soundtracks" },
];

const TYPE_ICON = {
  video: FiPlayCircle, trailer: FiFilm,
  audio: FiHeadphones, podcast: FiRadio, soundtrack: FiMusic,
};


const ClickableMediaCard = ({ media, onPlay }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = TYPE_ICON[media.mediaType] || FiPlayCircle;
  const isAudio = ["audio", "podcast", "soundtrack"].includes(media.mediaType);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="card"
      style={{ cursor: "pointer", overflow: "hidden", padding: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onPlay(media)}
    >
      <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
        {media.thumbnail ? (
          <img
            src={media.thumbnail}
            alt={media.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: isAudio
              ? "linear-gradient(135deg,#1e1b4b,#4c1d95)"
              : "linear-gradient(135deg,#4c1d95,#7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon size={36} style={{ color: "rgba(255,255,255,0.6)" }} />
          </div>
        )}

        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <motion.div
            animate={hovered ? { scale: 1 } : { scale: 0.7 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "rgba(139,92,246,0.9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 24px rgba(139,92,246,0.6)",
            }}
          >
            <FiPlayCircle size={26} style={{ color: "#fff" }} />
          </motion.div>
        </motion.div>

        <div style={{
          position: "absolute", top: 8, left: 8,
          padding: "3px 9px", borderRadius: 999, fontSize: 10, fontWeight: 800,
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
          color: "#fff", textTransform: "uppercase", letterSpacing: 0.8,
        }}>
          {media.mediaType}
        </div>
      </div>

      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 6,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {media.title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <RatingStars
            value={media.ratingAvg}
            count={media.ratingCount}
            interactive={true}
            targetType="Media"
            targetId={media._id}
            size={14}
          />
          {(media.category?.name || typeof media.category === "string") && (
            <span style={{
              fontSize: 11, color: "var(--text-muted)",
              border: "1px solid var(--border)", borderRadius: 999, padding: "2px 8px",
            }}>
              {typeof media.category === "object" ? media.category.name : media.category}
            </span>
          )}
        </div>
        {media.duration && (
          <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 5 }}>
            ⏱ {media.duration}
          </div>
        )}
      </div>
    </motion.div>
  );
};


const MultimediaCenter = () => {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [page, setPage] = useState(1);
  const [playing, setPlaying] = useState(null); 

  const params = { q, category, mediaType, page, limit: 100 };
  const { data, loading } = useApi("/media", params, [JSON.stringify(params)]);

  const selectStyle = {
    border: "1px solid var(--border)", background: "var(--surface)",
    color: "var(--text)", borderRadius: 10, padding: "9px 14px",
    fontSize: 14, cursor: "pointer",
  };

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Breadcrumb items={[{ label: "Multimedia" }]} />
      <h1 style={{ fontSize: 30, marginBottom: 20 }}>Multimedia Center</h1>

      <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 240px", maxWidth: 360 }}>
          <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search videos, trailers, audio..." />
        </div>
        <select style={selectStyle} value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        <select style={selectStyle} value={mediaType} onChange={(e) => { setMediaType(e.target.value); setPage(1); }}>
          <option value="">All Media Types</option>
          {MEDIA_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {loading && <LoadingGrid height={220} />}
      {!loading && data?.items?.length === 0 && <EmptyState message="No media found." />}
      {!loading && data?.items?.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {data.items.map((m) => (
            <ClickableMediaCard key={m._id} media={m} onPlay={setPlaying} />
          ))}
        </div>
      )}
      {data?.meta && <Pagination page={data.meta.page} pages={data.meta.pages} onChange={setPage} />}

      <MediaPlayer
        open={!!playing}
        onClose={() => setPlaying(null)}
        src={playing?.url || playing?.mediaUrl}
        type={playing?.mediaType || playing?.type}
        title={playing?.title}
        thumbnail={playing?.thumbnail}
      />
    </div>
  );
};

export default MultimediaCenter;
