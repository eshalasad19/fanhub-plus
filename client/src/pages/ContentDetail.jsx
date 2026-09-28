import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiTrendingUp } from "react-icons/fi";
import axios from "axios";
import useApi from "../hooks/useApi.js";
import RatingStars from "../components/RatingStars.jsx";
import WatchProviders from "../components/WatchProviders.jsx";
import CharacterCard from "../components/CharacterCard.jsx";
import MediaCard from "../components/MediaCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

import Breadcrumb from "../components/Breadcrumb.jsx";

const ContentDetail = () => {
  const { id } = useParams();
  const { data: item, loading } = useApi(`/content/${id}`, {}, [id]);
  const { data: chars } = useApi("/characters", { content: id }, [id]);
  const { data: media } = useApi("/media", { content: id, limit: 100 }, [id]);

  
  useEffect(() => {
    axios.post(`/api/content/${id}/view`).catch(() => {});
  }, [id]);

  if (loading) return <div className="container" style={{ paddingTop: 60 }}>Loading...</div>;
  if (!item) return <EmptyState message="Content not found." />;

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Breadcrumb
        items={[
          { label: "Explore", to: "/explore" },
          { label: item.category?.name || "Content", to: item.category?.name ? `/category/${item.category.name}` : "/explore" },
          { label: item.title },
        ]}
      />
      <Link to="/explore" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-muted)", marginBottom: 20 }}>
        <FiArrowLeft /> Back to Explorer
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
        <div
          style={{
            width: 220,
            height: 300,
            borderRadius: 14,
            flexShrink: 0,
            background: item.coverImage ? `url(${item.coverImage}) center/cover` : "var(--gradient)",
          }}
        />
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700, textTransform: "uppercase" }}>
            {item.category?.name} · {item.contentType}
          </div>
          <h1 style={{ fontSize: 32, margin: "6px 0 12px" }}>{item.title}</h1>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <RatingStars
              value={item.ratingAvg}
              count={item.ratingCount}
              size={18}
              interactive={true}
              targetType="Content"
              targetId={item._id}
            />
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--text-muted)" }}>
              <FiTrendingUp /> {item.popularity} popularity
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {(item.genre || []).map((g) => (
              <span key={g} style={{ fontSize: 12, border: "1px solid var(--border)", borderRadius: 999, padding: "4px 12px" }}>
                {g}
              </span>
            ))}
          </div>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>{item.description}</p>
          <div style={{ marginTop: 16, fontSize: 13, color: "var(--text-muted)" }}>
            {item.releaseYear} · {item.status}
          </div>
        </div>
      </motion.div>

      {item.watchProviders?.length > 0 && (
        <WatchProviders
          providers={item.watchProviders}
          title={item.title}
          contentType={item.contentType}
        />
      )}

      {media?.items?.length > 0 && (
        <div style={{ marginTop: 44 }}>
          <h2 style={{ fontSize: 24, marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
            Cinema Theater & Official Media
          </h2>

          {(() => {
            const featured = media.items.find((m) => m.mediaType === "trailer" || m.mediaType === "video") || media.items[0];
            const url = featured?.url || "";
            const isYt = /youtube\.com|youtu\.be/.test(url);
            const isArchive = /archive\.org/.test(url);
            const isDirect = /\.(mp4|webm|ogg)$/i.test(url);
            const embedUrl = isYt
              ? url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
              : isArchive
              ? (() => {
                  const match = url.match(/archive\.org\/(?:details|embed)\/([^/?#]+)/);
                  return match ? `https://archive.org/embed/${match[1]}` : null;
                })()
              : null;
            if (!embedUrl && !isDirect) return null;
            return (
              <div
                className="card"
                style={{
                  padding: 16,
                  marginBottom: 28,
                  background: "#000",
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                }}
              >
                <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", height: 0 }}>
                  {isDirect ? (
                    <video
                      controls
                      src={url}
                      poster={featured.thumbnail || undefined}
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 12, background: "#000" }}
                    />
                  ) : (
                    <iframe
                      src={embedUrl}
                      title={featured.title}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                        borderRadius: 12,
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, padding: "0 8px" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, textTransform: "uppercase" }}>
                      Now Playing · {featured.mediaType}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>{featured.title}</div>
                  </div>
                </div>
              </div>
            );
          })()}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {media.items.map((m) => (
              <MediaCard key={m._id} media={m} />
            ))}
          </div>
        </div>
      )}

      {chars?.items?.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 22, marginBottom: 18 }}>Characters</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 18 }}>
            {chars.items.map((c) => (
              <CharacterCard key={c._id} character={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentDetail;
