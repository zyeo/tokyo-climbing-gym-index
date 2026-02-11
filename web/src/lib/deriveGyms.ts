import type { Gym } from "@/types/gymSchema";
import type { GymDerived } from "@/types/gymDerived";
import { haversineKm } from "@/lib/geo";

export type LatLng = { lat: number; lng: number };

export function deriveGyms(
  gyms: Gym[],
  origin: LatLng | null
): GymDerived[] {
  return gyms.map((gym) => {
    // No origin yet
    if (!origin) {
      return { ...gym, distanceKm: null };
    }

    // Gym has no coordinates
    if (gym.latitude == null || gym.longitude == null) {
      return { ...gym, distanceKm: null };
    }

    const distanceKm = haversineKm(
      origin.lat,
      origin.lng,
      gym.latitude,
      gym.longitude
    );

    return { ...gym, distanceKm };
  });
}
