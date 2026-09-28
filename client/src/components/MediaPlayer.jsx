import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { FiPlayCircle, FiHeadphones, FiFilm, FiMusic, FiRadio } from "react-icons/fi";


const getYouTubeId = (url = "") => {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([\\w-]{11})/);
  return match?.[1] || null;
};
const isYouTube   = (url = "") => /youtube\.com|youtu\.be/.test(url);
const isArchive   = (url = "") => /archive\.org/.test(url);
const isDirectVid = (url = "") => /\.(mp4|webm|ogg)(\?|$)/i.test(url);
const isDirectAud = (url = "") => /\.(mp3|wav|ogg|flac|aac)(\?|$)/i.test(url);

const toArchiveEmbed = (url) => {
  const m = url.match(/archive\.org\/(?:details|embed)\/([^/?#]+)/);
  return m ? `https://archive.org/embed/${m[1]}` : url;
};
const toYouTubeEmbed = (url) =>
  url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/");

const TYPE_ICON = {
  video: FiPlayCircle, trailer: FiFilm,
  audio: FiHeadphones, podcast: FiRadio, soundtrack: FiMusic,
};
const AUDIO_TYPES = ["audio", "podcast", "soundtrack"];



const MediaPlayer = ({ open, onClose, src, type = "video", title, thumbnail }) => {
  
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isAudio = AUDIO_TYPES.includes(type);
  const Icon    = TYPE_ICON[type] || FiPlayCircle;

  
  let embedType = "none";
  if (!isAudio && isYouTube(src))   embedType = "youtube";
  else if (!isAudio && isArchive(src)) embedType = "archive";
  else if (!isAudio && isDirectVid(src)) embedType = "video";
  else if (isAudio  && isDirectAud(src)) embedType = "audio";
  else if (isAudio)                      embedType = "audio"; 

  const embedSrc = embedType === "youtube"
    ? toYouTubeEmbed(src) + "?autoplay=1&rel=0"
    : embedType === "archive"
    ? toArchiveEmbed(src)
    : src;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 1000,
              background: "rgba(0,0,0,0.88)",
              backdropFilter: "blur(8px)",
            }}
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1001,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px 16px",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: isAudio ? 520 : 860,
                background: "#0d0a17",
                border: "1px solid rgba(139,92,246,0.3)",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 30px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(139,92,246,0.1)",
                pointerEvents: "auto",
              }}
            >
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "14px 18px",
                borderBottom: "1px solid rgba(139,92,246,0.15)",
                background: "rgba(139,92,246,0.06)",
              }}>
                <Icon size={16} style={{ color: "#a855f7", flexShrink: 0 }} />
                <div style={{
                  flex: 1, fontWeight: 700, fontSize: 14,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  color: "#f3edff",
                }}>
                  {title || "Playing…"}
                </div>
                {src && (
                  <a
                    href={src} target="_blank" rel="noreferrer"
                    style={{ color: "rgba(168,85,247,0.7)", display: "flex", flexShrink: 0 }}
                    title="Open original"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
                <button
                  onClick={onClose}
                  style={{
                    width: 28, height: 28, borderRadius: 8, border: "none",
                    background: "rgba(239,68,68,0.12)", color: "#ef4444",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", flexShrink: 0,
                  }}
                >
                  <X size={14} />
                </button>
              </div>

              <div style={{ background: "#000" }}>
                {embedType === "youtube" || embedType === "archive" ? (
                  <div style={{ aspectRatio: "16/9" }}>
                    <iframe
                      src={embedSrc}
                      title={title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                    />
                  </div>
                ) : embedType === "video" ? (
                  <video
                    src={src}
                    controls
                    autoPlay
                    poster={thumbnail}
                    style={{ width: "100%", display: "block", maxHeight: 480, background: "#000" }}
                  />
                ) : embedType === "audio" ? (
                  <div style={{
                    padding: "36px 32px",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
                    background: "linear-gradient(135deg,#1a0a2e,#0d0a17)",
                  }}>
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={title}
                        style={{ width: 120, height: 120, borderRadius: 16, objectFit: "cover",
                          boxShadow: "0 0 30px rgba(139,92,246,0.4)" }}
                      />
                    ) : (
                      <div style={{
                        width: 120, height: 120, borderRadius: 16,
                        background: "linear-gradient(135deg,#4c1d95,#7c3aed)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 0 30px rgba(139,92,246,0.4)",
                      }}>
                        <Icon size={48} style={{ color: "rgba(255,255,255,0.8)" }} />
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 5, alignItems: "flex-end", height: 28 }}>
                      {[0.4, 0.8, 1, 0.6, 0.9, 0.5, 0.7, 1, 0.4, 0.8].map((h, i) => (
                        <motion.div
                          key={i}
                          animate={{ scaleY: [h, 1, h * 0.5, 1, h] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
                          style={{
                            width: 4, height: 28, borderRadius: 3,
                            background: `rgba(168,85,247,${h})`,
                            transformOrigin: "bottom",
                          }}
                        />
                      ))}
                    </div>
                    <audio
                      src={src}
                      controls
                      autoPlay
                      style={{ width: "100%", accentColor: "#8b5cf6" }}
                    />
                  </div>
                ) : (
                  
                  <div style={{
                    padding: "48px 24px", textAlign: "center",
                    color: "rgba(255,255,255,0.4)", fontSize: 14,
                  }}>
                    <Icon size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
                    <div>Media source unavailable for inline playback.</div>
                    {src && (
                      <a href={src} target="_blank" rel="noreferrer"
                        style={{ color: "#a855f7", fontWeight: 600, marginTop: 10, display: "inline-block" }}>
                        Open externally ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MediaPlayer;
