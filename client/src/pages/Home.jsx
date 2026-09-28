import CategoryIcon, { CATEGORY_COLORS, CATEGORY_GLOWS } from "../components/CategoryIcon.jsx";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Sparkles, Flame, Shield, Globe, Zap, Compass, Star, PlayCircle } from "lucide-react";
import {
  FiCompass,
  FiUsers,
  FiFilm,
  FiShoppingBag,
  FiCalendar,
  FiBookmark,
  FiMessageSquare,
  FiShield,
  FiFeather,
  FiLayers,
  FiActivity,
  FiHeart,
  FiTag,
  FiGrid,
  FiHelpCircle,
  FiArrowRight,
} from "react-icons/fi";
import LottieAnimation from "../components/LottieAnimation.jsx";
import { heroCosmicLottie, sparklesLottie } from "../assets/lottieData.js";
import "./Home.css";

const CATEGORY_NAMES = ["Anime", "Gaming", "Movies", "TV Shows", "K-Pop", "Comics", "Manga", "Cosplay"];

const FALLBACK_CATEGORIES = CATEGORY_NAMES.map((name) => ({
  name,
}));

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const Home = () => {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [dbStatus, setDbStatus] = useState("checking");
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const navigate = useNavigate();

  const dynamicWords = ["Every Fandom.", "Epic Lore.", "Exclusive Merch.", "Live Communities."];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % dynamicWords.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((res) => {
        setDbStatus("connected");
        if (res.data?.length) {
          setCategories(res.data);
        }
      })
      .catch(() => {
        setDbStatus("offline");
      });
  }, []);

  return (
    <main className="fanhub-home">
      {/* Background Video with Gradient Overlay */}
      <div className="video-background">
        <video autoPlay muted loop playsInline preload="auto">
          <source src="/videos/fandom-bg.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="video-overlay"></div>

      {/* Hero Section with Lottie Animation */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Lottie Floating Badge */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <div style={{ width: 22, height: 22 }}>
                <LottieAnimation animationData={sparklesLottie} loop={true} />
              </div>
              <span>WELCOME TO FANHUB PLUS</span>
              <div style={{ width: 22, height: 22 }}>
                <LottieAnimation animationData={sparklesLottie} loop={true} />
              </div>
            </motion.div>
          </div>

          {/* Animated Kinetic Title */}
          <h1>
            One Universe.
            <br />
            <span className="gradient-text" key={activeWordIndex} style={{ display: "inline-block" }}>
              <motion.span
                initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                {dynamicWords[activeWordIndex]}
              </motion.span>
            </span>
          </h1>

          <p className="hero-description">
            Explore the worlds you love. Discover curated lore, characters, games, trailers, and collectible merchandise — all powered by our interactive fandom platform.
          </p>

          {/* Center Lottie Interactive Portal */}
          <div style={{ display: "flex", justifyContent: "center", margin: "18px 0 6px" }}>
            <div style={{ width: 140, height: 140, filter: "drop-shadow(0 0 25px rgba(219,39,119,0.5))" }}>
              <LottieAnimation animationData={heroCosmicLottie} loop={true} />
            </div>
          </div>

          <div className="hero-buttons">
            <button
              className="explore-btn"
              onClick={() =>
                document.getElementById("fandom-categories")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Fandoms
              <FiArrowRight style={{ marginLeft: 8 }} />
            </button>

            <button
              className="discover-btn"
              onClick={() =>
                document.getElementById("fanhub-sitemap")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View Sitemap & Portals
            </button>
          </div>
        </motion.div>

        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span>SCROLL TO EXPLORE</span>
          <div className="scroll-line"></div>
        </motion.div>
      </section>

      {/* Categories Showcase */}
      <section id="fandom-categories" className="categories-section">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span>EXPLORE UNIVERSES</span>

          <h2>
            Find Your <strong>Fandom</strong>
          </h2>

          <p>Dive into your favorite universes and discover something new.</p>

          <div className={`db-status ${dbStatus === "connected" ? "online" : ""}`}>
            <span></span>
            {dbStatus === "checking"
              ? "Connecting…"
              : dbStatus === "connected"
              ? "Live Content Connected"
              : "Offline Mode"}
          </div>
        </motion.div>

        <motion.div
          className="category-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {categories.map((cat) => {
            const color = CATEGORY_COLORS[cat.name] || "#ec4899";
            const glow = CATEGORY_GLOWS[cat.name] || "rgba(219, 39, 119, 0.45)";
            return (
              <motion.div
                key={cat.name}
                variants={item}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                }}
                onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
                className="fandom-card"
                style={{
                  cursor: "pointer",
                  "--card-accent": color,
                  "--card-glow": glow,
                }}
              >
                <div className="card-glow" style={{ background: color }}></div>

                <div className="category-icon-wrapper">
                  <CategoryIcon name={cat.name} size={36} color={color} />
                </div>

                <h3>{cat.name}</h3>
                <p>Explore {cat.name} Universe & Drops</p>

                <div className="card-arrow">
                  <FiArrowRight />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Sitemap & Portal Navigation */}
      <section
        id="fanhub-sitemap"
        style={{
          position: "relative",
          zIndex: 2,
          padding: "80px 24px 100px",
          maxWidth: 1240,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 50 }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 2,
              color: "var(--primary)",
              textTransform: "uppercase",
            }}
          >
            ARCHITECTURE & NAVIGATION
          </span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, margin: "10px 0" }}>
            Fan Hub Plus <span className="gradient-text">Sitemap</span>
          </h2>
          <p style={{ color: "var(--text-muted)", maxWidth: 650, margin: "0 auto", fontSize: 15 }}>
            A complete navigational flow of the Fandom Universe portal for fans, creators, and administrators.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {/* Card 1: Fandom Universes */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            whileHover={{ y: -6 }}
            className="sitemap-card"
          >
            <div className="sitemap-header">
              <div className="sitemap-icon-badge" style={{ background: "rgba(219, 39, 119, 0.15)", color: "var(--primary)" }}>
                <FiLayers size={18} />
              </div>
              <h3>Fandom Universes</h3>
            </div>
            <ul className="sitemap-list">
              {CATEGORY_NAMES.map((cat) => {
                const color = CATEGORY_COLORS[cat] || "#ec4899";
                return (
                  <li key={cat}>
                    <Link to={`/category/${encodeURIComponent(cat)}`} className="sitemap-link">
                      <span className="sitemap-link-icon" style={{ color }}>
                        <CategoryIcon name={cat} size={15} color={color} />
                      </span>
                      <span>{cat} Hub</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Card 2: Discovery Hub */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="sitemap-card"
          >
            <div className="sitemap-header">
              <div className="sitemap-icon-badge" style={{ background: "rgba(147, 51, 234, 0.15)", color: "#9333ea" }}>
                <FiCompass size={18} />
              </div>
              <h3>Discovery Hub</h3>
            </div>
            <ul className="sitemap-list">
              {[
                { to: "/explore", label: "Content Explorer", icon: FiCompass, color: "#3b82f6" },
                { to: "/characters", label: "Character Profiles", icon: FiUsers, color: "#a855f7" },
                { to: "/articles", label: "Featured Articles", icon: FiFeather, color: "#06b6d4" },
                { to: "/multimedia", label: "Multimedia Center", icon: FiFilm, color: "#f59e0b" },
                { to: "/merchandise", label: "Merch Showcase", icon: FiShoppingBag, color: "#ec4899" },
                { to: "/releases", label: "Upcoming Releases", icon: FiCalendar, color: "#10b981" },
                { to: "/events", label: "Events & Calendar", icon: FiActivity, color: "#f43f5e" },
                { to: "/tags", label: "Fandom Tags", icon: FiTag, color: "#6366f1" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link to={item.to} className="sitemap-link">
                      <span className="sitemap-link-icon" style={{ color: item.color }}>
                        <Icon size={15} />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Card 3: Fan Portal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ y: -6 }}
            className="sitemap-card"
          >
            <div className="sitemap-header">
              <div className="sitemap-icon-badge" style={{ background: "rgba(236, 72, 153, 0.15)", color: "#ec4899" }}>
                <FiHeart size={18} />
              </div>
              <h3>Fan Portal</h3>
            </div>
            <ul className="sitemap-list">
              {[
                { to: "/dashboard", label: "Personalized Dashboard", icon: FiGrid, color: "#ec4899" },
                { to: "/profile", label: "User Profile & Preferences", icon: FiUsers, color: "#a855f7" },
                { to: "/bookmarks", label: "Saved Bookmarks", icon: FiBookmark, color: "#3b82f6" },
                { to: "/notes", label: "Personal Notes", icon: FiFeather, color: "#10b981" },
                { to: "/favourites", label: "Favourite Universes", icon: FiHeart, color: "#f43f5e" },
                { to: "/submit", label: "Submit Fan Content", icon: FiLayers, color: "#f59e0b" },
                { to: "/community", label: "Contributors Community", icon: FiUsers, color: "#06b6d4" },
                { to: "/analytics", label: "My Content Analytics", icon: FiActivity, color: "#8b5cf6" },
                { to: "/feedback", label: "Submit Feedback", icon: FiMessageSquare, color: "#ec4899" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link to={item.to} className="sitemap-link">
                      <span className="sitemap-link-icon" style={{ color: item.color }}>
                        <Icon size={15} />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Card 4: Admin & Services */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -6 }}
            className="sitemap-card"
          >
            <div className="sitemap-header">
              <div className="sitemap-icon-badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                <FiShield size={18} />
              </div>
              <h3>Admin & Services</h3>
            </div>
            <ul className="sitemap-list">
              {[
                { to: "/admin", label: "Admin Dashboard Overview", icon: FiGrid, color: "#10b981" },
                { to: "/admin/merchandise", label: "Merchandise Management", icon: FiShoppingBag, color: "#ec4899" },
                { to: "/admin/content", label: "Content Management", icon: FiLayers, color: "#06b6d4" },
                { to: "/admin/multimedia", label: "Multimedia Management", icon: FiFilm, color: "#f59e0b" },
                { to: "/admin/characters", label: "Character Management", icon: FiUsers, color: "#a855f7" },
                { to: "/admin/articles", label: "Articles Management", icon: FiFeather, color: "#3b82f6" },
                { to: "/admin/events", label: "Events Management", icon: FiCalendar, color: "#f43f5e" },
                { to: "/admin/submissions", label: "Fan Submissions Review", icon: FiShield, color: "#10b981" },
                { to: "/admin/feedback", label: "Feedback & Bug Reports", icon: FiMessageSquare, color: "#ec4899" },
                { to: "/admin/chatbot", label: "AI Chatbot Knowledge Base", icon: FiHelpCircle, color: "#8b5cf6" },
                { to: "/admin/analytics", label: "System Analytics", icon: FiActivity, color: "#10b981" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link to={item.to} className="sitemap-link">
                      <span className="sitemap-link-icon" style={{ color: item.color }}>
                        <Icon size={15} />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          <div>© Fan Hub Plus — The Ultimate Fandom Universe Portal</div>
          <div style={{ display: "flex", gap: 20 }}>
            <Link to="/explore" style={{ color: "inherit", textDecoration: "none" }}>
              Explore
            </Link>
            <Link to="/merchandise" style={{ color: "inherit", textDecoration: "none" }}>
              Merchandise
            </Link>
            <Link to="/events" style={{ color: "inherit", textDecoration: "none" }}>
              Events Map
            </Link>
            <Link to="/feedback" style={{ color: "inherit", textDecoration: "none" }}>
              Feedback
            </Link>
            <Link to="/admin" style={{ color: "inherit", textDecoration: "none" }}>
              Admin Portal
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;