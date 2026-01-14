'use client'
import type { Gym } from "@/types/gymSchema";
import { useState } from "react"
import { SIZE_MAP, COST_MAP, QUALITY_MAP, DEFAULT_SORT_ORDER, BOOLEAN_MAP} from "@/constants/gymConfig";
import { sortGyms, type SortKey, type SortDir } from "@/lib/sortHelpers"; 

export default function GymTable({ gyms }: { gyms: Gym[] }) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir(DEFAULT_SORT_ORDER[key])
    }
  }
  
  const renderArrow = (key: SortKey) => {
    if (sortKey !== key) return ""
    else{
      return sortDir === "asc" ? " ▴" : " ▾"
    }

  }
  const sortedGyms = sortGyms(gyms, sortKey, sortDir)

  return (
    <table className="border-collapse border border-gray-400 w-full text-sm"> 
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2">Name</th>
          <th className="border p-2">Location</th>
          <th className="border p-2">Style</th>
          <th 
            className="border p-2 cursor-pointer select-none"
            onClick={() => handleSort("size")}
          >
            Size{renderArrow("size")}
          </th>
          <th 
            className="border p-2 cursor-pointer select-none"
            onClick={() => handleSort("cost")}
          >
            Cost{renderArrow("cost")}
          </th>
          <th 
            className="border p-2 cursor-pointer select-none"
            onClick={() => handleSort("quality")}
          >
            Quality{renderArrow("quality")}
          </th>
          <th className="border p-2">Hangboard</th>
          <th className="border p-2">Campus Board</th>
          <th className="border p-2">Spray Wall</th>
          <th className="border p-2">Notes</th>
        </tr>
      </thead>
      <tbody>
        {sortedGyms.map((gym, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="border p-2 font-medium">{gym.name}</td>
            <td className="border p-2">{gym.plusCode}</td>
            <td className="border p-2">{gym.style.join(', ')}</td>
            <td className="border p-2">{SIZE_MAP[gym.size]}</td>
            <td className="border p-2">{COST_MAP[gym.cost]}</td>
            <td className="border p-2">{QUALITY_MAP[gym.quality]}</td>
            <td className="border p-2">{BOOLEAN_MAP[gym.hangboard.toString()]}</td>
            <td className="border p-2">{BOOLEAN_MAP[gym.campusBoard.toString()]}</td>
            <td className="border p-2">{BOOLEAN_MAP[gym.sprayWall.toString()]}</td>
            <td className="border p-2">{gym.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}