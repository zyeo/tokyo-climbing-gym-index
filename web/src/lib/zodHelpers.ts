import { z } from "zod"

export const numericEnum = <T extends readonly number[]>(values: T, label="") =>
    z.number().int().refine((v) => values.includes(v), {
      message: `Invalid value for ${label}; expected one of: ${values.join(", ")}`,
    })
