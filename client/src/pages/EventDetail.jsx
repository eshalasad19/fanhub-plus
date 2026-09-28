import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Calendar, MapPin, Link as LinkIcon, ArrowLeft, Tag, Eye } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb.jsx";
import EventMap from "../components/EventMap.jsx";



const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch(() => setError("Event not found."))
      .finally(() => setLoading(false));
  }, [id]);

  
  useEffect(() => {
    axios.post(`/api/events/${id}/view`).catch(() => {});
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--text-muted)" }}>
        Loading event…
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <div style={{ fontSize: 48, marginBottom: 12, display: "flex", justifyContent: "center" }}><AlertCircle size={40} color="var(--text-muted)" /></div>
        <p style={{ color: "var(--text-muted)" }}>{error || "Event not found."}</p>
        <Link
          to="/events"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 16,
            color: "#8b5cf6",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={15} /> Back to Events
        </Link>
      </div>
    );
  }

  const dateStr = new Date(event.date).toLocaleDateString(undefined, { dateStyle: "long" });

  return (
    <div>
      <div style={{ position: "relative", minHeight: 280, overflow: "hidden" }}>
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }}
          />
        ) : (
          <div
            style={{
              height: 320,
              background: "linear-gradient(135deg,#4c1d95,#7c3aed,#a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 80,
            }}
          >
            {event.category}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)",
          }}
        />
        <Link
          to="/events"
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(6px)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={14} /> Back to Events
        </Link>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <Breadcrumb
          items={[
            { label: "Events", to: "/events" },
            { label: event.category, to: "/events" },
            { label: event.title },
          ]}
        />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 12px",
              borderRadius: 999,
              fontSize: 12.5,
              fontWeight: 700,
              background: "rgba(139,92,246,0.15)",
              color: "#8b5cf6",
              marginBottom: 14,
            }}
          >
            <Tag size={11} /> {event.category}
          </span>

          <h1 style={{ margin: "0 0 8px", fontSize: 32, fontWeight: 800 }}>{event.title}</h1>

          {event.views != null && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5,
              color: "var(--text-muted)", marginBottom: 14 }}>
              <Eye size={13} /> {(event.views || 0).toLocaleString()} views
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
              fontSize: 14,
              color: "var(--text-muted)",
              marginBottom: 28,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Calendar size={15} style={{ color: "#8b5cf6" }} /> {dateStr}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={15} style={{ color: "#8b5cf6" }} /> {event.venue}, {event.city}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "start" }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>About this event</h2>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text-muted)", margin: 0 }}>
                {event.description}
              </p>
            </div>

            <div
              className="card"
              style={{ padding: 20, minWidth: 220, display: "flex", flexDirection: "column", gap: 14 }}
            >
              <InfoRow icon={<Calendar size={14} />} label="Date" value={dateStr} />
              <InfoRow icon={<MapPin size={14} />} label="Venue" value={event.venue} />
              <InfoRow icon={<MapPin size={14} />} label="City" value={event.city} />
              {event.ticketLink && (
                <a
                  href={event.ticketLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "11px 16px",
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    textDecoration: "none",
                    marginTop: 4,
                  }}
                >
                  <LinkIcon size={14} /> Get Tickets
                </a>
              )}
            </div>
          </div>

          <div style={{ marginTop: 36 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin size={16} style={{ color: "#8b5cf6" }} /> Location
            </h2>
            <EventMap events={[event]} height={320} />
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 10 }}>
              {event.venue} · {event.city}
              {!event.location?.lat && " — exact coordinates not set for this event yet."}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
    <span style={{ color: "#8b5cf6", marginTop: 2 }}>{icon}</span>
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
      <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 2 }}>{value}</div>
    </div>
  </div>
);

export default EventDetail;
