"use client";

import { useCallback, useEffect, useState } from "react";

export type LatLng = { lat: number; lng: number };

export type UserLocationStatus =
  | "idle"       // not requested yet
  | "loading"    // requesting browser location
  | "granted"    // browser location available
  | "denied"     // user denied
  | "unavailable"// geolocation not supported
  | "error";     // other error (timeout, etc.)

export type UserLocationResult = {
  origin: LatLng | null;          // always defined (geo or  null)
  source: "none" | "geo";
  status: UserLocationStatus;
  error?: string;
  requestLocation: () => void;    // call to prompt user
};

type Options = {
  autoRequest?: boolean;          // default true
  timeoutMs?: number;             // default 8000
  enableHighAccuracy?: boolean;   // default true
};

export function useUserLocation(options: Options): UserLocationResult {
  const {
    autoRequest = true,
    timeoutMs = 8000,
    enableHighAccuracy = true,
  } = options;

  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [source, setSource] = useState<"none" | "geo">("none");
  const [status, setStatus] = useState<UserLocationStatus>(
    autoRequest ? "loading" : "idle"
  );
  const [error, setError] = useState<string | undefined>(undefined);

  const requestLocation = useCallback(() => {
    setError(undefined);

    if (!("geolocation" in navigator)) {
      setStatus("unavailable");
      setOrigin(null);
      setSource("none") 
      return;
    }

    setStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSource("geo");
        setStatus("granted");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setStatus("denied");
        else setStatus("error");
        setError(err.message);
        setOrigin(null);
        setSource("none");
      },
      { enableHighAccuracy, timeout: timeoutMs }
    );
  }, [enableHighAccuracy, timeoutMs]);

  useEffect(() => {
    if (autoRequest) requestLocation();
  }, [autoRequest, requestLocation]);

  return { origin, source, status, error, requestLocation };
}
