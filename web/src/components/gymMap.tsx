"use client"; 

import { useEffect, useMemo, useState } from "react";
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

const UserIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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

type LatLng = { lat: number; lng: number };

export default function GymMap({
  gyms,
  center = [35.6812, 139.7671], // Tokyo Station-ish
  zoom = 11,
}: Props) {
  const [userLoc, setUserLoc] = useState<LatLng | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLoc({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        // denied/unavailable is fine; just don't show user marker
        console.warn("Geolocation error:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000, // allow cached position up to 5s old
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

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
        
        {userLoc && (
          <Marker position={[userLoc.lat, userLoc.lng]} icon={UserIcon}>
            <Popup>
              <strong>You are here</strong>
            </Popup>
          </Marker>
        )}

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

