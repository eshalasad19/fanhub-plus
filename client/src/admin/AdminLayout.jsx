import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard, Users, FolderOpen, FileText, UserCircle,
  BookOpen, Film, CalendarDays, ShoppingBag, Bot, FileCheck,
  MessageSquare, Tag, BarChart2, ChevronDown, ChevronRight, Rocket,
  Search, Plus, Bell, X, Zap, LogOut, Globe, Shield, User,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const SIDEBAR_SECTIONS = [
  {
    label: null,
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Users",
    items: [{ to: "/admin/users", label: "Users", icon: Users }],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/categories",  label: "Categories",  icon: FolderOpen },
      { to: "/admin/content",     label: "Content",     icon: FileText },
      { to: "/admin/characters",  label: "Characters",  icon: UserCircle },
      { to: "/admin/articles",    label: "Articles",    icon: BookOpen },
      { to: "/admin/multimedia",  label: "Multimedia",  icon: Film },
      { to: "/admin/merchandise", label: "Merchandise", icon: ShoppingBag },
      { to: "/admin/releases",    label: "Releases",    icon: Rocket },
    ],
  },
  {
    label: "Events & Community",
    items: [
      { to: "/admin/events",      label: "Events",         icon: CalendarDays },
      { to: "/admin/submissions", label: "Fan Submissions", icon: FileCheck },
      { to: "/admin/feedback",    label: "Feedback",        icon: MessageSquare },
    ],
  },
  {
    label: "Chatbot",
    items: [{ to: "/admin/chatbot", label: "FAQ / Knowledge", icon: Bot }],
  },
  {
    label: "System",
    items: [
      { to: "/admin/tags",      label: "Tags",      icon: Tag },
      { to: "/admin/analytics", label: "Analytics", icon: BarChart2 },
    ],
  },
];

const QUICK_CREATE = [
  { label: "New Event",       to: "/admin/events" },
  { label: "New Article",     to: "/admin/articles" },
  { label: "New Character",   to: "/admin/characters" },
  { label: "New Media",       to: "/admin/multimedia" },
  { label: "New Merchandise", to: "/admin/merchandise" },
  { label: "New Release",     to: "/admin/releases" },
  { label: "New FAQ",         to: "/admin/chatbot" },
];

const SEARCH_ROUTES = [
  { label: "Users",        to: "/admin/users" },
  { label: "Categories",   to: "/admin/categories" },
  { label: "Content",      to: "/admin/content" },
  { label: "Characters",   to: "/admin/characters" },
  { label: "Articles",     to: "/admin/articles" },
  { label: "Multimedia",   to: "/admin/multimedia" },
  { label: "Merchandise",  to: "/admin/merchandise" },
  { label: "Events",       to: "/admin/events" },
  { label: "Fan Submissions", to: "/admin/submissions" },
  { label: "Feedback",     to: "/admin/feedback" },
  { label: "Chatbot FAQs", to: "/admin/chatbot" },
  { label: "Tags",         to: "/admin/tags" },
  { label: "Analytics",    to: "/admin/analytics" },
  { label: "Dashboard",    to: "/admin" },
];

const NavItem = ({ to, label, icon: Icon, end }) => (
  <NavLink
    to={to}
    end={end}
    style={({ isActive }) => ({
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "9px 12px",
      borderRadius: 10,
      fontSize: 13,
      fontWeight: isActive ? 700 : 600,
      textDecoration: "none",
      color: isActive ? "#fff" : "var(--text)",
      background: isActive
        ? "var(--gradient)"
        : "transparent",
      boxShadow: isActive ? "0 4px 14px rgba(219,39,119,0.3)" : "none",
      transition: "all 0.2s ease",
    })}
    onMouseEnter={(e) => {
      if (!e.currentTarget.classList.contains("active")) {
        e.currentTarget.style.background = "var(--bg-soft)";
      }
    }}
    onMouseLeave={(e) => {
      if (!e.currentTarget.classList.contains("active")) {
        e.currentTarget.style.background = "transparent";
      }
    }}
  >
    <Icon size={15} strokeWidth={2} />
    {label}
  </NavLink>
);

