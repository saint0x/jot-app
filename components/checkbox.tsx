"use client"

import { Check } from "lucide-react"

interface CheckboxProps {
  checked: boolean
  onChange: () => void
  label: string
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 group cursor-pointer">
      <div
        className={`
          w-5 h-5 rounded border border-zinc-400 flex items-center justify-center
          transition-colors duration-200
          ${checked ? "bg-orange-500 border-orange-500" : "bg-transparent"}
        `}
        onClick={onChange}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
      <span
        className={`
        text-[15px] transition-colors duration-200
        ${checked ? "text-zinc-400 line-through" : "text-zinc-800"}
      `}
      >
        {label}
      </span>
    </label>
  )
}

