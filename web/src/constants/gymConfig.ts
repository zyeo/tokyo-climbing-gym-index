export const SIZE_VALUES = [1, 2, 3] as const
export const COST_VALUES = [1, 2, 3] as const
export const QUALITY_VALUES = [1, 2, 3, 4, 5] as const

export const SIZE_MAP: Record<number, string>= {
    1: "small",
    2: "medium",
    3: "big",
  } as const
  
  export const COST_MAP: Record<number, string> = {
    1: "$",
    2: "$$",
    3: "$$$",
  } as const
  
  export const QUALITY_MAP: Record<number, string> = {
    1: "*",
    2: "**",
    3: "***",
    4: "****",
    5: "*****",
  } as const
  