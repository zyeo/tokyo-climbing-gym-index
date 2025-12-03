import type { Gym } from "@/types/gymSchema";
import { SIZE_MAP, COST_MAP, QUALITY_MAP } from "@/constants/gymConfig";

export type SortKey = "size" | "cost" | "setting_quality";
export type SortDir = "asc" | "desc";


export function getSortValue(gym: Gym, key: SortKey): number {
    switch (key) {
      case "size":
        return gym.size;
      case "cost":
        return gym.cost;
      case "setting_quality":
        return gym.setting_quality;
    }
  }
  
  export function sortGyms(
    gyms: Gym[],
    sortKey: SortKey | null,
    sortDir: SortDir
  ): Gym[] {
    if (!sortKey) return gyms;
  
    const dir = sortDir === "asc" ? 1 : -1;
  
    return [...gyms].sort((a, b) => {
      const aVal = getSortValue(a, sortKey);
      const bVal = getSortValue(b, sortKey);
  
      if (aVal === bVal) return 0;
      return aVal < bVal ? -1 * dir : 1 * dir;
    });
  }
  