'use client'
import gyms from '@/data/gyms.json' assert { type: "json" }
import type { GymList } from "@/constants/gymConfig";
import { SIZE_MAP, COST_MAP, QUALITY_MAP } from "@/constants/gymConfig";

const gymData: GymList = gyms;

export default function GymTable() {
  return (
    <table className="border-collapse border border-gray-400 w-full text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2">Name</th>
          <th className="border p-2">Location</th>
          <th className="border p-2">Style</th>
          <th className="border p-2">Size</th>
          <th className="border p-2">Cost</th>
          <th className="border p-2">Quality</th>
          <th className="border p-2">Notes</th>
        </tr>
      </thead>
      <tbody>
        {gymData.map((gym, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="border p-2 font-medium">{gym.name}</td>
            <td className="border p-2">{gym.prefecture}, {gym.ward}, {gym.district}</td>
            <td className="border p-2">{gym.style.join(', ')}</td>
            <td className="border p-2">{SIZE_MAP[gym.size]}</td>
            <td className="border p-2">{COST_MAP[gym.cost]}</td>
            <td className="border p-2">{QUALITY_MAP[gym.setting_quality]}</td>
            <td className="border p-2">{gym.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}