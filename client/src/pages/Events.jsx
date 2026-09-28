import CategoryIcon from "../components/CategoryIcon.jsx";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { MapPin, Calendar, Link as LinkIcon, Search, Filter, Navigation, X } from "lucide-react";
import EventCalendar from "../components/EventCalendar.jsx";
import EventMap from "../components/EventMap.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";

const CATEGORIES = ["All", "Anime", "Gaming", "Movies", "TV Shows", "K-Pop", "Comics", "Manga", "Cosplay"];



const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const [view, setView] = useState("grid"); 
  const [nearby, setNearby] = useState(null); 
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    axios.get("/api/events").then((res) => {
      const sorted = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(sorted);
      
      const uniqueCities = [...new Set(sorted.map((e) => e.city))].filter(Boolean).sort();
      setCities(uniqueCities);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = events;
    if (category !== "All") result = result.filter((e) => e.category === category);
    if (city) result = result.filter((e) => e.city === city);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.venue?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [events, category, city, search]);

  
  const groupByMonth = (evts) => {
    const groups = {};
    evts.forEach((e) => {
      const key = new Date(e.date).toLocaleDateString(undefined, { month: "long", year: "numeric" });
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });
    return groups;
  };

  const grouped = groupByMonth(filtered);

  const findNearby = () => {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Location services aren't available in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        try {
          const res = await axios.get("/api/events/nearby", { params: { lat: userLocation.lat, lng: userLocation.lng, radius: 150 } });
          setNearby({ userLocation, results: res.data });
        } catch {
          setLocationError("Couldn't fetch nearby events. Please try again.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocationError("Location access was denied. Enable it in your browser to find nearby events.");
        setLocating(false);
      }
    );
  };

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg,#4c1d95 0%,#6d28d9 50%,#a855f7 100%)",
          padding: "60px 24px 48px",
          textAlign: "center",
        }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 style={{ margin: 0, fontSize: 38, fontWeight: 800, color: "#fff" }}>
            Fan Events
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, marginTop: 10 }}>
            Conventions, meetups, screenings & more — all in one place
          </p>
        </motion.div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <Breadcrumb items={[{ label: "Events" }]} />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div style={{ position: "relative", flex: "1 1 200px" }}>
            <Search
              size={14}
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events…"
              style={{
                width: "100%",
                padding: "10px 12px 10px 34px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text)",
                fontSize: 13.5,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
              fontSize: 13.5,
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div style={{ display: "flex", gap: 6 }}>
            {["grid", "calendar"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: "9px 16px",
                  borderRadius: 999,
                  border: "1px solid var(--border)",
                  background: view === v ? "linear-gradient(135deg,#8b5cf6,#6d28d9)" : "var(--surface)",
                  color: view === v ? "#fff" : "var(--text)",
                  fontSize: 12.5,
                  fontWeight: 600,
                  textTransform: "capitalize",
                  cursor: "pointer",
                }}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            onClick={findNearby}
            disabled={locating}
            style={{
              padding: "9px 16px",
              borderRadius: 999,
              border: "1px solid #3b82f6",
              background: "rgba(59,130,246,0.1)",
              color: "#3b82f6",
              fontSize: 12.5,
              fontWeight: 700,
              cursor: locating ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Navigation size={13} /> {locating ? "Locating…" : "Find Events Near Me"}
          </button>
        </div>

        {locationError && (
          <div style={{ marginBottom: 20, fontSize: 13, color: "#ef4444", fontWeight: 600 }}>{locationError}</div>
        )}

        {nearby && (
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <Navigation size={16} color="#3b82f6" /> Events Near You
              </h2>
              <button
                onClick={() => setNearby(null)}
                style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: "var(--text-muted)", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
              >
                <X size={13} /> Clear
              </button>
            </div>

            <EventMap events={nearby.results} userLocation={nearby.userLocation} height={320} />

            {nearby.results.length === 0 ? (
              <div className="card" style={{ padding: 24, textAlign: "center", color: "var(--text-muted)", marginTop: 14, fontSize: 13.5 }}>
                No mapped events found within 150km of your location.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                {nearby.results.map((event) => (
                  <CalendarRow key={event._id} event={event} distanceKm={event.distanceKm} />
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: "7px 14px",
                borderRadius: 999,
                border: "1px solid var(--border)",
                background: category === cat ? "linear-gradient(135deg,#8b5cf6,#6d28d9)" : "var(--surface)",
                color: category === cat ? "#fff" : "var(--text)",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <CategoryIcon name={cat} size={14} />
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
            Loading events…
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 40, marginBottom: 12, display: "flex", justifyContent: "center" }}><Search size={36} color="var(--text-muted)" /></div>
            No events found. Try adjusting your filters.
          </div>
        ) : view === "grid" ? (
          
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}
          >
            {filtered.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </motion.div>
        ) : (
          
          <EventCalendar events={filtered} />
        )}
      </div>
    </div>
  );
};


const EventCard = ({ event }) => (
  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
    <Link to={`/events/${event._id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <motion.div
        whileHover={{ y: -4, boxShadow: "0 14px 36px rgba(139,92,246,0.22)" }}
        className="card"
        style={{ padding: 0, overflow: "hidden", cursor: "pointer" }}
      >
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            style={{ width: "100%", height: 160, objectFit: "cover" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div
            style={{
              height: 160,
              background: "linear-gradient(135deg,#4c1d95,#7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            <Calendar size={20} />
          </div>
        )}

        <div style={{ padding: 16 }}>
          <span
            style={{
              display: "inline-block",
              padding: "3px 10px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              background: "rgba(139,92,246,0.15)",
              color: "#8b5cf6",
              marginBottom: 8,
            }}
          >
            {event.category}
          </span>
          <div style={{ fontWeight: 700, fontSize: 15.5, marginBottom: 6 }}>{event.title}</div>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "0 0 12px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {event.description}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, color: "var(--text-muted)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Calendar size={12} />
              {new Date(event.date).toLocaleDateString(undefined, { dateStyle: "medium" })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={12} />
              {event.venue}, {event.city}
            </div>
          </div>
          {event.ticketLink && (
            <a
              href={event.ticketLink}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                marginTop: 12,
                color: "#8b5cf6",
                fontSize: 12.5,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <LinkIcon size={12} /> Get Tickets
            </a>
          )}
        </div>
      </motion.div>
    </Link>
  </motion.div>
);


const CalendarRow = ({ event, distanceKm }) => {
  const d = new Date(event.date);
  return (
    <Link to={`/events/${event._id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <motion.div
        whileHover={{ x: 4 }}
        className="card"
        style={{ display: "flex", gap: 16, alignItems: "center", padding: 14, cursor: "pointer" }}
      >
        <div
          style={{
            width: 52,
            flexShrink: 0,
            textAlign: "center",
            background: "rgba(139,92,246,0.12)",
            borderRadius: 10,
            padding: "8px 4px",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase" }}>
            {d.toLocaleDateString(undefined, { month: "short" })}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>
            {d.getDate()}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14.5 }}>{event.title}</div>
          <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 3, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={11} /> {event.venue}, {event.city}
            </span>
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                background: "rgba(139,92,246,0.12)",
                color: "#8b5cf6",
              }}
            >
              {event.category}
            </span>
            {distanceKm != null && (
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  background: "rgba(59,130,246,0.12)",
                  color: "#3b82f6",
                }}
              >
                {distanceKm.toFixed(1)} km away
              </span>
            )}
          </div>
        </div>

        {event.ticketLink && (
          <a
            href={event.ticketLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              border: "1px solid #8b5cf6",
              color: "#8b5cf6",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            Tickets
          </a>
        )}
      </motion.div>
    </Link>
  );
};

export default Events;
