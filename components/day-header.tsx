"use client"

import type { Days } from "../types/todo"
import { formatDate, getTemperature } from "../utils/date"

interface DayHeaderProps {
  day: Days
  isActive: boolean
}

export function DayHeader({ day, isActive }: DayHeaderProps) {
  return (
    <div className="px-6 py-4">
      <h2 className="text-[32px] font-bold text-zinc-800 tracking-tight">{day}</h2>
      {isActive && (
        <p className="text-sm text-zinc-500 mt-1">
          {formatDate(new Date())} — {getTemperature()}
        </p>
      )}
    </div>
  )
}

