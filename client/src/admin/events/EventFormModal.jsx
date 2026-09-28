import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../shared/Modal.jsx";
import LocationPickerMap from "./LocationPickerMap.jsx";

const CATEGORIES = ["Anime", "Gaming", "Movies", "TV Shows", "K-Pop", "Comics", "Manga", "Cosplay"];
const EMPTY_FORM = { title: "", description: "", category: "Anime", city: "", venue: "", date: "", ticketLink: "", image: "", lat: null, lng: null };

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 9,
  border: "1px solid var(--border)",
  background: "var(--bg)",
  color: "var(--text)",
  fontSize: 13.5,
  outline: "none",
  fontFamily: "inherit",
};

const labelStyle = { fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" };

const EventFormModal = ({ open, onClose, onSaved, event }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || "",
        description: event.description || "",
        category: event.category || "Anime",
        city: event.city || "",
        venue: event.venue || "",
        date: event.date ? event.date.slice(0, 10) : "",
        ticketLink: event.ticketLink || "",
        image: event.image || "",
        lat: event.location?.lat ?? null,
        lng: event.location?.lng ?? null,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError(null);
  }, [event, open]);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      location: form.lat != null && form.lng != null ? { lat: form.lat, lng: form.lng } : undefined,
    };
    delete payload.lat;
    delete payload.lng;
    try {
      if (event) await axios.put(`/api/events/${event._id}`, payload);
      else await axios.post("/api/events", payload);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={event ? "Edit Event" : "New Event"} width={520}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={labelStyle}>Title</label>
          <input style={inputStyle} value={form.title} onChange={handleChange("title")} required />
        </div>

        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            value={form.description}
            onChange={handleChange("description")}
            required
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Category</label>
            <select style={inputStyle} value={form.category} onChange={handleChange("category")}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date</label>
            <input type="date" style={inputStyle} value={form.date} onChange={handleChange("date")} required />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>City</label>
            <input style={inputStyle} value={form.city} onChange={handleChange("city")} required />
          </div>
          <div>
            <label style={labelStyle}>Venue</label>
            <input style={inputStyle} value={form.venue} onChange={handleChange("venue")} required />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Ticket Link</label>
          <input style={inputStyle} value={form.ticketLink} onChange={handleChange("ticketLink")} placeholder="https://…" />
        </div>

        <div>
          <label style={labelStyle}>Image URL</label>
          <input style={inputStyle} value={form.image} onChange={handleChange("image")} placeholder="https://…" />
        </div>

        <div>
          <label style={labelStyle}>
            Map Location {form.lat != null ? `(${form.lat}, ${form.lng})` : "(click the map to pin it)"}
          </label>
          <LocationPickerMap lat={form.lat} lng={form.lng} onPick={({ lat, lng }) => setForm((f) => ({ ...f, lat, lng }))} />
        </div>

        {error && <p style={{ color: "#ef4444", fontSize: 12.5, margin: 0 }}>{error}</p>}

        <button
          type="submit"
          disabled={saving}
          style={{
            marginTop: 4,
            padding: "11px 16px",
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving…" : event ? "Save Changes" : "Create Event"}
        </button>
      </form>
    </Modal>
  );
};

export default EventFormModal;