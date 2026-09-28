import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";


const pinIcon = (emoji, isUser) =>
  L.divIcon({
    className: "fanhub-map-pin",
    html: `<div style="
      width: ${isUser ? 26 : 34}px;
      height: ${isUser ? 26 : 34}px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      background: ${isUser ? "#3b82f6" : "linear-gradient(135deg,#8b5cf6,#6d28d9)"};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.4);
      border: 2px solid #fff;
    "><span style="transform: rotate(45deg); font-size: ${isUser ? 12 : 16}px;">${emoji}</span></div>`,
    iconSize: [isUser ? 26 : 34, isUser ? 26 : 34],
    iconAnchor: [isUser ? 13 : 17, isUser ? 26 : 34],
    popupAnchor: [0, -30],
  });

const FitBounds = ({ points }) => {
  const map = useMap();
  useMemo(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 12);
    } else {
      map.fitBounds(points, { padding: [40, 40], maxZoom: 13 });
    }
    
  }, [JSON.stringify(points)]);
  return null;
};

const EventMap = ({ events = [], userLocation = null, height = 340 }) => {
  const located = events.filter((e) => e.location?.lat != null && e.location?.lng != null);

  const points = [
    ...located.map((e) => [e.location.lat, e.location.lng]),
    ...(userLocation ? [[userLocation.lat, userLocation.lng]] : []),
  ];

  if (points.length === 0) {
    return (
      <div
        className="card"
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
          fontSize: 13.5,
          textAlign: "center",
          padding: 20,
        }}
      >
        No mapped locations available yet for these events.
      </div>
    );
  }

  return (
    <div className="card" style={{ height, padding: 0, overflow: "hidden" }}>
      <MapContainer center={points[0]} zoom={12} style={{ width: "100%", height: "100%" }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={pinIcon("•", true)}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {located.map((e) => (
          <Marker key={e._id} position={[e.location.lat, e.location.lng]} icon={pinIcon("•", false)}>
            <Popup>
              <div style={{ minWidth: 160 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 2 }}>{e.title}</div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>
                  {e.venue}, {e.city}
                  {e.distanceKm != null && ` · ${e.distanceKm.toFixed(1)} km away`}
                </div>
                <Link to={`/events/${e._id}`} style={{ fontSize: 12, fontWeight: 700, color: "#6d28d9" }}>
                  View details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default EventMap;
