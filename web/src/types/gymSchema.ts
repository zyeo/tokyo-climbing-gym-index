import { z } from "zod"
import { SIZE_VALUES, COST_VALUES, QUALITY_VALUES} from "@/constants/gymConfig"
import { numericEnum } from "@/lib/zodHelpers"

export const GymSchema = z.object({
    name: z.string(),
    location: z.string(),
    plusCode: z.string().nullable(),
    style: z.array(z.string()),
    size: numericEnum(SIZE_VALUES, "Size"),
    cost: numericEnum(COST_VALUES, "Cost"),
    quality: numericEnum(QUALITY_VALUES, "Quality"),
    hangboard: z.boolean(),
    campusBoard: z.boolean(), 
    sprayWall: z.boolean(),
    trainingBoards: z.array(z.string()),
    notes: z.string(),
  })

export const GymListSchema = z.array(GymSchema)

export type Gym = z.infer<typeof GymSchema>
export type GymList = z.infer<typeof GymListSchema>

