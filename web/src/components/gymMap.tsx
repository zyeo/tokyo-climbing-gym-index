"use client"; 

import { useEffect, useMemo, useState, useRef} from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { buildGoogleMapsUrl } from "@/lib/mapLinks";

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

const DEFAULT_CENTER: [number, number] = [35.68, 139.76]
const DEFAULT_ZOOM = 11

export type GymForMap = {
  name: string;
  latitude: number;
  longitude: number;
};

type Props = {
  gyms: GymForMap[];
  center?: [number, number];
  zoom?: number;
  selectedGymName: string | null;
  origin: LatLng | null;
};

type LatLng = { lat: number; lng: number };

function FlyToSelectedGym({
  gyms,
  selectedGymName,
}: {
  gyms: {
    name: string
    latitude: number
    longitude: number
  }[]
  selectedGymName: string | null
}) {
  const map = useMap()

  useEffect(() => {
    if (!selectedGymName) {
      map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, {
        duration: 0.8,
      })

      map.closePopup()
      
      return
    }

    const selectedGym = gyms.find((gym) => gym.name === selectedGymName)
    if (!selectedGym) return

    map.eachLayer((layer: any) => {
      if (
        layer.getLatLng &&
        layer.getPopup &&
        layer.getLatLng().lat === selectedGym.latitude &&
        layer.getLatLng().lng === selectedGym.longitude
      ) {
        layer.openPopup()
      }
    })

    map.flyTo([selectedGym.latitude, selectedGym.longitude], 14, {
      duration: 0.8,
    })
  }, [gyms, selectedGymName, map])

  return null
}

export default function GymMap({
  gyms,
  center = [35.6812, 139.7671], // Tokyo Station-ish
  zoom = 11,
  selectedGymName,
  origin,
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
        
        <FlyToSelectedGym gyms={gyms} selectedGymName={selectedGymName} />
        
        {origin && (
          <Marker position={[origin.lat, origin.lng]} icon={UserIcon}>
            <Popup>
              <strong>You are here</strong>
            </Popup>
          </Marker>
        )}

        {gyms.map((g) => {
          const directionsUrl = buildGoogleMapsUrl({
            destination: { lat: g.latitude, lng: g.longitude },
            origin,
          })

          return (
            <Marker key={g.name} position={[g.latitude, g.longitude]}>
              <Popup>
                <strong>{g.name}</strong>
                <br />
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Directions
                </a>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  );
}

