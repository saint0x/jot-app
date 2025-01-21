"use client"

import { ChevronUp, ChevronDown } from "lucide-react"

interface FloatingButtonProps {
  onClick: () => void
  isOpen: boolean
}

export function FloatingButton({ onClick, isOpen }: FloatingButtonProps) {
  return (
    <button
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-50 hover:shadow-xl transition-shadow"
      onClick={onClick}
    >
      {isOpen ? <ChevronDown className="w-6 h-6 text-gray-600" /> : <ChevronUp className="w-6 h-6 text-gray-600" />}
    </button>
  )
}

