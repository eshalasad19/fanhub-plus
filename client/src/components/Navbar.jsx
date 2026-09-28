import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiLogOut,
  FiBookmark,
  FiEdit3,
  FiGrid,
  FiChevronDown,
  FiMessageSquare,
  FiFeather,
  FiHome,
  FiHeart,
  FiTag,
  FiUsers,
  FiBarChart2,
  FiShield,
} from "react-icons/fi";
import ThemeToggle from "./ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/explore", label: "Explore" },
  { to: "/characters", label: "Characters" },
  { to: "/articles", label: "Articles" },
  { to: "/multimedia", label: "Multimedia" },
  { to: "/merchandise", label: "Merch" },
  { to: "/releases", label: "Releases" },
  { to: "/events", label: "Events" },
];

const linkStyle = ({ isActive }) => ({
  fontSize: 14,
  fontWeight: 600,
  color: isActive ? "var(--primary)" : "var(--text-muted)",
});

const menuItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "9px 10px",
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 600,
};

const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isContributor = user.role === "user" || user.role === "admin";

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  
  const navItems = [
    { to: "/dashboard", label: "Home", icon: FiHome },
    { to: "/profile", label: "Profile", icon: FiUser },
  ];
  const fandomItems = [
    { to: "/favourites", label: "Favourites", icon: FiHeart },
    { to: "/bookmarks", label: "Bookmarks", icon: FiBookmark },
    { to: "/tags", label: "Tags", icon: FiTag },
    { to: "/community", label: "Contributors", icon: FiUsers },
  ];
  const contributorItems = [
    { to: "/submit", label: "Share Fan Content", icon: FiFeather },
    { to: "/analytics", label: "My Content Analytics", icon: FiBarChart2 },
  ];
  const accountItems = [
    { to: "/notes", label: "Notes", icon: FiEdit3 },
    { to: "/feedback", label: "Feedback", icon: FiMessageSquare },
  ];

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--text)",
          borderRadius: 999,
          padding: "6px 12px 6px 6px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: user.avatar ? `url(${user.avatar}) center/cover` : "var(--gradient)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {!user.avatar && (user.name?.[0]?.toUpperCase() || "?")}
        </div>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{user.name?.split(" ")[0]}</span>
        <FiChevronDown size={14} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="card"
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 8px)",
              minWidth: 220,
              padding: 8,
              zIndex: 20,
            }}
          >
            <div style={{ padding: "4px 10px 8px", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, color: "var(--text-muted)", textTransform: "uppercase" }}>
                {user.role === "admin" ? "Admin" : isContributor ? "Contributor" : "Visitor"}
              </span>
              {user.role === "admin" && <FiShield size={11} color="#a855f7" />}
            </div>

            {navItems.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setOpen(false)} style={menuItemStyle}>
                <Icon size={14} /> {label}
              </Link>
            ))}

            <div style={{ height: 1, background: "var(--border)", margin: "6px 0" }} />

            {fandomItems.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setOpen(false)} style={menuItemStyle}>
                <Icon size={14} /> {label}
              </Link>
            ))}

            <div style={{ height: 1, background: "var(--border)", margin: "6px 0" }} />

            {isContributor ? (
              contributorItems.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} onClick={() => setOpen(false)} style={menuItemStyle}>
                  <Icon size={14} /> {label}
                </Link>
              ))
            ) : (
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                style={{ ...menuItemStyle, color: "var(--accent)" }}
              >
                <FiFeather size={14} /> Become a Contributor
              </Link>
            )}

            {user.role === "admin" && (
              <Link to="/admin" onClick={() => setOpen(false)} style={{ ...menuItemStyle, color: "#a855f7" }}>
                <FiShield size={14} /> Admin Panel
              </Link>
            )}

            <div style={{ height: 1, background: "var(--border)", margin: "6px 0" }} />

            {accountItems.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setOpen(false)} style={menuItemStyle}>
                <Icon size={14} /> {label}
              </Link>
            ))}

            <div style={{ height: 1, background: "var(--border)", margin: "6px 0" }} />
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                width: "100%",
                border: "none",
                background: "transparent",
                color: "#ef4444",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <FiLogOut size={14} /> Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        padding: "16px 24px",
        backdropFilter: "blur(10px)",
        background: "var(--surface-glass)",
        borderBottom: "1px solid var(--border)",
        flexWrap: "wrap",
      }}
    >
      <Link to="/" style={{ fontSize: 22, fontWeight: 800 }}>
        Fan Hub <span className="gradient-text">Plus</span>
      </Link>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} style={linkStyle}>
            {l.label}
          </NavLink>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ThemeToggle />
        {!loading && (
          isAuthenticated ? (
            <UserMenu />
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <Link
                to="/login"
                style={{ fontSize: 13, fontWeight: 600, padding: "8px 14px", color: "var(--text)" }}
              >
                Log In
              </Link>
              <Link to="/register" className="btn" style={{ fontSize: 13, padding: "8px 16px" }}>
                Sign Up
              </Link>
            </div>
          )
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
