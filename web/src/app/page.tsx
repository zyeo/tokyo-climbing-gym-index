'use client'
import { useState } from 'react'
import GymTable from '@/components/gymTable'
import FilterBar from '@/components/filterBar'
import {Filters } from '@/types/filters'

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    hangboard: false,
    campusBoard: false,
    sprayWall: false,
  })

  return (
    <main className="p-6 font-mono">
      <h1 className="text-2xl font-bold border-b pb-2 mb-4">
        Tokyo Climbing Gym Index
      </h1>
      <p>A minimalist database for climbers training hard in Tokyo.</p>
      {/* TODO: add a filter component */}
      <FilterBar filters={filters} onChange={setFilters} />
      <GymTable filters={filters} />
    </main>
  );
}
