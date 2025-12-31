'use client'
import { useState } from "react"
import { Filters } from "@/types/filters"
import { filterGyms } from "@/lib/filterHelpers";

type FilterBarProps = {
    filters: Filters;
    onChange: (nextFilters: Filters) => void;
  };

export default function FilterBar({filters, onChange}: FilterBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-4">
      {/* Hangboard */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={filters.hangboard}
          onChange={() =>
            onChange({
              ...filters,
              hangboard: !filters.hangboard,
              
            })
          }
        />
        <span>Hangboard</span>
      </label>
    {/* Campus Board */}
    <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={filters.campusBoard}
          onChange={() =>
            onChange({
              ...filters,
              campusBoard: !filters.campusBoard,
            })
          }
        />
        <span>Campus Board</span>
      </label>
    {/* Spray Wall */}
    <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={filters.sprayWall}
          onChange={() =>
            onChange({
              ...filters,
              sprayWall: !filters.sprayWall,
            })
          }
        />
        <span>Spray Wall</span>
      </label>
    </div>
  )
}