const SidebarSection = ({ label, items, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 2 }}>
      {label && (
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            width: "100%", background: "transparent", border: "none", cursor: "pointer",
            padding: "7px 12px 5px", color: "var(--text-muted)",
            fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2,
            transition: "color 0.15s",
          }}
        >
          <span>{label}</span>
          {open
            ? <ChevronDown size={11} strokeWidth={2.5} />
            : <ChevronRight size={11} strokeWidth={2.5} />}
        </button>
      )}
      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: label ? 2 : 0 }}>
          {items.map((item) => <NavItem key={item.to} {...item} />)}
        </div>
      )}
    </div>
  );
};

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const results = query.trim().length > 0
    ? SEARCH_ROUTES.filter((r) =>
        r.label.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (to) => {
    navigate(to);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative", flex: 1, maxWidth: 380 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 14px",
        borderRadius: 12,
        border: "1px solid var(--border)",
        background: "var(--bg)",
        transition: "border-color 0.15s",
      }}>
        <Search size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search admin sections…"
          style={{
            flex: 1, border: "none", background: "transparent",
            fontSize: 13, color: "var(--text)", outline: "none",
            fontFamily: "inherit",
          }}
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 0 }}>
            <X size={13} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 200,
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 12, overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        }}>
          {results.map((r) => (
            <button
              key={r.to}
              onClick={() => handleSelect(r.to)}
              style={{
                width: "100%", padding: "10px 16px", border: "none",
                background: "transparent", textAlign: "left", cursor: "pointer",
                fontSize: 13.5, fontWeight: 600, color: "var(--text)",
                display: "flex", alignItems: "center", gap: 8,
                borderBottom: "1px solid var(--border)",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-soft)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <Search size={13} style={{ color: "var(--primary)", flexShrink: 0 }} />
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const QuickCreate = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "9px 16px", borderRadius: 12, border: "none",
          background: "var(--gradient)",
          color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
          boxShadow: "0 4px 14px rgba(219,39,119,0.35)",
          transition: "transform 0.15s, box-shadow 0.15s",
          whiteSpace: "nowrap",
        }}
      >
        <Plus size={15} strokeWidth={2.5} />
        Quick Create
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 200, width: 200,
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 12, overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        }}>
          <p style={{
            margin: 0, padding: "10px 14px 6px",
            fontSize: 10.5, fontWeight: 800, textTransform: "uppercase",
            letterSpacing: 1, color: "var(--text-muted)",
          }}>Create New</p>
          {QUICK_CREATE.map((item) => (
            <button
              key={item.to}
              onClick={() => { navigate(item.to); setOpen(false); }}
              style={{
                width: "100%", padding: "9px 14px", border: "none",
                background: "transparent", textAlign: "left", cursor: "pointer",
                fontSize: 13, fontWeight: 600, color: "var(--text)",
                display: "flex", alignItems: "center", gap: 8,
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-soft)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <Plus size={12} style={{ color: "var(--primary)" }} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogout = async () => {
    if (window.confirm("Are you sure you want to log out of the Admin Panel?")) {
      await logout();
      navigate("/login");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        flexShrink: 0,
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        zIndex: 110,
      }}>
        <div style={{
          padding: "20px 16px 18px",
          borderBottom: "1px solid var(--border)",
        }}>
          <Link to="/admin" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "var(--gradient)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(219,39,119,0.4)",
            }}>
              <Zap size={18} style={{ color: "#fff" }} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: -0.3 }}>
                Fan Hub <span className="gradient-text">Plus</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 800, color: "var(--primary)", textTransform: "uppercase", letterSpacing: 1.2 }}>
                Admin Dashboard
              </div>
            </div>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 6, overflowY: "auto" }}>
          {SIDEBAR_SECTIONS.map((section, i) => (
            <SidebarSection key={i} {...section} />
          ))}
        </nav>

        {/* Sidebar Footer with Public Site Link, Theme Toggle and Logout */}
        <div style={{ padding: "14px 12px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 10, background: "var(--bg-soft)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px" }}>
            <Link
              to="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 700,
                color: "var(--text-muted)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              title="View Public User Site"
            >
              <Globe size={13} /> View Portal
            </Link>
            <ThemeToggle />
          </div>

          <button
            onClick={handleAdminLogout}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: "9px 12px",
              borderRadius: 10,
              border: "1px solid rgba(239,68,68,0.25)",
              background: "rgba(239,68,68,0.08)",
              color: "#ef4444",
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.18)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
            }}
          >
            <LogOut size={14} /> Log Out Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Admin Header */}
        <header style={{
          display: "flex", alignItems: "center", gap: 16,
          padding: "14px 28px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
          position: "sticky", top: 0, zIndex: 100,
          backdropFilter: "blur(12px)",
        }}>
          <GlobalSearch />

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }}>
            <Link
              to="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12.5,
                fontWeight: 700,
                color: "var(--text)",
                padding: "8px 14px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--bg)",
                textDecoration: "none",
              }}
            >
              <Globe size={14} color="var(--primary)" /> Public Portal
            </Link>

            <QuickCreate />

            {/* Admin User Info Pill */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 10px 5px 6px",
              borderRadius: 999,
              background: "var(--bg)",
              border: "1px solid var(--border)",
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--gradient)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 12,
                fontWeight: 900,
              }}>
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 700 }}>
                {user?.name?.split(" ")[0] || "Admin"}
              </span>
              <span style={{
                fontSize: 9.5,
                fontWeight: 800,
                padding: "2px 6px",
                borderRadius: 999,
                background: "rgba(219,39,119,0.15)",
                color: "var(--primary)",
                textTransform: "uppercase",
              }}>
                Root
              </span>
            </div>

            {/* Prominent Header Logout Button */}
            <button
              onClick={handleAdminLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 10,
                border: "1px solid rgba(239,68,68,0.25)",
                background: "rgba(239,68,68,0.08)",
                color: "#ef4444",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              title="Log out of Admin Panel"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>

        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto", minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
