'use client'

import { useState } from 'react'

import GymTable from '@/components/gymTable'
import FilterBar from '@/components/filterBar'
import dynamic from "next/dynamic";

import rawGyms from "@/data/gym_list.json";
import { GymListSchema } from "@/types/gymSchema";
import { Filters } from '@/types/filters'


import { filterGyms } from "@/lib/filterHelpers";

const GymMap = dynamic(() => import('@/components/gymMap'), { ssr: false });

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    hangboard: false,
    campusBoard: false,
    sprayWall: false,
  })

  const gyms = GymListSchema.parse(rawGyms);
  const filteredGyms = filterGyms(gyms, filters);

  const filteredGymsForMap = filteredGyms
  .filter((gym) => gym.latitude !== null && gym.longitude !== null)
  .map((gym) => ({
    name: gym.name,
    latitude: gym.latitude!,
    longitude: gym.longitude!,
  }));

  return (
    <main className="p-6 font-mono">
      <h1 className="text-2xl font-bold border-b pb-2 mb-4">
        Tokyo Climbing Gym Index
      </h1>
      <p>A minimalist database for climbers training hard in Tokyo.</p>
      {/* TODO: add a filter component */}
      <FilterBar filters={filters} onChange={setFilters} />
      <GymTable gyms={filteredGyms} />
      <GymMap  gyms={filteredGymsForMap} />
    </main>
  );
}
