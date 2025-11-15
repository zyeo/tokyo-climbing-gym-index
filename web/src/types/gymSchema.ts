import { z } from "zod"
import { SIZE_VALUES, COST_VALUES, QUALITY_VALUES} from "@/constants/gymConfig"
import { numericEnum } from "@/lib/zodHelpers"

export const GymSchema = z.object({
    name: z.string(),
    prefecture: z.string(),
    ward: z.string(),
    district: z.string(),
    style: z.array(z.string()),
    size: numericEnum(SIZE_VALUES, "Size"),
    cost: numericEnum(COST_VALUES, "Cost"),
    setting_quality: numericEnum(QUALITY_VALUES, "Quality"),
    boards: z.array(z.string()),
    training_tools: z.array(z.string()),
    notes: z.string(),
  })

export const GymListSchema = z.array(GymSchema)

export type Gym = z.infer<typeof GymSchema>
export type GymList = z.infer<typeof GymListSchema>

