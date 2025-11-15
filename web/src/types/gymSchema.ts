import { z } from "zod"

export const GymSchema = z.object({
    name: z.string(),
    prefecture: z.string(),
    ward: z.string(),
    district: z.string(),
    style: z.array(z.string()),
    size: z.number().int().min(1).max(3),
    cost: z.number().int().min(1).max(3),
    setting_quality: z.number().int().min(1).max(5),
    boards: z.array(z.string()),
    training_tools: z.array(z.string()),
    notes: z.string(),
  })

export const GymListSchema = z.array(GymSchema)

export type Gym = z.infer<typeof GymSchema>
export type GymList = z.infer<typeof GymListSchema>

