import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, X, MapPin, Calendar } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CATEGORY_COLORS = {
  Anime: "#a78bfa", Gaming: "#60a5fa", Movies: "#f472b6",
  "TV Shows": "#34d399", "K-Pop": "#fbbf24", Comics: "#f87171",
  Manga: "#4ade80", Cosplay: "#fb923c",
};


const buildCalendarDays = (month) => {
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDow = new Date(year, m, 1).getDay();        
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const daysInPrev  = new Date(year, m, 0).getDate();
  const days = [];

  
  for (let i = firstDow - 1; i >= 0; i--)
    days.push({ date: new Date(year, m - 1, daysInPrev - i), current: false });

  
  for (let d = 1; d <= daysInMonth; d++)
    days.push({ date: new Date(year, m, d), current: true });

  
  let next = 1;
  while (days.length % 7 !== 0)
    days.push({ date: new Date(year, m + 1, next++), current: false });

  return days;
};

const isSameDay = (a, b) =>
  a.getDate() === b.getDate() &&
  a.getMonth() === b.getMonth() &&
  a.getFullYear() === b.getFullYear();

const isToday = (d) => isSameDay(d, new Date());


const EventCalendar = ({ events = [] }) => {
  const [month, setMonth] = useState(new Date());
  const [selected, setSelected] = useState(null);   

  const days = useMemo(() => buildCalendarDays(month), [month]);

  const eventsOnDay = (date) =>
    events.filter((e) => isSameDay(new Date(e.date), date));

  const selectedEvents = selected ? eventsOnDay(selected) : [];

  const prevMonth = () => {
    setSelected(null);
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setSelected(null);
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  };

  const monthLabel = month.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 18,
      }}>
        <button onClick={prevMonth} style={navBtn}>
          <ChevronLeft size={18} />
        </button>
        <motion.div
          key={monthLabel}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}
        >
          {monthLabel}
        </motion.div>
        <button onClick={nextMonth} style={navBtn}>
          <ChevronRight size={18} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 4 }}>
        {DAYS.map((d) => (
          <div key={d} style={{
            textAlign: "center", fontSize: 11, fontWeight: 800,
            color: "var(--text-muted)", textTransform: "uppercase",
            letterSpacing: 1, padding: "6px 0",
          }}>
            {d}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={monthLabel}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}
        >
          {days.map(({ date, current }, idx) => {
            const dayEvents = eventsOnDay(date);
            const isSelected = selected && isSameDay(date, selected);
            const today = isToday(date);

            return (
              <motion.div
                key={idx}
                whileHover={current ? { scale: 1.03 } : {}}
                onClick={() => {
                  if (!current) return;
                  setSelected(isSelected ? null : date);
                }}
                style={{
                  minHeight: 80,
                  borderRadius: 10,
                  border: isSelected
                    ? "2px solid #8b5cf6"
                    : today
                    ? "2px solid rgba(139,92,246,0.4)"
                    : "1px solid var(--border)",
                  background: isSelected
                    ? "rgba(139,92,246,0.1)"
                    : "var(--surface)",
                  padding: "6px 6px 4px",
                  cursor: current ? "pointer" : "default",
                  opacity: current ? 1 : 0.3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  transition: "border-color 0.15s",
                }}
              >
                <div style={{
                  fontSize: 13,
                  fontWeight: today ? 900 : 600,
                  color: today ? "#8b5cf6" : "var(--text)",
                  width: 22, height: 22,
                  borderRadius: "50%",
                  background: today ? "rgba(139,92,246,0.15)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  alignSelf: "flex-start",
                }}>
                  {date.getDate()}
                </div>

                {dayEvents.slice(0, 2).map((ev) => (
                  <div key={ev._id} style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 5px",
                    borderRadius: 4,
                    background: `${CATEGORY_COLORS[ev.category] || "#8b5cf6"}22`,
                    color: CATEGORY_COLORS[ev.category] || "#8b5cf6",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    lineHeight: 1.4,
                  }}>
                    {ev.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, paddingLeft: 2 }}>
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            style={{
              marginTop: 20,
              border: "1px solid var(--border)",
              borderRadius: 14,
              overflow: "hidden",
              background: "var(--surface)",
            }}
          >
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 18px",
              borderBottom: "1px solid var(--border)",
              background: "rgba(139,92,246,0.06)",
            }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                {selected.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
              >
                <X size={16} />
              </button>
            </div>

            {selectedEvents.length === 0 ? (
              <div style={{ padding: "24px 18px", color: "var(--text-muted)", fontSize: 13.5 }}>
                No events on this day.
              </div>
            ) : (
              <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                {selectedEvents.map((ev) => (
                  <Link key={ev._id} to={`/events/${ev._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      style={{
                        display: "flex", gap: 12, alignItems: "center",
                        padding: "10px 12px", borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{
                        width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                        background: CATEGORY_COLORS[ev.category] || "#8b5cf6",
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {ev.title}
                        </div>
                        <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2, display: "flex", gap: 10 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                            <MapPin size={10} /> {ev.venue}, {ev.city}
                          </span>
                          <span style={{
                            padding: "1px 7px", borderRadius: 999, fontSize: 10, fontWeight: 700,
                            background: `${CATEGORY_COLORS[ev.category] || "#8b5cf6"}20`,
                            color: CATEGORY_COLORS[ev.category] || "#8b5cf6",
                          }}>
                            {ev.category}
                          </span>
                        </div>
                      </div>
                      {ev.ticketLink && (
                        <a
                          href={ev.ticketLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            padding: "5px 12px", borderRadius: 999,
                            border: "1px solid #8b5cf6", color: "#8b5cf6",
                            fontSize: 11, fontWeight: 700, textDecoration: "none", flexShrink: 0,
                          }}
                        >
                          Tickets
                        </a>
                      )}
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const navBtn = {
  width: 36, height: 36, borderRadius: 10,
  border: "1px solid var(--border)", background: "var(--surface)",
  color: "var(--text)", display: "flex", alignItems: "center",
  justifyContent: "center", cursor: "pointer",
};

export default EventCalendar;
