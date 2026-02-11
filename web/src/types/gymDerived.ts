import type { Gym } from "@/types/gymSchema";

export type GymDerived = Gym & {
    distanceKm: number | null; 

}
