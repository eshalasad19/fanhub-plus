import { motion } from "framer-motion";
import { FiPlayCircle, FiHeadphones, FiFilm, FiMusic, FiRadio } from "react-icons/fi";
import RatingStars from "./RatingStars.jsx";

const TYPE_ICON = {
  video: FiPlayCircle,
  trailer: FiFilm,
  audio: FiHeadphones,
  podcast: FiRadio,
  soundtrack: FiMusic,
};

const isYouTube = (url = "") => /youtube\.com|youtu\.be/.test(url);
const isArchiveOrg = (url = "") => /archive\.org/.test(url);
const isDirectVideo = (url = "") => /\.(mp4|webm|ogg)$/i.test(url);

const toYouTubeEmbed = (url) => url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/");
const toArchiveEmbed = (url) => {
  const match = url.match(/archive\.org\/(?:details|embed)\/([^/?#]+)/);
  return match ? `https://archive.org/embed/${match[1]}` : url;
};

const MediaCard = ({ media }) => {
  const Icon = TYPE_ICON[media.mediaType] || FiPlayCircle;
  const isAudio = media.mediaType === "audio" || media.mediaType === "podcast" || media.mediaType === "soundtrack";
  const iframeSrc = isYouTube(media.url) ? toYouTubeEmbed(media.url) : isArchiveOrg(media.url) ? toArchiveEmbed(media.url) : null;

  return (
    <motion.div whileHover={{ y: -6 }} className="card">
      {!isAudio && iframeSrc ? (
        <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 12, aspectRatio: "16/9" }}>
          <iframe
            src={iframeSrc}
            title={media.title}
            style={{ width: "100%", height: "100%", border: "none" }}
            allowFullScreen
          />
        </div>
      ) : !isAudio && isDirectVideo(media.url) ? (
        <video
          controls
          poster={media.thumbnail || undefined}
          src={media.url}
          style={{ width: "100%", borderRadius: 12, marginBottom: 12, aspectRatio: "16/9", background: "#000" }}
        />
      ) : !isAudio && (
        <div
          style={{
            height: 130,
            borderRadius: 12,
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: media.thumbnail ? `url(${media.thumbnail}) center/cover` : "var(--gradient)",
          }}
        >
          <Icon size={32} color="white" />
        </div>
      )}

      {isAudio && (
        <audio controls src={media.url} style={{ width: "100%", marginBottom: 10 }} />
      )}

      <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, textTransform: "uppercase" }}>
        {media.mediaType} {media.duration ? `· ${media.duration}` : ""}
      </div>
      <div style={{ fontWeight: 700, fontSize: 15, margin: "4px 0 8px" }}>{media.title}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
        <RatingStars
          value={media.ratingAvg}
          count={media.ratingCount}
          interactive={true}
          targetType="Media"
          targetId={media._id}
          size={15}
        />
        {media.category?.name && (
          <span style={{ fontSize: 11, color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 999, padding: "2px 8px" }}>
            {media.category.name}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default MediaCard;
