'use client'
import { Filters } from "@/types/filters"

type FilterBarProps = {
    filters: Filters;
    onChange: (nextFilters: Filters) => void;
  };

export default function FilterBar({filters, onChange}: FilterBarProps) {
  const hasActiveFilters =
  filters.hangboard || filters.campusBoard || filters.sprayWall

  function toggleFilter(key: keyof Filters) {
    onChange({
      ...filters,
      [key]: !filters[key],
    })
  }

  function clearFilters() {
    onChange({
      hangboard: false,
      campusBoard: false,
      sprayWall: false,
    })
  }

  const pillBase =
    "rounded-md border px-3 py-1 text-sm transition-colors"
  const pillInactive =
    "border-stone-500 bg-transparent text-stone-700 hover:bg-stone-100"
  const pillActive =
    "border-stone-800 bg-stone-800 text-white"

  
  return (
    <div className="mb-2 flex flex-wrap items-center justify-between border border-stone-500 gap-2 px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-stone-800">Filters</span>

        <button
          type="button"
          onClick={() => toggleFilter("hangboard")}
          className={`${pillBase} ${
            filters.hangboard ? pillActive : pillInactive
          }`}
        >
          Hangboard
        </button>

        <button
          type="button"
          onClick={() => toggleFilter("campusBoard")}
          className={`${pillBase} ${
            filters.campusBoard ? pillActive : pillInactive
          }`}
        >
          Campus Board
        </button>

        <button
          type="button"
          onClick={() => toggleFilter("sprayWall")}
          className={`${pillBase} ${
            filters.sprayWall ? pillActive : pillInactive
          }`}
        >
          Spray Wall
        </button>
      </div>

      <button
        type="button"
        onClick={clearFilters}
        disabled={!hasActiveFilters}
        className="text-sm underline underline-offset-2 disabled:cursor-default disabled:opacity-40"
      >
        Clear
      </button>
    </div>
  )
}