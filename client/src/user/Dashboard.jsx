import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiBookmark,
  FiEdit3,
  FiClock,
  FiHeart,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiPlusCircle,
  FiStar,
  FiEye,
  FiCompass,
  FiFilm,
  FiCalendar,
  FiShoppingBag,
  FiCheckCircle,
  FiTrendingUp,
  FiShield,
  FiBarChart2,
  FiFeather,
  FiSearch,
  FiFilter,
  FiGrid,
  FiLayers,
  FiExternalLink,
  FiTag,
  FiPlay,
  FiActivity,
  FiList,
  FiSliders,
  FiZap,
  FiAward,
} from "react-icons/fi";
import { Sparkles, Flame, Gift, Compass, Trophy, Zap, Smile, MessageCircle, Star } from "lucide-react";
import useApi from "../hooks/useApi.js";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingGrid from "../components/LoadingGrid.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";
import ContentCard from "../components/ContentCard.jsx";
import ArticleCard from "../components/ArticleCard.jsx";
import CharacterCard from "../components/CharacterCard.jsx";
import MediaCard from "../components/MediaCard.jsx";
import MerchCard from "../components/MerchCard.jsx";
import ReleaseCard from "../components/ReleaseCard.jsx";
import LottieAnimation from "../components/LottieAnimation.jsx";
import TypewriterText from "../components/TypewriterText.jsx";
import DashboardImageSlider from "../components/DashboardImageSlider.jsx";
import { sparklesLottie, mascotLottie } from "../assets/lottieData.js";

const CATEGORY_META = {
  Anime: { color: "#ec4899", icon: "⚔️" },
  Gaming: { color: "#8b5cf6", icon: "🎮" },
  Movies: { color: "#f43f5e", icon: "🎬" },
  "TV Shows": { color: "#06b6d4", icon: "📺" },
  "K-Pop": { color: "#d926a9", icon: "🎤" },
  Comics: { color: "#f59e0b", icon: "💥" },
  Manga: { color: "#10b981", icon: "📖" },
  Cosplay: { color: "#a855f7", icon: "✨" },
};

const ACTIVITY_ICONS = {
  bookmark_added:    { icon: FiBookmark, color: "#ec4899", bg: "rgba(236,72,153,0.15)" },
  bookmark_removed:  { icon: FiBookmark, color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  note_added:        { icon: FiEdit3,    color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
  rating_submitted:  { icon: FiStar,     color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  profile_updated:   { icon: FiUser,     color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  login:             { icon: FiEye,      color: "#d926a9", bg: "rgba(217,38,169,0.15)" },
};

const CountUp = ({ value, duration = 1000 }) => {
  const [display, setDisplay] = useState(0);
  const target = Number(value) || 0;

  useEffect(() => {
    if (target === 0) { setDisplay(0); return; }
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <span>{display.toLocaleString()}</span>;
};

const timeAgo = (dateStr) => {
  if (!dateStr) return "recently";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

// Animated Card Component with bottom-up entrance & 3D tilt
const AnimatedCard = ({ children, delay = 0, className = "", style = {}, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.96 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-15px" }}
    transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -6, scale: 1.015, boxShadow: "0 18px 40px rgba(219, 39, 119, 0.22)" }}
    className={`card ${className}`}
    style={{ ...style }}
    {...props}
  >
    {children}
  </motion.div>
);

const StatChip = ({ title, value, icon: Icon, color, onClick, active, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -5, scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "14px 18px",
      borderRadius: 18,
      border: active ? `2px solid ${color}` : "1px solid var(--border)",
      background: active ? `${color}22` : "var(--surface-glass)",
      backdropFilter: "blur(14px)",
      boxShadow: active ? `0 10px 28px ${color}35` : "var(--shadow)",
      minWidth: 165,
      cursor: "pointer",
      flexShrink: 0,
      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
    }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 14,
        background: `linear-gradient(135deg, ${color}35, ${color}10)`,
        border: `1.5px solid ${color}50`,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: `0 4px 14px ${color}25`,
      }}
    >
      <Icon size={19} />
    </div>
    <div>
      <div style={{ fontSize: 21, fontWeight: 900, lineHeight: 1.1, color: "var(--text)" }}>
        <CountUp value={value} />
      </div>
      <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.6, marginTop: 2 }}>
        {title}
      </div>
    </div>
  </motion.div>
);

const ShelfScroller = ({ children }) => {
  const trackRef = useRef(null);
  const scrollBy = (dir) => {
    if (trackRef.current) trackRef.current.scrollBy({ left: dir * 360, behavior: "smooth" });
  };
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
        className="shelf-nav shelf-nav-left"
        style={shelfNavStyle("left")}
      >
        <FiChevronLeft size={18} />
      </button>
      <div ref={trackRef} className="shelf-track" style={shelfTrackStyle}>
        {children}
      </div>
      <button
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
        className="shelf-nav shelf-nav-right"
        style={shelfNavStyle("right")}
      >
        <FiChevronRight size={18} />
      </button>
      <style>{`
        .shelf-track::-webkit-scrollbar { display: none; }
        .shelf-nav { opacity: 0; transition: opacity 0.2s, transform 0.2s; }
        div:hover > .shelf-nav { opacity: 1; }
        .shelf-nav:hover { transform: translateY(-50%) scale(1.1); }
      `}</style>
    </div>
  );
};

const shelfTrackStyle = {
  display: "flex",
  gap: 18,
  overflowX: "auto",
  scrollSnapType: "x mandatory",
  scrollbarWidth: "none",
  paddingBottom: 10,
  paddingTop: 6,
};

const shelfNavStyle = (side) => ({
  position: "absolute",
  top: "50%",
  [side]: -6,
  transform: "translateY(-50%)",
  zIndex: 4,
  width: 38,
  height: 38,
  borderRadius: "50%",
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
});

const SectionHeading = ({ title, to, icon: Icon, badge, actionText, onAction, spark = false }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 11,
          background: "var(--gradient)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          boxShadow: "0 4px 14px rgba(219,39,119,0.4)",
        }}
      >
        <Icon size={17} />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, letterSpacing: -0.3 }}>{title}</h2>
      {badge && (
        <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800, background: "rgba(236,72,153,0.15)", color: "var(--primary)", border: "1px solid rgba(236,72,153,0.3)" }}>
          {badge}
        </span>
      )}
      {spark && <Sparkles size={16} color="#ec4899" className="funky-neon" />}
    </div>
    {to ? (
      <Link to={to} style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)", display: "inline-flex", alignItems: "center", gap: 5 }}>
        {actionText || "View all"} <FiArrowRight size={14} />
      </Link>
    ) : onAction ? (
      <button onClick={onAction} style={{ background: "none", border: "none", fontSize: 13, fontWeight: 700, color: "var(--primary)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}>
        {actionText || "View all"} <FiArrowRight size={14} />
      </button>
    ) : null}
  </div>
);

