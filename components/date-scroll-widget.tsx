"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDateWithoutTime } from "../utils/date"

interface DateScrollWidgetProps {
  isOpen: boolean
  onSelectDate: (date: Date) => void
  selectedDate: Date
}

export function DateScrollWidget({ isOpen, onSelectDate, selectedDate }: DateScrollWidgetProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate)
  const scrollRef = useRef<HTMLDivElement>(null)
  const startY = useRef<number | null>(null)
  const currentY = useRef<number | null>(null)

  useEffect(() => {
    setCurrentDate(selectedDate)
  }, [selectedDate])

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
    currentY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null) return
    currentY.current = e.touches[0].clientY
    const diff = startY.current - currentY.current
    if (Math.abs(diff) > 20) {
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() + Math.sign(diff))
      setCurrentDate(newDate)
      onSelectDate(newDate)
      startY.current = currentY.current
    }
  }

  const handleTouchEnd = () => {
    startY.current = null
    currentY.current = null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div
            ref={scrollRef}
            className="py-4 text-sm text-zinc-600"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="mb-2 opacity-50">{formatDateWithoutTime(new Date(currentDate.getTime() - 86400000))}</div>
            <div className="font-medium">{formatDateWithoutTime(currentDate)}</div>
            <div className="mt-2 opacity-50">{formatDateWithoutTime(new Date(currentDate.getTime() + 86400000))}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
