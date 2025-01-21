"use client"

import { useState, useEffect, useRef } from "react"
import type { Days } from "../types/todo"
import { motion, AnimatePresence, useAnimation, useMotionValue } from "framer-motion"
import { useStickyScroll } from "../hooks/use-sticky-scroll"

interface DaysDrawerProps {
  isOpen: boolean
  onClose: () => void
  activeDay: Days
  onSelectDay: (day: Days) => void
  days: Days[]
}

export function DaysDrawer({ isOpen, onClose, activeDay, onSelectDay, days }: DaysDrawerProps) {
  const { scrollRef, handleScroll, scrollPosition, getBottomPadding } = useStickyScroll(activeDay, days)
  const controls = useAnimation()
  const y = useMotionValue(0)
  const [isDragging, setIsDragging] = useState(false)
  const velocityRef = useRef(0)

  useEffect(() => {
    if (isOpen) {
      controls.start({ y: "25%" })
    }
  }, [isOpen, controls])

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition
    }
  }, [isOpen, scrollPosition])

  useEffect(() => {
    const unsubscribe = y.onChange(() => {
      velocityRef.current = y.getVelocity()
    })
    return () => unsubscribe()
  }, [y])

  const handleDragStart = () => setIsDragging(true)

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false)
    const threshold = 100
    const velocity = Math.abs(info.velocity.y)
    const shouldClose = (info.offset.y > threshold && info.velocity.y >= 0) || (velocity > 500 && info.velocity.y > 0)

    if (shouldClose) {
      controls.start({ y: "100%" }).then(() => onClose())
    } else {
      controls.start({ y: "25%" })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={controls}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{ y }}
          className="fixed inset-x-0 bottom-0 h-3/4 bg-white rounded-t-[32px] shadow-lg flex flex-col z-50"
        >
          <div className="flex-shrink-0 pt-4 pb-2 px-4">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />
          </div>
          <motion.div
            ref={scrollRef}
            className="flex-grow overflow-y-auto scrollbar-hide"
            onScroll={handleScroll}
            style={{
              scrollBehavior: "smooth",
              willChange: "scroll-position",
              overscrollBehavior: "contain",
            }}
          >
            <div className="h-full max-w-md mx-auto" style={{ paddingBottom: getBottomPadding() }}>
              {days.map((day, index) => (
                <motion.button
                  key={day}
                  className={`
                    w-full text-left px-6 py-4 transition-colors duration-300 ease-in-out
                    ${day === activeDay ? "bg-gray-100" : ""}
                  `}
                  style={{
                    backgroundColor: `rgb(${255 - index * 8}, ${255 - index * 8}, ${255 - index * 8})`,
                    transform: "translateZ(0)",
                    willChange: "transform",
                  }}
                  onClick={() => {
                    onSelectDay(day)
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-[32px] font-bold text-zinc-800">{day}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

