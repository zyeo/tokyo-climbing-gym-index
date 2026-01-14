"use client"; 

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons (common Next.js + Leaflet issue)
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

L.Marker.prototype.options.icon = DefaultIcon;

export type GymForMap = {
  name: string;
  latitude: number;
  longitude: number;
};

type Props = {
  gyms: GymForMap[];
  center?: [number, number];
  zoom?: number;
};

export default function GymMap({
  gyms,
  center = [35.6812, 139.7671], // Tokyo Station-ish
  zoom = 11,
}: Props) {
  return (
    <div className="w-full h-[520px] rounded-2xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {gyms.map((g) => (
          <Marker key={g.name} position={[g.latitude, g.longitude]}>
            <Popup>
              <strong>{g.name}</strong>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

