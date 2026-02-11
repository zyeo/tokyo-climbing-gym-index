export const SIZE_VALUES = [1, 2, 3, 4, 5] as const
export const COST_VALUES = [1, 2, 3] as const
export const QUALITY_VALUES = [1, 2, 3, 4, 5] as const

export const SIZE_MAP: Record<number, string>= {
    1: "very small",
    2: "small",
    3: "medium",
    4: "big",
    5: "very big",
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
  
  export const DEFAULT_SORT_ORDER = {
    size: "desc",
    cost: "asc",
    quality: "desc",
    distance: "asc",
  } as const

  export const BOOLEAN_MAP: Record<string, string> = {
    "true": "Yes",
    "false": "No",
  } as const

