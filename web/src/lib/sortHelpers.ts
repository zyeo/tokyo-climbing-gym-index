import type { GymDerived } from "@/types/gymDerived";
import { SIZE_MAP, COST_MAP, QUALITY_MAP } from "@/constants/gymConfig";

export type SortKey = "size" | "cost" | "quality" | "distance";
export type SortDir = "asc" | "desc";


export function getSortValue(gym: GymDerived, key: SortKey): number {
  switch (key) {
    case "size":
      return gym.size;
    case "cost":
      return gym.cost;
    case "quality":
      return gym.quality;
    case "distance":
      return gym.distanceKm ?? Infinity;
  }
}
  
export function sortGyms(
  gyms: GymDerived[],
  sortKey: SortKey | null,
  sortDir: SortDir
): GymDerived[] {
  if (!sortKey) return gyms;

  const dir = sortDir === "asc" ? 1 : -1;

  return [...gyms].sort((a, b) => {
    const aVal = getSortValue(a, sortKey);
    const bVal = getSortValue(b, sortKey);

    if (aVal === bVal) return 0;
    return aVal < bVal ? -1 * dir : 1 * dir;
  });
}
  