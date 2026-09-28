import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Pencil, Trash2, MapPin, Calendar, Link as LinkIcon } from "lucide-react";
import PageHeader from "../shared/PageHeader.jsx";
import ConfirmDialog from "../shared/ConfirmDialog.jsx";
import EventFormModal from "./EventFormModal.jsx";

const iconBtnStyle = {
  width: 30,
  height: 30,
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--bg)",
  color: "var(--text)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadEvents = () => {
    setLoading(true);
    axios.get("/api/events").then((res) => setEvents(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openCreate = () => {
    setEditingEvent(null);
    setFormOpen(true);
  };

  const openEdit = (event) => {
    setEditingEvent(event);
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    loadEvents();
  };

  const handleDelete = async () => {
    await axios.delete(`/api/events/${deleteTarget._id}`);
    setDeleteTarget(null);
    loadEvents();
  };

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="Manage fan conventions, meetups, and screenings."
        actionLabel="New Event"
        onAction={openCreate}
      />

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading events…</p>
      ) : events.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
          No events yet. Create the first one.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {events.map((event) => (
            <motion.div key={event._id} whileHover={{ y: -3 }} className="card" style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15.5 }}>{event.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{event.category}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => openEdit(event)} aria-label="Edit" style={iconBtnStyle}>
                    <Pencil size={14} strokeWidth={2} />
                  </button>
                  <button onClick={() => setDeleteTarget(event)} aria-label="Delete" style={{ ...iconBtnStyle, color: "#ef4444" }}>
                    <Trash2 size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "10px 0", lineHeight: 1.5 }}>{event.description}</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)" }}>
                  <Calendar size={13} /> {new Date(event.date).toLocaleDateString(undefined, { dateStyle: "medium" })}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)" }}>
                  <MapPin size={13} /> {event.venue}, {event.city}
                </div>
                {event.ticketLink && (
                  <a
                    href={event.ticketLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 6, color: "#8b5cf6", textDecoration: "none" }}
                  >
                    <LinkIcon size={13} /> Ticket link
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <EventFormModal open={formOpen} onClose={() => setFormOpen(false)} onSaved={handleSaved} event={editingEvent} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete event"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
      />
    </div>
  );
};

export default AdminEvents;