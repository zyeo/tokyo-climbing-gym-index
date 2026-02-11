import type { GymDerived } from "@/types/gymDerived";
import { Filters } from "@/types/filters"; 

export function filterGyms(gyms: GymDerived[], filters: Filters): GymDerived[] {
    return gyms.filter((gym) => {
        if (filters.hangboard && !gym.hangboard) return false
        if (filters.campusBoard && !gym.campusBoard) return false
        if (filters.sprayWall && !gym.sprayWall) return false
        return true
    })
}