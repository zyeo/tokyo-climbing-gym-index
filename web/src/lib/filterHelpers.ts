import type { Gym } from "@/types/gymSchema"
import { Filters } from "@/types/filters"; 

export function filterGyms(gyms: Gym[], filters: Filters): Gym[] {
    return gyms.filter((gym) => {
        if (filters.hangboard && !gym.hangboard) return false
        if (filters.campusBoard && !gym.campusBoard) return false
        if (filters.sprayWall && !gym.sprayWall) return false
        return true
    })
}