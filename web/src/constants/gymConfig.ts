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
  
//Types
export type GymSize = number 
export type GymCost = number
export type GymQuality = number

export interface Gym {
    name: string;
    prefecture: string;
    ward: string;
    district: string;
    style: string[];
    size: GymSize;           // 1 | 2 | 3
    cost: GymCost;           // 1 | 2 | 3
    setting_quality: GymQuality; // 1–5
    boards: string[];
    training_tools: string[];
    notes: string;
  }

export type GymList = Gym[]