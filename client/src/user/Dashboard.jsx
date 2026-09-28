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
} from "react-icons/fi";
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

const CATEGORY_META = {
  Anime: { color: "#a78bfa" },
  Gaming: { color: "#60a5fa" },
  Movies: { color: "#f472b6" },
  "TV Shows": { color: "#34d399" },
  "K-Pop": { color: "#fbbf24" },
  Comics: { color: "#f87171" },
  Manga: { color: "#4ade80" },
  Cosplay: { color: "#fb923c" },
};

const ACTIVITY_ICONS = {
  bookmark_added:    { icon: FiBookmark, color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
  bookmark_removed:  { icon: FiBookmark, color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  note_added:        { icon: FiEdit3,    color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
  rating_submitted:  { icon: FiStar,     color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  profile_updated:   { icon: FiUser,     color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  login:             { icon: FiEye,      color: "#a855f7", bg: "rgba(168,85,247,0.15)" },
};

const CountUp = ({ value, duration = 1200 }) => {
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

const StatChip = ({ title, value, icon: Icon, color, onClick, active }) => (
  <motion.div
    whileHover={{ y: -3, borderColor: `${color}90` }}
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 16px",
      borderRadius: 14,
      border: active ? `2px solid ${color}` : "1px solid var(--border)",
      background: active ? `${color}18` : "var(--surface-glass)",
      backdropFilter: "blur(10px)",
      minWidth: 155,
      cursor: "pointer",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: `${color}20`,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon size={16} />
    </div>
    <div>
      <div style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.1 }}>
        <CountUp value={value} />
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {title}
      </div>
    </div>
  </motion.div>
);

const ShelfScroller = ({ children }) => {
  const trackRef = useRef(null);
  const scrollBy = (dir) => {
    if (trackRef.current) trackRef.current.scrollBy({ left: dir * 340, behavior: "smooth" });
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
        .shelf-nav { opacity: 0; transition: opacity 0.2s; }
        div:hover > .shelf-nav { opacity: 1; }
      `}</style>
    </div>
  );
};

const shelfTrackStyle = {
  display: "flex",
  gap: 16,
  overflowX: "auto",
  scrollSnapType: "x mandatory",
  scrollbarWidth: "none",
  paddingBottom: 6,
};

const shelfNavStyle = (side) => ({
  position: "absolute",
  top: "50%",
  [side]: -4,
  transform: "translateY(-50%)",
  zIndex: 2,
  width: 34,
  height: 34,
  borderRadius: "50%",
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
});

const SectionHeading = ({ title, to, icon: Icon, badge, actionText, onAction }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: "var(--gradient)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <Icon size={15} />
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{title}</h2>
      {badge && (
        <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: "rgba(139,92,246,0.15)", color: "#8b5cf6" }}>
          {badge}
        </span>
      )}
    </div>
    {to ? (
      <Link to={to} style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 4 }}>
        {actionText || "View all"} <FiArrowRight size={14} />
      </Link>
    ) : onAction ? (
      <button onClick={onAction} style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, color: "var(--accent)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
        {actionText || "View all"} <FiArrowRight size={14} />
      </button>
    ) : null}
  </div>
);

const PosterCard = ({ to, image, title, subtitle, gradient }) => (
  <Link to={to} style={{ textDecoration: "none", color: "inherit", scrollSnapAlign: "start", flexShrink: 0 }}>
    <motion.div
      whileHover={{ scale: 1.045, y: -4 }}
      transition={{ duration: 0.2 }}
      style={{
        width: 200,
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        boxShadow: "0 10px 26px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          height: 112,
          position: "relative",
          background: image ? `url(${image}) center/cover` : gradient || "var(--gradient)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)" }} />
        <div style={{ position: "absolute", bottom: 8, left: 10, right: 10, color: "#fff", fontWeight: 800, fontSize: 13.5, lineHeight: 1.25 }}>
          {title}
        </div>
      </div>
      <div style={{ padding: "9px 12px", fontSize: 11.5, fontWeight: 700, color: "var(--accent)", textTransform: "capitalize" }}>
        {subtitle}
      </div>
    </motion.div>
  </Link>
);

const CONTENT_TYPES = [
  { id: "all", label: "All Types", icon: FiLayers },
  { id: "content", label: "Content & Lore", icon: FiCompass },
  { id: "article", label: "Articles", icon: FiFeather },
  { id: "multimedia", label: "Multimedia", icon: FiFilm },
  { id: "character", label: "Characters", icon: FiUser },
  { id: "merchandise", label: "Merchandise", icon: FiShoppingBag },
  { id: "event", label: "Events", icon: FiCalendar },
  { id: "release", label: "Releases", icon: FiClock },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview"); 

  
  const { data: activities, loading: activityLoading } = useApi("/activities", { limit: 20 });
  const { data: bookmarks, loading: bookmarksLoading } = useApi("/bookmarks");
  const { data: notes, loading: notesLoading } = useApi("/notes");
  const { data: recommended, loading: recommendedLoading } = useApi("/content/recommended", { limit: 12 });
  const { data: trending, loading: trendingLoading } = useApi("/content/trending", { limit: 12 });
  const { data: categoriesData } = useApi("/categories");
  const { data: trendingFanContent, loading: trendingFanLoading } = useApi("/fan-content", { sort: "trending" });

  
  const [selectedCategory, setSelectedCategory] = useState("my-fandoms"); 
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [feedItems, setFeedItems] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);

  
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

  
  useEffect(() => {
    if (activeTab !== "feed" && activeTab !== "overview") return;

    let isMounted = true;
    setFeedLoading(true);

    const fetchFeedData = async () => {
      try {
        const promises = [];
        const isMyFandoms = selectedCategory === "my-fandoms";

        
        let catParam = undefined;
        if (!isMyFandoms && selectedCategory !== "all") {
          catParam = selectedCategory;
        }

        
        if (selectedType === "all" || selectedType === "content") {
          promises.push(
            api.get("/content", { params: { category: catParam, limit: 16 } })
              .then((r) => (r.data?.items || []).map((item) => ({ ...item, _feedType: "content" })))
              .catch(() => [])
          );
        }
        if (selectedType === "all" || selectedType === "article") {
          promises.push(
            api.get("/articles", { params: { category: catParam, limit: 12 } })
              .then((r) => (r.data?.items || []).map((item) => ({ ...item, _feedType: "article" })))
              .catch(() => [])
          );
        }
        if (selectedType === "all" || selectedType === "multimedia") {
          promises.push(
            api.get("/media", { params: { category: catParam, limit: 12 } })
              .then((r) => (r.data?.items || []).map((item) => ({ ...item, _feedType: "multimedia" })))
              .catch(() => [])
          );
        }
        if (selectedType === "all" || selectedType === "character") {
          promises.push(
            api.get("/characters", { params: { category: catParam, limit: 12 } })
              .then((r) => (r.data?.items || []).map((item) => ({ ...item, _feedType: "character" })))
              .catch(() => [])
          );
        }
        if (selectedType === "all" || selectedType === "merchandise") {
          promises.push(
            api.get("/merchandise", { params: { category: catParam, limit: 12 } })
              .then((r) => (r.data?.items || []).map((item) => ({ ...item, _feedType: "merchandise" })))
              .catch(() => [])
          );
        }
        if (selectedType === "all" || selectedType === "event") {
          promises.push(
            api.get("/events", { params: { category: catParam, limit: 12 } })
              .then((r) => (Array.isArray(r.data) ? r.data : r.data?.items || []).map((item) => ({ ...item, _feedType: "event" })))
              .catch(() => [])
          );
        }
        if (selectedType === "all" || selectedType === "release") {
          promises.push(
            api.get("/releases", { params: { category: catParam, limit: 12 } })
              .then((r) => (r.data?.items || []).map((item) => ({ ...item, _feedType: "release" })))
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
    { label: "Explore Hub", to: "/explore", icon: FiCompass, color: "#8b5cf6" },
    { label: "Multimedia", to: "/multimedia", icon: FiFilm, color: "#ec4899" },
    { label: "Character Lore", to: "/characters", icon: FiUser, color: "#3b82f6" },
    { label: "Events & Meetups", to: "/events", icon: FiCalendar, color: "#10b981" },
    { label: "Merch Showcase", to: "/merchandise", icon: FiShoppingBag, color: "#f59e0b" },
    { label: "Releases Calendar", to: "/releases", icon: FiClock, color: "#06b6d4" },
  ];

  return (
    <div style={{ paddingBottom: 80 }}>
      <div
        style={{
          position: "relative",
          minHeight: 300,
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: heroBackdrop
              ? `url(${heroBackdrop}) center/cover`
              : "radial-gradient(ellipse at top left, rgba(147,51,234,0.35), transparent 60%), radial-gradient(ellipse at bottom right, rgba(236,72,153,0.25), transparent 55%), var(--bg)",
            filter: heroBackdrop ? "brightness(0.5) saturate(1.15)" : "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(13,10,23,0.2) 0%, var(--bg) 95%)",
          }}
        />
        <div className="container" style={{ position: "relative", width: "100%", paddingTop: 40, paddingBottom: 20 }}>
          <Breadcrumb items={[{ label: "User Dashboard" }]} />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 18,
                  background: user?.avatar ? `url(${user.avatar}) center/cover` : "var(--gradient)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#fff",
                  border: "2px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.4)",
                  flexShrink: 0,
                }}
              >
                {!user?.avatar && (user?.name?.[0]?.toUpperCase() || "F")}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "var(--accent)", textTransform: "uppercase" }}>
                    Fandom Universe Portal
                  </span>
                  {user?.role === "admin" && (
                    <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 800, background: "linear-gradient(135deg,#c084fc,#8b5cf6)", color: "#fff", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <FiShield size={10} /> Admin
                    </span>
                  )}
                  {user?.role === "user" && (
                    <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 800, background: "linear-gradient(135deg,#34d399,#10b981)", color: "#fff", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <FiFeather size={10} /> Contributor
                    </span>
                  )}
                </div>
                <h1 style={{ fontSize: "clamp(26px, 4vw, 34px)", fontWeight: 900, margin: "4px 0 4px", textShadow: heroBackdrop ? "0 3px 20px rgba(0,0,0,0.6)" : "none" }}>
                  Welcome back, <span className="gradient-text">{user?.name || "Fan"}</span>
                </h1>
                <p style={{ color: heroBackdrop ? "#d8cfe8" : "var(--text-muted)", margin: 0, fontSize: 14 }}>
                  Personalized fandom hub tailored to your favorite categories and interests.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={() => setActiveTab("feed")}
                className="btn"
                style={{ padding: "10px 18px", fontSize: 13.5, display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <FiCompass size={15} /> My Fandom Feed
              </button>
              <Link
                to="/profile"
                style={{ padding: "10px 18px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 13.5, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}
              >
                <FiUser size={14} /> Profile & Fandoms
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            padding: "8px 12px",
            borderRadius: 16,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { id: "overview", label: "Overview", icon: FiGrid },
              { id: "feed", label: "My Fandom Feed", icon: FiCompass, badge: favoriteCategories.length ? `${favoriteCategories.length} Active` : null },
              { id: "bookmarks", label: "Bookmarks & Notes", icon: FiBookmark, badge: bookmarks?.length || null },
              { id: "activity", label: "Activity & Status", icon: FiActivity, badge: activities?.length || null },
            ].map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 16px",
                    borderRadius: 12,
                    border: active ? "1px solid var(--primary)" : "1px solid transparent",
                    background: active ? "var(--primary)18" : "transparent",
                    color: active ? "var(--primary)" : "var(--text-muted)",
                    fontWeight: active ? 800 : 600,
                    fontSize: 13.5,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      style={{
                        padding: "2px 7px",
                        borderRadius: 999,
                        fontSize: 10.5,
                        fontWeight: 800,
                        background: active ? "var(--primary)" : "var(--border)",
                        color: active ? "#fff" : "var(--text-muted)",
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <Link
            to="/profile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12.5,
              fontWeight: 700,
              color: "var(--accent)",
              textDecoration: "none",
              padding: "6px 12px",
              borderRadius: 8,
              background: "rgba(139,92,246,0.1)",
            }}
          >
            <FiHeart size={13} /> Edit Favorite Fandoms ({favoriteCategories.length})
          </Link>
        </div>
      </div>

      <div className="container">
        <div style={{ display: "flex", gap: 14, overflowX: "auto", marginBottom: 36, scrollbarWidth: "none" }}>
          <StatChip
            title="My Fandoms"
            value={favoriteCategories.length}
            icon={FiHeart}
            color="#ec4899"
            onClick={() => setActiveTab("feed")}
            active={activeTab === "feed"}
          />
          <StatChip
            title="Bookmarks"
            value={bookmarks?.length || 0}
            icon={FiBookmark}
            color="#8b5cf6"
            onClick={() => setActiveTab("bookmarks")}
            active={activeTab === "bookmarks"}
          />
          <StatChip
            title="Personal Notes"
            value={notes?.length || 0}
            icon={FiEdit3}
            color="#3b82f6"
            onClick={() => setActiveTab("bookmarks")}
            active={activeTab === "bookmarks"}
          />
          <StatChip
            title="Live Activity"
            value={activities?.length || 0}
            icon={FiTrendingUp}
            color="#10b981"
            onClick={() => setActiveTab("activity")}
            active={activeTab === "activity"}
          />
        </div>

        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div style={{ marginBottom: 40 }}>
              <SectionHeading
                title="Your Favorite Fandoms"
                to="/profile"
                icon={FiHeart}
                badge={favoriteCategories.length > 0 ? `${favoriteCategories.length} Selected` : "None set"}
                actionText="Manage in Profile"
              />
              {favoriteCategories.length === 0 ? (
                <div className="card" style={{ padding: 28, textAlign: "center" }}>
                  
                  <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 6px" }}>No Favorite Categories Selected</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 13.5, margin: "0 0 16px" }}>
                    Select your favorite universes (Anime, Gaming, Movies, etc.) to customize your personalized dashboard feed!
                  </p>
                  <Link to="/profile" className="btn" style={{ fontSize: 13, padding: "8px 18px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <FiHeart size={14} /> Pick Favorite Fandoms
                  </Link>
                </div>
              ) : (
                <ShelfScroller>
                  {favoriteCategories.map((c) => {
                    const name = c.name || c;
                    const meta = {} || {  color: "#8b5cf6" };
                    return (
                      <PosterCard
                        key={c._id || name}
                        to={`/category/${encodeURIComponent(name)}`}
                        title={`${meta.icon}  ${name}`}
                        subtitle="Explore Hub →"
                        gradient={`linear-gradient(135deg, ${meta.color}55, ${meta.color}15)`}
                      />
                    );
                  })}
                </ShelfScroller>
              )}
            </div>

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
                <div className="card" style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
                  <p style={{ margin: "0 0 8px", fontSize: 13.5 }}>No content found for your currently selected categories.</p>
                  <button onClick={() => setActiveTab("feed")} className="btn" style={{ fontSize: 12.5, padding: "6px 14px" }}>
                    Browse All Fandoms
                  </button>
                </div>
              ) : (
                <ShelfScroller>
                  {recommendedItems.map((item) => (
                    <div key={item._id} style={{ width: 220, flexShrink: 0, scrollSnapAlign: "start" }}>
                      <ContentCard item={item} />
                    </div>
                  ))}
                </ShelfScroller>
              )}
            </div>

            <div style={{ marginBottom: 40 }}>
              <SectionHeading title="Trending Across Fandom Hub" to="/explore" icon={FiTrendingUp} badge="Most Popular" />
              {trendingLoading ? (
                <LoadingGrid count={4} height={150} />
              ) : trendingItems.length === 0 ? (
                <div className="card" style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
                  <p style={{ margin: 0, fontSize: 13.5 }}>Nothing trending yet — be the first to explore new content.</p>
                </div>
              ) : (
                <ShelfScroller>
                  {trendingItems.map((item) => (
                    <div key={item._id} style={{ width: 220, flexShrink: 0, scrollSnapAlign: "start" }}>
                      <ContentCard item={item} />
                    </div>
                  ))}
                </ShelfScroller>
              )}
            </div>

            <div style={{ marginBottom: 40 }}>
              <SectionHeading title="Quick Universe Access" icon={FiLayers} />
              <ShelfScroller>
                {quickNavLinks.map((ql) => (
                  <PosterCard
                    key={ql.to}
                    to={ql.to}
                    title={ql.label}
                    subtitle="Explore Section →"
                    gradient={`linear-gradient(135deg, ${ql.color}55, ${ql.color}15)`}
                  />
                ))}
              </ShelfScroller>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
              <div className="card" style={{ padding: 22 }}>
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
                        <div style={{ padding: "10px 12px", borderRadius: 10, background: "var(--bg-soft)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: 10.5, fontWeight: 800, color: "var(--accent)", textTransform: "uppercase" }}>{s.category}</div>
                            <div style={{ fontSize: 13.5, fontWeight: 700 }}>{s.title}</div>
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                            <FiEye size={12} /> {s.views || 0}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="card" style={{ padding: 22 }}>
                <SectionHeading
                  title="Recent Activity"
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
                      const meta = ACTIVITY_ICONS[a.type] || { icon: FiClock, color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" };
                      const Icon = meta.icon;
                      return (
                        <div key={a._id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 10px", borderRadius: 10, background: "var(--bg-soft)", border: "1px solid var(--border)" }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", color: meta.color, flexShrink: 0 }}>
                            <Icon size={13} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.message}</div>
                            <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>{timeAgo(a.createdAt)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "feed" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="card" style={{ padding: 20, marginBottom: 24, borderRadius: 16 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
                <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
                  <FiSearch style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search within your fandom feed..."
                    style={{
                      width: "100%",
                      padding: "10px 14px 10px 38px",
                      borderRadius: 10,
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
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <option value="latest">Latest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="alpha">Alphabetical (A-Z)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8, color: "var(--text-muted)", marginBottom: 8 }}>
                  Category / Fandom Scope:
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={() => setSelectedCategory("my-fandoms")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 999,
                      border: selectedCategory === "my-fandoms" ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                      background: selectedCategory === "my-fandoms" ? "var(--primary)20" : "var(--surface)",
                      color: selectedCategory === "my-fandoms" ? "var(--primary)" : "var(--text)",
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    My Selected Fandoms ({favoriteCategories.length})
                  </button>

                  <button
                    onClick={() => setSelectedCategory("all")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 999,
                      border: selectedCategory === "all" ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                      background: selectedCategory === "all" ? "var(--primary)20" : "var(--surface)",
                      color: selectedCategory === "all" ? "var(--primary)" : "var(--text)",
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    All 8 Fandoms
                  </button>

                  {(categoriesData || Object.keys(CATEGORY_META).map((name) => ({ name }))).map((c) => {
                    const catName = c.name;
                    const isSelected = selectedCategory === catName;
                    const isFavorite = favoriteCategoryNames.includes(catName);
                    return (
                      <button
                        key={catName}
                        onClick={() => setSelectedCategory(catName)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 999,
                          border: isSelected ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                          background: isSelected ? "var(--primary)20" : "var(--surface)",
                          color: isSelected ? "var(--primary)" : "var(--text)",
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <span>{{}?.icon || "•"}</span>
                        <span>{catName}</span>
                        {isFavorite && <span style={{ color: "#ec4899", fontSize: 10 }}>[Fav]</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

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
                          padding: "6px 12px",
                          borderRadius: 999,
                          border: isSelected ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                          background: isSelected ? "var(--accent)20" : "var(--surface)",
                          color: isSelected ? "var(--accent)" : "var(--text-muted)",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Icon size={13} /> {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 800 }}>
                Showing <span style={{ color: "var(--primary)" }}>{processedFeed.length}</span> items
                {selectedCategory === "my-fandoms" ? " in Your Favorite Fandoms" : selectedCategory !== "all" ? ` in ${selectedCategory}` : ""}
              </div>
            </div>

            {feedLoading ? (
              <LoadingGrid count={8} height={200} />
            ) : processedFeed.length === 0 ? (
              <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                <FiCompass size={36} style={{ opacity: 0.3, marginBottom: 12 }} />
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 8px", color: "var(--text)" }}>No matching content found</h3>
                <p style={{ maxWidth: 460, margin: "0 auto 16px", fontSize: 13.5 }}>
                  {selectedCategory === "my-fandoms" && favoriteCategories.length === 0
                    ? "You haven't selected any favorite categories in your profile yet."
                    : "Try adjusting your category filter, content type, or search term."}
                </p>
                {selectedCategory === "my-fandoms" && favoriteCategories.length === 0 ? (
                  <Link to="/profile" className="btn" style={{ fontSize: 13, padding: "8px 18px" }}>
                    <FiHeart size={14} style={{ marginRight: 6 }} /> Choose Favorite Categories
                  </Link>
                ) : (
                  <button onClick={() => { setSelectedCategory("all"); setSelectedType("all"); setSearchQuery(""); }} className="btn" style={{ fontSize: 13, padding: "8px 18px" }}>
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
                {processedFeed.map((item) => {
                  if (item._feedType === "article") {
                    return <div key={`art_${item._id}`}><ArticleCard article={item} /></div>;
                  }
                  if (item._feedType === "character") {
                    return <div key={`char_${item._id}`}><CharacterCard character={item} /></div>;
                  }
                  if (item._feedType === "multimedia") {
                    return <div key={`med_${item._id}`}><MediaCard media={item} /></div>;
                  }
                  if (item._feedType === "merchandise") {
                    return <div key={`merch_${item._id}`}><MerchCard item={item} /></div>;
                  }
                  if (item._feedType === "release") {
                    return <div key={`rel_${item._id}`}><ReleaseCard release={item} /></div>;
                  }
                  
                  return <div key={`cnt_${item._id}`}><ContentCard item={item} /></div>;
                })}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "bookmarks" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
              <div>
                <SectionHeading title="Saved Bookmarks" to="/bookmarks" icon={FiBookmark} badge={bookmarks?.length ? `${bookmarks.length} saved` : "0"} />
                {bookmarksLoading ? (
                  <LoadingGrid count={4} height={120} />
                ) : recentBookmarks.length === 0 ? (
                  <div className="card" style={{ padding: 28, textAlign: "center", color: "var(--text-muted)" }}>
                    <FiBookmark size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                    <p style={{ margin: 0, fontSize: 13.5 }}>No bookmarks saved yet.</p>
                    <button onClick={() => setActiveTab("feed")} className="btn" style={{ fontSize: 12.5, padding: "6px 14px", marginTop: 12 }}>
                      Explore Fandom Feed
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
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
                  <div className="card" style={{ padding: 28, textAlign: "center", color: "var(--text-muted)" }}>
                    <FiEdit3 size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                    <p style={{ margin: "0 0 10px", fontSize: 13.5 }}>No notes created yet.</p>
                    <Link to="/notes" className="btn" style={{ fontSize: 12.5, padding: "7px 14px", display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <FiPlusCircle size={13} /> Add Note
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {recentNotes.map((n) => (
                      <Link key={n._id} to="/notes" style={{ textDecoration: "none", color: "inherit" }}>
                        <motion.div whileHover={{ x: 4, borderColor: "var(--accent)" }} className="card" style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>{n.title || "Untitled note"}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{timeAgo(n.updatedAt || n.createdAt)}</div>
                          </div>
                          <div style={{ fontSize: 13, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {n.body}
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                    <Link to="/notes" className="btn" style={{ fontSize: 12.5, padding: "8px 14px", textAlign: "center", marginTop: 6 }}>
                      Manage All Notes →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "activity" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28 }}>
              <div className="card" style={{ padding: 24, borderRadius: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 900, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
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
                          padding: "4px 10px",
                          borderRadius: 999,
                          border: activityFilter === f.id ? "1px solid var(--primary)" : "1px solid var(--border)",
                          background: activityFilter === f.id ? "var(--primary)20" : "var(--surface)",
                          color: activityFilter === f.id ? "var(--primary)" : "var(--text-muted)",
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
                  <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)", fontSize: 13.5 }}>
                    No activity found for this filter.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {filteredActivities.map((a, i) => {
                      const meta = ACTIVITY_ICONS[a.type] || { icon: FiClock, color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" };
                      const Icon = meta.icon;
                      return (
                        <motion.div
                          key={a._id}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                            padding: "12px 14px",
                            borderRadius: 12,
                            background: "var(--bg-soft)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
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
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="card" style={{ padding: 22, borderRadius: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                    <FiCheckCircle size={17} color="#10b981" /> Account & Membership
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13.5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                      <span>User Name:</span>
                      <span style={{ fontWeight: 700, color: "var(--text)" }}>{user?.name}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                      <span>Email Address:</span>
                      <span style={{ fontWeight: 600, color: "var(--text)" }}>{user?.email}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                      <span>Account Role:</span>
                      <span style={{ fontWeight: 800, color: user?.role === "admin" ? "#a855f7" : user?.role === "user" ? "#10b981" : "#3b82f6", textTransform: "uppercase", letterSpacing: 0.5 }}>
                        {user?.role || "Visitor"}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                      <span>Email Status:</span>
                      <span style={{ fontWeight: 700, color: user?.isEmailVerified ? "#10b981" : "#f59e0b" }}>
                        {user?.isEmailVerified ? "Verified" : "Pending Verification"}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                      <span>Favorite Fandoms:</span>
                      <span style={{ fontWeight: 700, color: "var(--accent)" }}>
                        {favoriteCategories.length} Categories
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link to="/profile" className="btn" style={{ fontSize: 12.5, padding: "8px 16px", width: "100%", textAlign: "center" }}>
                      Edit Profile & Preferences
                    </Link>
                  </div>
                </div>

                {!isContributor && (
                  <div className="card" style={{ padding: 22, borderRadius: 16, background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.08))" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 8 }}>
                      <FiFeather size={16} color="var(--primary)" /> Become a Contributor
                    </h3>
                    <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "0 0 14px", lineHeight: 1.5 }}>
                      Share your fan theories, articles, and cosplay highlights with the Fandom Universe community.
                    </p>
                    <Link to="/profile" className="btn" style={{ fontSize: 12.5, padding: "7px 14px", display: "inline-block" }}>
                      Upgrade Account →
                    </Link>
                  </div>
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
