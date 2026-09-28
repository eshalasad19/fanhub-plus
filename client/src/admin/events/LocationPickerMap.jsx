import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const markerIcon = L.divIcon({
  className: "fanhub-map-pin",
  html: `<div style="
    width: 30px; height: 30px; border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    background: linear-gradient(135deg,#8b5cf6,#6d28d9);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4); border: 2px solid #fff;
  "><span style="transform: rotate(45deg); width: 12px; height: 12px; background: white; border-radius: 50%; display: inline-block;"></span></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const ClickHandler = ({ onPick }) => {
  useMapEvents({
    click(e) {
      onPick({ lat: Number(e.latlng.lat.toFixed(6)), lng: Number(e.latlng.lng.toFixed(6)) });
    },
  });
  return null;
};

const LocationPickerMap = ({ lat, lng, onPick }) => {
  const center = lat != null && lng != null ? [lat, lng] : [24.8607, 67.0011];

  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)" }}>
      <MapContainer center={center} zoom={lat != null ? 12 : 4} style={{ width: "100%", height: 220 }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={onPick} />
        {lat != null && lng != null && <Marker position={[lat, lng]} icon={markerIcon} />}
      </MapContainer>
    </div>
  );
};

export default LocationPickerMap;
