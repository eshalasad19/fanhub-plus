import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiPause,
  FiArrowRight,
  FiStar,
  FiZap,
  FiShoppingBag,
  FiCompass,
} from "react-icons/fi";
import { Sparkles, Flame } from "lucide-react";

const SLIDER_ITEMS = [
  {
    id: 1,
    title: "Cyberpunk 2077 & Edgerunners",
    category: "Gaming & Anime",
    tag: "Trending Universe",
    tagColor: "#ec4899",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    description: "Dive deep into Night City lore, chrome cyberware builds, and exclusive character archives.",
    link: "/category/Gaming",
    actionText: "Explore Universe",
  },
  {
    id: 2,
    title: "Demon Slayer: Infinity Castle",
    category: "Anime",
    tag: "Top Rated Lore",
    tagColor: "#f43f5e",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
    description: "Unravel character breath styles, Hashira backstories, and the newest episode breakdowns.",
    link: "/category/Anime",
    actionText: "Discover Lore",
  },
  {
    id: 3,
    title: "Limited Edition Collector Figures",
    category: "Merchandise",
    tag: "Rare Drop",
    tagColor: "#f59e0b",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    description: "Pre-order certified authentic 1/7 scale statues, resin figures, and exclusive anime apparel.",
    link: "/merchandise",
    actionText: "Visit Vault",
  },
  {
    id: 4,
    title: "Cinematic Sci-Fi & Superhero Hub",
    category: "Movies & Comics",
    tag: "Blockbuster",
    tagColor: "#8b5cf6",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    description: "Track cinematic universes, upcoming movie release dates, easter eggs, and fan theories.",
    link: "/category/Movies",
    actionText: "View Releases",
  },
  {
    id: 5,
    title: "Genshin Impact & Honkai Lore",
    category: "Gaming",
    tag: "High Energy",
    tagColor: "#06b6d4",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    description: "Comprehensive character builds, tier lists, multimedia osts, and voice actor interviews.",
    link: "/category/Gaming",
    actionText: "Enter Realm",
  },
];