const PosterCard = ({ to, image, title, subtitle, gradient, icon: Icon, delay = 0 }) => (
  <Link to={to} style={{ textDecoration: "none", color: "inherit", scrollSnapAlign: "start", flexShrink: 0 }}>
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-15px" }}
      whileHover={{ scale: 1.05, y: -6, boxShadow: "0 18px 40px rgba(219,39,119,0.3)" }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: 210,
        borderRadius: 18,
        overflow: "hidden",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        boxShadow: "0 10px 28px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          height: 120,
          position: "relative",
          background: image ? `url(${image}) center/cover` : gradient || "var(--gradient)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(12,7,20,0.88) 100%)" }} />
        <div style={{ position: "absolute", bottom: 10, left: 12, right: 12, color: "#fff", fontWeight: 800, fontSize: 14, lineHeight: 1.25 }}>
          {title}
        </div>
      </div>
      <div style={{ padding: "10px 12px", fontSize: 12, fontWeight: 700, color: "var(--primary)", textTransform: "capitalize", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{subtitle}</span>
        {Icon && <Icon size={13} />}
      </div>
    </motion.div>
  </Link>
);

const CONTENT_TYPES = [
  { id: "all", label: "All Fandom Types", icon: FiLayers },
  { id: "merchandise", label: "Merchandise Vault", icon: FiShoppingBag },
  { id: "content", label: "Lore & Universe", icon: FiCompass },
  { id: "article", label: "Articles", icon: FiFeather },
  { id: "multimedia", label: "Multimedia", icon: FiFilm },
  { id: "character", label: "Characters", icon: FiUser },
  { id: "event", label: "Events & Meetups", icon: FiCalendar },
  { id: "release", label: "Release Drops", icon: FiClock },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview"); 
  const [mascotMessage, setMascotMessage] = useState("Hi there! Ready for today's fandom adventure?");
  const [mascotMood, setMascotMood] = useState("happy");

  const typewriterPhrases = useMemo(() => [
    `Welcome back, ${user?.name || "Fan Explorer"}!`,
    "Discover epic lore & character bios!",
    "Check out verified authentic merch drops!",
    "Track live anime, gaming & movie releases!",
  ], [user?.name]);

  const { data: activities, loading: activityLoading } = useApi("/activities", { limit: 20 });
  const { data: bookmarks, loading: bookmarksLoading } = useApi("/bookmarks");
  const { data: notes, loading: notesLoading } = useApi("/notes");
  const { data: recommended, loading: recommendedLoading } = useApi("/content/recommended", { limit: 12 });
  const { data: trending, loading: trendingLoading } = useApi("/content/trending", { limit: 12 });
  const { data: categoriesData } = useApi("/categories");
  const { data: trendingFanContent, loading: trendingFanLoading } = useApi("/fan-content", { sort: "trending" });
  
  // Dedicated user merchandise showcase
  const { data: userMerchData, loading: merchLoading } = useApi("/merchandise", { limit: 16 });

  const [selectedCategory, setSelectedCategory] = useState("my-fandoms"); 
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [feedItems, setFeedItems] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [fandomMood, setFandomMood] = useState("⚡ Energetic Explorer");

  const [activityFilter, setActivityFilter] = useState("all");

  const favoriteCategories = useMemo(() => {
    return (user?.favoriteCategories || []).map((c) => {
      if (typeof c === "object" && c !== null) return c;
      return { _id: c, name: c };
    });
  }, [user?.favoriteCategories]);

  const favoriteCategoryNames = useMemo(() => {
    return favoriteCategories.map((c) => c.name).filter(Boolean);
  }, [favoriteCategories]);

  const isContributor = user?.role === "user" || user?.role === "admin";
  const recentBookmarks = (bookmarks || []).slice(0, 10);
  const recentNotes = (notes || []).slice(0, 4);
  const recommendedItems = recommended?.items || [];
  const trendingItems = trending?.items || [];
  const topFanContent = (trendingFanContent || []).slice(0, 8);
  const heroBackdrop = recentBookmarks.find((b) => b.item?.image)?.item?.image;

  // Extract merchandise list safely from userMerchData
  const merchItems = useMemo(() => {
    if (!userMerchData) return [];
    return Array.isArray(userMerchData) ? userMerchData : (userMerchData?.items || userMerchData?.data || []);
  }, [userMerchData]);

  // Feed Data Aggregator with resilient parsing for all content types
  useEffect(() => {
    if (activeTab !== "feed" && activeTab !== "overview" && activeTab !== "merch") return;

    let isMounted = true;
    setFeedLoading(true);

    const fetchFeedData = async () => {
      try {
        const promises = [];
        const isMyFandoms = selectedCategory === "my-fandoms";
        let catParam = (!isMyFandoms && selectedCategory !== "all") ? selectedCategory : undefined;

        if (selectedType === "all" || selectedType === "content") {
          promises.push(
            api.get("/content", { params: { category: catParam, limit: 16 } })
              .then((r) => {
                const list = Array.isArray(r.data) ? r.data : (r.data?.items || r.data?.data || []);
                return list.map((item) => ({ ...item, _feedType: "content" }));
              })
              .catch(() => [])
          );
        }
        if (selectedType === "all" || selectedType === "article") {
          promises.push(
            api.get("/articles", { params: { category: catParam, limit: 12 } })
              .then((r) => {
                const list = Array.isArray(r.data) ? r.data : (r.data?.items || r.data?.data || []);
                return list.map((item) => ({ ...item, _feedType: "article" }));
              })
              .catch(() => [])
          );
        }
        if (selectedType === "all" || selectedType === "multimedia") {
          promises.push(
            api.get("/media", { params: { category: catParam, limit: 12 } })
              .then((r) => {
                const list = Array.isArray(r.data) ? r.data : (r.data?.items || r.data?.data || []);
                return list.map((item) => ({ ...item, _feedType: "multimedia" }));
              })
              .catch(() => [])
          );
        }
        if (selectedType === "all" || selectedType === "character") {
          promises.push(
            api.get("/characters", { params: { category: catParam, limit: 12 } })
              .then((r) => {
                const list = Array.isArray(r.data) ? r.data : (r.data?.items || r.data?.data || []);
                return list.map((item) => ({ ...item, _feedType: "character" }));
              })
              .catch(() => [])
          );
        }
        if (selectedType === "all" || selectedType === "merchandise") {
          promises.push(
            api.get("/merchandise", { params: { category: catParam, limit: 16 } })
              .then((r) => {
                const list = Array.isArray(r.data) ? r.data : (r.data?.items || r.data?.data || []);
                return list.map((item) => ({ ...item, _feedType: "merchandise" }));
              })
              .catch(() => [])
          );
        }
        if (selectedType === "all" || selectedType === "event") {
          promises.push(
            api.get("/events", { params: { category: catParam, limit: 12 } })
              .then((r) => {
                const list = Array.isArray(r.data) ? r.data : (r.data?.items || r.data?.data || []);
                return list.map((item) => ({ ...item, _feedType: "event" }));
              })
              .catch(() => [])
          );
        }
        if (selectedType === "all" || selectedType === "release") {
          promises.push(
            api.get("/releases", { params: { category: catParam, limit: 12 } })
              .then((r) => {
                const list = Array.isArray(r.data) ? r.data : (r.data?.items || r.data?.data || []);
                return list.map((item) => ({ ...item, _feedType: "release" }));
              })
              .catch(() => [])
          );
        }

        const results = await Promise.all(promises);
        let aggregated = results.flat();

        if (isMyFandoms && favoriteCategoryNames.length > 0) {
          aggregated = aggregated.filter((item) => {
            const itemCat = typeof item.category === "object" ? item.category?.name : item.category;
            return favoriteCategoryNames.includes(itemCat);
          });
        }

        if (isMounted) {
          setFeedItems(aggregated);
          setFeedLoading(false);
        }
      } catch (e) {
        if (isMounted) setFeedLoading(false);
      }
    };

    fetchFeedData();
    return () => { isMounted = false; };
  }, [selectedCategory, selectedType, favoriteCategoryNames, activeTab]);

  const processedFeed = useMemo(() => {
    let list = [...feedItems];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) => {
        const title = (item.title || item.name || "").toLowerCase();
        const desc = (item.description || item.bio || item.message || "").toLowerCase();
        const cat = (typeof item.category === "object" ? item.category?.name : item.category || "").toLowerCase();
        return title.includes(q) || desc.includes(q) || cat.includes(q);
      });
    }

    if (sortBy === "latest") {
      list.sort((a, b) => new Date(b.createdAt || b.publishedAt || b.date || 0) - new Date(a.createdAt || a.publishedAt || a.date || 0));
    } else if (sortBy === "popular") {
      list.sort((a, b) => (b.views || b.popularity || b.popularityScore || 0) - (a.views || a.popularity || a.popularityScore || 0));
    } else if (sortBy === "alpha") {
      list.sort((a, b) => (a.title || a.name || "").localeCompare(b.title || b.name || ""));
    }

    return list;
  }, [feedItems, searchQuery, sortBy]);

  const filteredActivities = useMemo(() => {
    if (!activities) return [];
    if (activityFilter === "all") return activities;
    return activities.filter((a) => a.type === activityFilter);
  }, [activities, activityFilter]);

  const quickNavLinks = [
    { label: "Explore Hub", to: "/explore", icon: FiCompass, color: "#ec4899" },
    { label: "Multimedia", to: "/multimedia", icon: FiFilm, color: "#8b5cf6" },
    { label: "Character Lore", to: "/characters", icon: FiUser, color: "#f43f5e" },
    { label: "Events & Meetups", to: "/events", icon: FiCalendar, color: "#10b981" },
    { label: "Merchandise Vault", to: "/merchandise", icon: FiShoppingBag, color: "#f59e0b" },
    { label: "Releases Calendar", to: "/releases", icon: FiClock, color: "#06b6d4" },
  ];

  const mascotQuotes = [
    "🔥 Tip: Check out the new limited edition figures in the Merchandise Vault!",
    "✨ Did you know? You can write personal notes and bookmark any character!",
    "🚀 High energy today! Dive into your personalized fandom feed.",
    "🌟 Level up by contributing your own fan lore and articles!",
  ];

  const handleMascotPoke = () => {
    const randomQuote = mascotQuotes[Math.floor(Math.random() * mascotQuotes.length)];
    setMascotMessage(randomQuote);
    setMascotMood("excited");
    setTimeout(() => setMascotMood("happy"), 2000);
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Hero Header with Typewriter Animation & Animated Waving Mascot */}
      <div
        style={{
          position: "relative",
          minHeight: 340,
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: heroBackdrop
              ? `url(${heroBackdrop}) center/cover`
              : "var(--gradient-hero)",
            filter: heroBackdrop ? "brightness(0.42) saturate(1.25)" : "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(12,7,20,0.2) 0%, var(--bg) 95%)",
          }}
        />

        <div className="container" style={{ position: "relative", width: "100%", paddingTop: 36, paddingBottom: 24 }}>
          <Breadcrumb items={[{ label: "User Dashboard" }]} />
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            {/* Left Side: Typewriter Greeting & Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 2,
                  color: "var(--primary)",
                  textTransform: "uppercase",
                  padding: "4px 12px",
                  borderRadius: 999,
                  background: "rgba(236,72,153,0.15)",
                  border: "1px solid rgba(236,72,153,0.35)",
                  backdropFilter: "blur(8px)",
                }}>
                  ✨ Fandom Universe Portal
                </span>

                {user?.role === "admin" && (
                  <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 10.5, fontWeight: 800, background: "var(--gradient)", color: "#fff", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 5, boxShadow: "0 2px 10px rgba(219,39,119,0.4)" }}>
                    <FiShield size={11} /> Admin Active
                  </span>
                )}
                {user?.role === "user" && (
                  <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 10.5, fontWeight: 800, background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <FiFeather size={11} /> Contributor
                  </span>
                )}
              </div>

              {/* Typewriter Text Animated Header */}
              <h1 style={{ fontSize: "clamp(26px, 4.2vw, 42px)", fontWeight: 900, margin: "6px 0 10px", letterSpacing: -1, lineHeight: 1.15 }}>
                <TypewriterText
                  phrases={typewriterPhrases}
                  typingSpeed={60}
                  deletingSpeed={30}
                  pauseTime={2400}
                />
              </h1>

              <p style={{ color: "var(--text-muted)", margin: "0 0 18px", fontSize: 14.5, maxWidth: 580, lineHeight: 1.5 }}>
                Your interactive fandom command center. Track your favorite universes, discover rare merchandise, and explore trending lore.
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveTab("feed")}
                  className="btn"
                  style={{ padding: "12px 22px", fontSize: 13.5 }}
                >
                  <FiCompass size={15} /> Explore Fandom Feed
                </motion.button>
                <Link
                  to="/profile"
                  style={{
                    padding: "12px 20px",
                    borderRadius: 999,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    color: "var(--text)",
                    fontSize: 13.5,
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    textDecoration: "none",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  <FiHeart size={14} color="#ec4899" /> Favorite Fandoms ({favoriteCategories.length})
                </Link>
              </div>
            </motion.div>

            {/* Right Side: Cute Animated Cartoon Mascot Companion Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={handleMascotPoke}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                padding: "16px 20px",
                borderRadius: 24,
                background: "linear-gradient(145deg, rgba(236,72,153,0.18), rgba(147,51,234,0.1))",
                border: "1px solid rgba(236,72,153,0.35)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 14px 36px rgba(219,39,119,0.3)",
                maxWidth: 260,
                position: "relative",
              }}
              whileHover={{ scale: 1.04, y: -4 }}
            >
              {/* Animated Mascot Character */}
              <div style={{ width: 110, height: 110, filter: "drop-shadow(0 6px 16px rgba(219,39,119,0.4))" }}>
                <LottieAnimation animationData={mascotLottie} loop={true} />
              </div>

              {/* Dialogue Bubble */}
              <div style={{
                marginTop: 6,
                padding: "8px 12px",
                borderRadius: 12,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                fontSize: 11.5,
                fontWeight: 700,
                color: "var(--text)",
                textAlign: "center",
                lineHeight: 1.35,
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}>
                <span style={{ color: "var(--primary)", fontWeight: 800 }}>Fandom Bot: </span>
                {mascotMessage}
              </div>

              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8 }}>
                ✨ Click mascot to interact!
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="container" style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            padding: "8px 12px",
            borderRadius: 20,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(14px)",
            boxShadow: "var(--shadow)",
          }}
        >
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { id: "overview", label: "Overview", icon: FiGrid },
              { id: "merch", label: "Merchandise Vault", icon: FiShoppingBag, badge: merchItems.length ? `${merchItems.length} Drops` : null },
              { id: "feed", label: "Fandom Feed", icon: FiCompass, badge: favoriteCategories.length ? `${favoriteCategories.length} Active` : null },
              { id: "bookmarks", label: "Bookmarks & Notes", icon: FiBookmark, badge: bookmarks?.length || null },
              { id: "activity", label: "Live Activity", icon: FiActivity, badge: activities?.length || null },
            ].map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 18px",
                    borderRadius: 14,
                    border: active ? "1px solid var(--primary)" : "1px solid transparent",
                    background: active ? "var(--gradient)" : "transparent",
                    color: active ? "#fff" : "var(--text-muted)",
                    fontWeight: active ? 800 : 700,
                    fontSize: 13.5,
                    cursor: "pointer",
                    boxShadow: active ? "0 4px 14px rgba(219,39,119,0.35)" : "none",
                    transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  }}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 999,
                        fontSize: 10.5,
                        fontWeight: 800,
                        background: active ? "rgba(255,255,255,0.25)" : "var(--bg-soft)",
                        color: active ? "#fff" : "var(--primary)",
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          <Link
            to="/merchandise"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12.5,
              fontWeight: 800,
              color: "var(--primary)",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: 12,
              background: "rgba(219,39,119,0.1)",
              border: "1px solid rgba(219,39,119,0.25)",
            }}
          >
            <FiShoppingBag size={14} /> Full Merchandise Vault →
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container">
        {/* Animated Stat Chips */}
        <div style={{ display: "flex", gap: 14, overflowX: "auto", marginBottom: 28, scrollbarWidth: "none" }}>
          <StatChip
            title="My Fandoms"
            value={favoriteCategories.length}
            icon={FiHeart}
            color="#ec4899"
            onClick={() => setActiveTab("feed")}
            active={activeTab === "feed"}
            delay={0.05}
          />
          <StatChip
            title="Merchandise"
            value={merchItems.length}
            icon={FiShoppingBag}
            color="#f59e0b"
            onClick={() => setActiveTab("merch")}
            active={activeTab === "merch"}
            delay={0.1}
          />
          <StatChip
            title="Bookmarks"
            value={bookmarks?.length || 0}
            icon={FiBookmark}
            color="#8b5cf6"
            onClick={() => setActiveTab("bookmarks")}
            active={activeTab === "bookmarks"}
            delay={0.15}
          />
          <StatChip
            title="Personal Notes"
            value={notes?.length || 0}
            icon={FiEdit3}
            color="#06b6d4"
            onClick={() => setActiveTab("bookmarks")}
            active={activeTab === "bookmarks"}
            delay={0.2}
          />
          <StatChip
            title="Live Activity"
            value={activities?.length || 0}
            icon={FiTrendingUp}
            color="#10b981"
            onClick={() => setActiveTab("activity")}
            active={activeTab === "activity"}
            delay={0.25}
          />
        </div>

        {/* Section 1: Interactive Animated Image Slider & Moving Marquee Reel */}
        <DashboardImageSlider />

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {/* Interactive Fandom Explorer Section */}
            <div style={{ marginBottom: 40 }}>
              <SectionHeading
                title="Your Selected Fandom Universes"
                to="/profile"
                icon={FiHeart}
                badge={favoriteCategories.length > 0 ? `${favoriteCategories.length} Selected` : "None set"}
                actionText="Manage in Profile"
                spark
              />
              {favoriteCategories.length === 0 ? (
                <AnimatedCard style={{ padding: 36, textAlign: "center" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 8px" }}>No Favorite Universes Selected</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "0 0 18px", maxWidth: 480, marginInline: "auto" }}>
                    Select your favorite universes (Anime, Gaming, Movies, Cosplay, etc.) to customize your personalized dashboard feed and unlock tailored drops!
                  </p>
                  <Link to="/profile" className="btn" style={{ fontSize: 13.5, padding: "10px 24px" }}>
                    <FiHeart size={15} /> Pick Favorite Fandoms
                  </Link>
                </AnimatedCard>
              ) : (
                <ShelfScroller>
                  {favoriteCategories.map((c) => {
                    const name = c.name || c;
                    const meta = CATEGORY_META[name] || { color: "#ec4899", icon: "✨" };
                    return (
                      <PosterCard
                        key={c._id || name}
                        to={`/category/${encodeURIComponent(name)}`}
                        title={`${meta.icon} ${name}`}
                        subtitle="Explore Hub →"
                        gradient={`linear-gradient(135deg, ${meta.color}60, ${meta.color}15)`}
                      />
                    );
                  })}
                </ShelfScroller>
              )}
            </div>

            {/* Merchandise Showcase Carousel inside Overview */}
            <div style={{ marginBottom: 40 }}>
              <SectionHeading
                title="Featured Merchandise & Collector Items"
                to="/merchandise"
                icon={FiShoppingBag}
                badge={`${merchItems.length} Products`}
                actionText="View Vault"
                spark
              />
              {merchLoading ? (
                <LoadingGrid count={4} height={200} />
              ) : merchItems.length === 0 ? (
                <AnimatedCard style={{ padding: 28, textAlign: "center", color: "var(--text-muted)" }}>
                  <p style={{ margin: 0, fontSize: 14 }}>No merchandise loaded yet.</p>
                </AnimatedCard>
              ) : (
                <ShelfScroller>
                  {merchItems.map((item) => (
                    <div key={item._id} style={{ width: 240, flexShrink: 0, scrollSnapAlign: "start" }}>
                      <MerchCard item={item} />
                    </div>
                  ))}
                </ShelfScroller>
              )}
            </div>

            {/* Recommendations */}
            <div style={{ marginBottom: 40 }}>
              <SectionHeading
                title="Personalized Recommendations"
                icon={FiCompass}
                badge={favoriteCategories.length > 0 ? "Tailored to your fandoms" : "General"}
                actionText="Explore Feed"
                onAction={() => setActiveTab("feed")}
              />
              {recommendedLoading ? (
                <LoadingGrid count={4} height={150} />
              ) : recommendedItems.length === 0 ? (
                <AnimatedCard style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
                  <p style={{ margin: "0 0 10px", fontSize: 13.5 }}>Browse all universes to generate tailored recommendations.</p>
                  <button onClick={() => setActiveTab("feed")} className="btn" style={{ fontSize: 12.5, padding: "7px 16px" }}>
                    Browse All Fandoms
                  </button>
                </AnimatedCard>
              ) : (
                <ShelfScroller>
                  {recommendedItems.map((item) => (
                    <div key={item._id} style={{ width: 230, flexShrink: 0, scrollSnapAlign: "start" }}>
                      <ContentCard item={item} />
                    </div>
                  ))}
                </ShelfScroller>
              )}
            </div>

            {/* Trending */}
            <div style={{ marginBottom: 40 }}>
              <SectionHeading title="Trending Across Fandom Hub" to="/explore" icon={FiTrendingUp} badge="Most Popular" />
              {trendingLoading ? (
                <LoadingGrid count={4} height={150} />
              ) : trendingItems.length === 0 ? (
                <AnimatedCard style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
                  <p style={{ margin: 0, fontSize: 13.5 }}>Nothing trending yet — be the first to explore new content.</p>
                </AnimatedCard>
              ) : (
                <ShelfScroller>
                  {trendingItems.map((item) => (
                    <div key={item._id} style={{ width: 230, flexShrink: 0, scrollSnapAlign: "start" }}>
                      <ContentCard item={item} />
                    </div>
                  ))}
                </ShelfScroller>
              )}
            </div>

            {/* Quick Universe Hub Links */}
            <div style={{ marginBottom: 40 }}>
              <SectionHeading title="Quick Universe Portals" icon={FiLayers} />
              <ShelfScroller>
                {quickNavLinks.map((ql) => (
                  <PosterCard
                    key={ql.to}
                    to={ql.to}
                    title={ql.label}
                    subtitle="Explore Section →"
                    gradient={`linear-gradient(135deg, ${ql.color}60, ${ql.color}15)`}
                    icon={ql.icon}
                  />
                ))}
              </ShelfScroller>
            </div>

            {/* Community & Activity Grid with Animated Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
              <AnimatedCard style={{ padding: 24 }}>
                <SectionHeading title="Top Fan Creations" to="/community" icon={FiFeather} badge="Community" />
                {trendingFanLoading ? (
                  <LoadingGrid count={2} height={60} />
                ) : topFanContent.length === 0 ? (
                  <div style={{ padding: 16, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                    No community submissions yet.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {topFanContent.slice(0, 4).map((s) => (
                      <Link key={s._id} to={`/community/${s.user?._id || ""}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <motion.div
                          whileHover={{ x: 4, borderColor: "var(--primary)" }}
                          style={{ padding: "12px 14px", borderRadius: 12, background: "var(--bg-soft)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                        >
                          <div>
                            <div style={{ fontSize: 10.5, fontWeight: 800, color: "var(--primary)", textTransform: "uppercase" }}>{s.category}</div>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>{s.title}</div>
                          </div>
                          <div style={{ fontSize: 11.5, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                            <FiEye size={12} /> {s.views || 0}
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                )}
              </AnimatedCard>

              <AnimatedCard style={{ padding: 24 }}>
                <SectionHeading
                  title="Recent Live Activity"
                  icon={FiClock}
                  badge="Live"
                  actionText="Full Log"
                  onAction={() => setActiveTab("activity")}
                />
                {activityLoading ? (
                  <LoadingGrid count={3} height={45} />
                ) : !activities || activities.length === 0 ? (
                  <div style={{ padding: 16, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                    No recent activity logged.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {activities.slice(0, 4).map((a) => {
                      const meta = ACTIVITY_ICONS[a.type] || { icon: FiClock, color: "#ec4899", bg: "rgba(236,72,153,0.12)" };
                      const Icon = meta.icon;
                      return (
                        <motion.div
                          key={a._id}
                          whileHover={{ x: 4 }}
                          style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 12px", borderRadius: 12, background: "var(--bg-soft)", border: "1px solid var(--border)" }}
                        >
                          <div style={{ width: 32, height: 32, borderRadius: 9, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", color: meta.color, flexShrink: 0 }}>
                            <Icon size={14} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.message}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{timeAgo(a.createdAt)}</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </AnimatedCard>
            </div>
          </motion.div>
        )}

        {/* TAB 2: MERCHANDISE VAULT */}
        {activeTab === "merch" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <AnimatedCard style={{ padding: 26, marginBottom: 24, borderRadius: 22, background: "var(--gradient-card)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, marginBottom: 18 }}>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 4px", display: "flex", alignItems: "center", gap: 8 }}>
                    <FiShoppingBag color="var(--primary)" /> Fandom Merchandise Vault
                  </h2>
                  <p style={{ color: "var(--text-muted)", margin: 0, fontSize: 14 }}>
                    Explore verified authentic collectibles, figures, apparel, and limited-edition replica drops.
                  </p>
                </div>

                <Link to="/merchandise" className="btn" style={{ padding: "10px 20px", fontSize: 13.5 }}>
                  Browse All Categories <FiArrowRight size={14} />
                </Link>
              </div>

              {/* Quick Category Filter Chips */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["All", "Anime", "Gaming", "Movies", "TV Shows", "Comics", "Cosplay"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c === "All" ? "all" : c)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: 999,
                      border: (selectedCategory === c || (c === "All" && selectedCategory === "all")) ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                      background: (selectedCategory === c || (c === "All" && selectedCategory === "all")) ? "var(--gradient)" : "var(--surface)",
                      color: (selectedCategory === c || (c === "All" && selectedCategory === "all")) ? "#fff" : "var(--text)",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: (selectedCategory === c || (c === "All" && selectedCategory === "all")) ? "0 4px 14px rgba(219,39,119,0.35)" : "none",
                      transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </AnimatedCard>

            {merchLoading ? (
              <LoadingGrid count={8} height={280} />
            ) : merchItems.length === 0 ? (
              <AnimatedCard style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>
                <FiShoppingBag size={44} style={{ opacity: 0.35, marginBottom: 12, color: "var(--primary)" }} />
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 8px", color: "var(--text)" }}>No merchandise items found</h3>
                <p style={{ fontSize: 13.5, margin: "0 0 16px" }}>Check back soon for new drops or adjust filters.</p>
              </AnimatedCard>
            ) : (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 20 }}
              >
                {merchItems.map((item) => (
                  <motion.div
                    key={item._id}
                    variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
                  >
                    <MerchCard item={item} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* TAB 3: FEED */}
        {activeTab === "feed" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <AnimatedCard style={{ padding: 22, marginBottom: 24, borderRadius: 20 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
                <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
                  <FiSearch style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search within your fandom feed…"
                    style={{
                      width: "100%",
                      padding: "10px 14px 10px 38px",
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "var(--bg-soft)",
                      color: "var(--text)",
                      fontSize: 13.5,
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-muted)" }}>Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid var(--border)",
                      background: "var(--bg-soft)",
                      color: "var(--text)",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    <option value="latest">Latest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="alpha">Alphabetical (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Fandom Scope Selector */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8, color: "var(--text-muted)", marginBottom: 8 }}>
                  Category Scope:
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={() => setSelectedCategory("my-fandoms")}
                    style={{
                      padding: "7px 15px",
                      borderRadius: 999,
                      border: selectedCategory === "my-fandoms" ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                      background: selectedCategory === "my-fandoms" ? "var(--gradient)" : "var(--surface)",
                      color: selectedCategory === "my-fandoms" ? "#fff" : "var(--text)",
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <FiHeart size={13} /> My Selected Fandoms ({favoriteCategories.length})
                  </button>

                  <button
                    onClick={() => setSelectedCategory("all")}
                    style={{
                      padding: "7px 15px",
                      borderRadius: 999,
                      border: selectedCategory === "all" ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                      background: selectedCategory === "all" ? "var(--gradient)" : "var(--surface)",
                      color: selectedCategory === "all" ? "#fff" : "var(--text)",
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    All Universes
                  </button>

                  {(categoriesData || Object.keys(CATEGORY_META).map((name) => ({ name }))).map((c) => {
                    const catName = c.name;
                    const isSelected = selectedCategory === catName;
                    const isFavorite = favoriteCategoryNames.includes(catName);
                    const meta = CATEGORY_META[catName];
                    return (
                      <button
                        key={catName}
                        onClick={() => setSelectedCategory(catName)}
                        style={{
                          padding: "7px 14px",
                          borderRadius: 999,
                          border: isSelected ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                          background: isSelected ? "var(--gradient)" : "var(--surface)",
                          color: isSelected ? "#fff" : "var(--text)",
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <span>{meta?.icon || "•"}</span>
                        <span>{catName}</span>
                        {isFavorite && <span style={{ color: isSelected ? "#fff" : "#ec4899", fontSize: 10.5 }}>[Fav]</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Type Filter */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8, color: "var(--text-muted)", marginBottom: 8 }}>
                  Content Type:
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {CONTENT_TYPES.map((type) => {
                    const isSelected = selectedType === type.id;
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        style={{
                          padding: "7px 13px",
                          borderRadius: 999,
                          border: isSelected ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                          background: isSelected ? "rgba(219,39,119,0.18)" : "var(--surface)",
                          color: isSelected ? "var(--primary)" : "var(--text-muted)",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          transition: "all 0.15s",
                        }}
                      >
                        <Icon size={13} /> {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </AnimatedCard>

            <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 800 }}>
                Showing <span style={{ color: "var(--primary)" }}>{processedFeed.length}</span> items
                {selectedCategory === "my-fandoms" ? " in Your Favorite Fandoms" : selectedCategory !== "all" ? ` in ${selectedCategory}` : ""}
              </div>
            </div>

            {feedLoading ? (
              <LoadingGrid count={8} height={220} />
            ) : processedFeed.length === 0 ? (
              <AnimatedCard style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>
                <FiCompass size={40} style={{ opacity: 0.35, marginBottom: 12, color: "var(--primary)" }} />
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 8px", color: "var(--text)" }}>No matching content found</h3>
                <p style={{ maxWidth: 460, margin: "0 auto 16px", fontSize: 13.5 }}>
                  {selectedCategory === "my-fandoms" && favoriteCategories.length === 0
                    ? "You haven't selected any favorite categories in your profile yet."
                    : "Try adjusting your category filter, content type, or search term."}
                </p>
                {selectedCategory === "my-fandoms" && favoriteCategories.length === 0 ? (
                  <Link to="/profile" className="btn" style={{ fontSize: 13, padding: "9px 20px" }}>
                    <FiHeart size={14} style={{ marginRight: 6 }} /> Choose Favorite Categories
                  </Link>
                ) : (
                  <button onClick={() => { setSelectedCategory("all"); setSelectedType("all"); setSearchQuery(""); }} className="btn" style={{ fontSize: 13, padding: "9px 20px" }}>
                    Reset Filters
                  </button>
                )}
              </AnimatedCard>
            ) : (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 20 }}
              >
                {processedFeed.map((item) => {
                  return (
                    <motion.div
                      key={`${item._feedType}_${item._id}`}
                      variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
                    >
                      {item._feedType === "article" && <ArticleCard article={item} />}
                      {item._feedType === "character" && <CharacterCard character={item} />}
                      {item._feedType === "multimedia" && <MediaCard media={item} />}
                      {item._feedType === "merchandise" && <MerchCard item={item} />}
                      {item._feedType === "release" && <ReleaseCard release={item} />}
                      {item._feedType === "content" && <ContentCard item={item} />}
                      {item._feedType === "event" && <ContentCard item={item} />}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* TAB 4: BOOKMARKS & NOTES */}
        {activeTab === "bookmarks" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
              <div>
                <SectionHeading title="Saved Bookmarks" to="/bookmarks" icon={FiBookmark} badge={bookmarks?.length ? `${bookmarks.length} saved` : "0"} />
                {bookmarksLoading ? (
                  <LoadingGrid count={4} height={120} />
                ) : recentBookmarks.length === 0 ? (
                  <AnimatedCard style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>
                    <FiBookmark size={34} style={{ opacity: 0.3, marginBottom: 8, color: "var(--primary)" }} />
                    <p style={{ margin: 0, fontSize: 13.5 }}>No bookmarks saved yet.</p>
                    <button onClick={() => setActiveTab("feed")} className="btn" style={{ fontSize: 12.5, padding: "7px 16px", marginTop: 12 }}>
                      Explore Fandom Feed
                    </button>
                  </AnimatedCard>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                    {recentBookmarks.map((b) => (
                      <PosterCard
                        key={b.bookmarkId}
                        to={b.item.link}
                        image={b.item.image}
                        title={b.item.title}
                        subtitle={b.item.subtitle || "Fandom item"}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <SectionHeading title="Personal Notes" to="/notes" icon={FiEdit3} badge={notes?.length ? `${notes.length} notes` : "0"} />
                {notesLoading ? (
                  <LoadingGrid count={3} height={70} />
                ) : recentNotes.length === 0 ? (
                  <AnimatedCard style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>
                    <FiEdit3 size={34} style={{ opacity: 0.3, marginBottom: 8, color: "var(--primary)" }} />
                    <p style={{ margin: "0 0 10px", fontSize: 13.5 }}>No notes created yet.</p>
                    <Link to="/notes" className="btn" style={{ fontSize: 12.5, padding: "8px 16px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <FiPlusCircle size={14} /> Add First Note
                    </Link>
                  </AnimatedCard>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {recentNotes.map((n) => (
                      <Link key={n._id} to="/notes" style={{ textDecoration: "none", color: "inherit" }}>
                        <motion.div whileHover={{ x: 6, borderColor: "var(--primary)" }} className="card" style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                            <div style={{ fontSize: 14, fontWeight: 800 }}>{n.title || "Untitled note"}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{timeAgo(n.updatedAt || n.createdAt)}</div>
                          </div>
                          <div style={{ fontSize: 13, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {n.body}
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                    <Link to="/notes" className="btn" style={{ fontSize: 12.5, padding: "9px 16px", textAlign: "center", marginTop: 6 }}>
                      Manage All Notes →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: ACTIVITY & STATUS */}
        {activeTab === "activity" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}>
              <AnimatedCard style={{ padding: 24, borderRadius: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <FiActivity size={18} color="var(--primary)" /> Live Activity Timeline
                  </h3>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {[
                      { id: "all", label: "All" },
                      { id: "bookmark_added", label: "Bookmarks" },
                      { id: "note_added", label: "Notes" },
                      { id: "rating_submitted", label: "Ratings" },
                      { id: "login", label: "Logins" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setActivityFilter(f.id)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: 999,
                          border: activityFilter === f.id ? "1px solid var(--primary)" : "1px solid var(--border)",
                          background: activityFilter === f.id ? "var(--gradient)" : "var(--surface)",
                          color: activityFilter === f.id ? "#fff" : "var(--text-muted)",
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {activityLoading ? (
                  <LoadingGrid count={6} height={50} />
                ) : filteredActivities.length === 0 ? (
                  <div style={{ padding: 36, textAlign: "center", color: "var(--text-muted)", fontSize: 13.5 }}>
                    No activity found for this filter.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {filteredActivities.map((a, i) => {
                      const meta = ACTIVITY_ICONS[a.type] || { icon: FiClock, color: "#ec4899", bg: "rgba(236,72,153,0.12)" };
                      const Icon = meta.icon;
                      return (
                        <motion.div
                          key={a._id}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          whileHover={{ x: 5 }}
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                            padding: "12px 14px",
                            borderRadius: 14,
                            background: "var(--bg-soft)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: 10,
                              background: meta.bg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              color: meta.color,
                            }}
                          >
                            <Icon size={16} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 700 }}>{a.message}</div>
                            <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>{timeAgo(a.createdAt)}</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </AnimatedCard>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <AnimatedCard style={{ padding: 24, borderRadius: 20 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 900, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                    <FiCheckCircle size={18} color="#10b981" /> Account & Membership
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13.5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                      <span>User Name:</span>
                      <span style={{ fontWeight: 800, color: "var(--text)" }}>{user?.name}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                      <span>Email Address:</span>
                      <span style={{ fontWeight: 600, color: "var(--text)" }}>{user?.email}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                      <span>Account Role:</span>
                      <span style={{ fontWeight: 800, color: user?.role === "admin" ? "#ec4899" : user?.role === "user" ? "#10b981" : "#8b5cf6", textTransform: "uppercase", letterSpacing: 0.5 }}>
                        {user?.role || "Visitor"}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                      <span>Favorite Fandoms:</span>
                      <span style={{ fontWeight: 800, color: "var(--primary)" }}>
                        {favoriteCategories.length} Universes Active
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: 22, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                    <Link to="/profile" className="btn" style={{ fontSize: 13, padding: "9px 18px", width: "100%", textAlign: "center" }}>
                      Edit Profile & Preferences
                    </Link>
                  </div>
                </AnimatedCard>

                {!isContributor && (
                  <AnimatedCard style={{ padding: 24, borderRadius: 20, background: "var(--gradient-card)" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 8 }}>
                      <FiFeather size={17} color="var(--primary)" /> Become a Contributor
                    </h3>
                    <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "0 0 16px", lineHeight: 1.5 }}>
                      Share your fan theories, articles, and cosplay highlights with the Fandom Universe community.
                    </p>
                    <Link to="/profile" className="btn" style={{ fontSize: 12.5, padding: "8px 16px", display: "inline-block" }}>
                      Upgrade Account →
                    </Link>
                  </AnimatedCard>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