const MARQUEE_ITEMS = [
  { title: "Solo Leveling: Arise", cat: "Anime", img: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80", tag: "Hot Drop" },
  { title: "Final Fantasy VII Rebirth", cat: "Gaming", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80", tag: "RPG Lore" },
  { title: "Neon Genesis Evangelion 3.0", cat: "Mecha", img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80", tag: "Classic" },
  { title: "Arcane: League of Legends", cat: "Animation", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80", tag: "Emmy Winner" },
  { title: "Spider-Man: Beyond The Spider-Verse", cat: "Comics", img: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=400&q=80", tag: "Multiverse" },
  { title: "Zelda: Tears of the Kingdom", cat: "Adventure", img: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80", tag: "Masterpiece" },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.4 },
      scale: { duration: 0.4 },
    },
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.3 },
    },
  }),
};

const DashboardImageSlider = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const activeIndex = ((page % SLIDER_ITEMS.length) + SLIDER_ITEMS.length) % SLIDER_ITEMS.length;
  const currentItem = SLIDER_ITEMS[activeIndex];

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    if (!isPlaying || isHovered) return;
    timerRef.current = setInterval(() => {
      paginate(1);
    }, 4500);

    return () => clearInterval(timerRef.current);
  }, [page, isPlaying, isHovered]);

  return (
    <div style={{ marginBottom: 36 }}>
      {/* Main Animated Slider Banner */}
      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "relative",
          borderRadius: 24,
          overflow: "hidden",
          border: "1px solid var(--border)",
          boxShadow: "0 18px 45px rgba(219,39,119,0.25)",
          background: "var(--surface)",
          height: 380,
        }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${currentItem.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Gradients Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(12,7,20,0.92) 0%, rgba(12,7,20,0.7) 50%, rgba(12,7,20,0.3) 100%), linear-gradient(0deg, rgba(12,7,20,0.95) 0%, transparent 60%)",
              }}
            />

            {/* Slide Content */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "32px 36px",
                zIndex: 2,
              }}
            >
              {/* Top Meta Bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      padding: "5px 14px",
                      borderRadius: 999,
                      fontSize: 11.5,
                      fontWeight: 800,
                      background: currentItem.tagColor,
                      color: "#fff",
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      boxShadow: `0 4px 14px ${currentItem.tagColor}50`,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Sparkles size={12} /> {currentItem.tag}
                  </span>
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: 999,
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: "rgba(0,0,0,0.6)",
                      backdropFilter: "blur(8px)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    {currentItem.category}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.55)",
                      backdropFilter: "blur(6px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                  >
                    {isPlaying ? <FiPause size={14} /> : <FiPlay size={14} />}
                  </button>
                </div>
              </div>

              {/* Bottom Content Area */}
              <div style={{ maxWidth: 640 }}>
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  style={{
                    fontSize: "clamp(24px, 3.5vw, 36px)",
                    fontWeight: 900,
                    color: "#fff",
                    margin: "0 0 10px",
                    lineHeight: 1.18,
                    textShadow: "0 2px 14px rgba(0,0,0,0.8)",
                  }}
                >
                  {currentItem.title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.4 }}
                  style={{
                    color: "rgba(255,255,255,0.88)",
                    fontSize: 14.5,
                    lineHeight: 1.5,
                    margin: "0 0 20px",
                    textShadow: "0 1px 8px rgba(0,0,0,0.6)",
                  }}
                >
                  {currentItem.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  style={{ display: "flex", gap: 12, alignItems: "center" }}
                >
                  <Link
                    to={currentItem.link}
                    className="btn"
                    style={{
                      padding: "12px 24px",
                      fontSize: 13.5,
                      fontWeight: 800,
                      gap: 8,
                      boxShadow: "0 8px 24px rgba(219,39,119,0.5)",
                    }}
                  >
                    <span>{currentItem.actionText}</span>
                    <FiArrowRight size={15} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Left / Right Nav Arrows */}
        <button
          onClick={() => paginate(-1)}
          aria-label="Previous slide"
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.25)",
            background: "rgba(12,7,20,0.65)",
            backdropFilter: "blur(10px)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
        >
          <FiChevronLeft size={22} />
        </button>

        <button
          onClick={() => paginate(1)}
          aria-label="Next slide"
          style={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.25)",
            background: "rgba(12,7,20,0.65)",
            backdropFilter: "blur(10px)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
        >
          <FiChevronRight size={22} />
        </button>

        {/* Indicator Dots */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            right: 28,
            zIndex: 10,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          {SLIDER_ITEMS.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                onClick={() => setPage([idx, idx > activeIndex ? 1 : -1])}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: isActive ? 28 : 8,
                  height: 8,
                  borderRadius: 999,
                  border: "none",
                  background: isActive ? "var(--primary)" : "rgba(255,255,255,0.35)",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: isActive ? "0 0 10px rgba(219,39,119,0.8)" : "none",
                }}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Animated Moving Marquee Strip (Continuous Gliding Cards) */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          marginTop: 18,
          overflow: "hidden",
          borderRadius: 16,
          background: "linear-gradient(135deg, rgba(236,72,153,0.08), rgba(147,51,234,0.04))",
          border: "1px solid var(--border)",
          padding: "12px 0",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            paddingLeft: 18,
            marginBottom: 10,
            fontSize: 12,
            fontWeight: 800,
            color: "var(--primary)",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          <Flame size={14} color="#f43f5e" />
          <span>Trending Fandom Spotlight Reel</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>• Auto-Gliding Reel</span>
        </div>

        {/* Marquee Track */}
        <div className="marquee-wrapper" style={{ display: "flex", width: "max-content" }}>
          <div className="marquee-track" style={{ display: "flex", gap: 16, padding: "0 10px" }}>
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((m, idx) => (
              <motion.div
                key={`${m.title}_${idx}`}
                whileHover={{ scale: 1.05, y: -4, borderColor: "var(--primary)" }}
                style={{
                  width: 220,
                  height: 90,
                  borderRadius: 14,
                  overflow: "hidden",
                  position: "relative",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                  flexShrink: 0,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${m.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(12,7,20,0.92) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    padding: "10px 12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      alignSelf: "flex-start",
                      fontSize: 9.5,
                      fontWeight: 800,
                      padding: "2px 7px",
                      borderRadius: 999,
                      background: "rgba(219,39,119,0.75)",
                      color: "#fff",
                      textTransform: "uppercase",
                    }}
                  >
                    {m.tag}
                  </span>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--accent-2)", fontWeight: 700, textTransform: "uppercase" }}>
                      {m.cat}
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        fontWeight: 800,
                        color: "#fff",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {m.title}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marqueeScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-track {
            animation: marqueeScroll 28s linear infinite;
          }
          .marquee-wrapper:hover .marquee-track {
            animation-play-state: paused;
          }
        `}</style>
      </motion.div>
    </div>
  );
};

export default DashboardImageSlider;
