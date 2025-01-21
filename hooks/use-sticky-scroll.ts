import { useState, useEffect, useCallback, useRef } from "react"
import type { Days } from "../types/todo"

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function useStickyScroll(activeDay: Days, days: Days[]) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  const updateScrollPosition = useCallback((position: number) => {
    setScrollPosition(position)
    localStorage.setItem("daysDrawerScrollPosition", position.toString())
  }, [])

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      updateScrollPosition(scrollRef.current.scrollTop)
    }
  }, [updateScrollPosition])

  useEffect(() => {
    const savedPosition = localStorage.getItem("daysDrawerScrollPosition")
    if (savedPosition) {
      setScrollPosition(Number.parseInt(savedPosition, 10))
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      const targetScrollTop = scrollPosition
      const startScrollTop = scrollRef.current.scrollTop
      const startTime = performance.now()
      const duration = 300 // Animation duration in milliseconds

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeProgress = easeInOutCubic(progress)

        if (scrollRef.current) {
          scrollRef.current.scrollTop = startScrollTop + (targetScrollTop - startScrollTop) * easeProgress
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateScroll)
        }
      }

      animationRef.current = requestAnimationFrame(animateScroll)

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [scrollPosition])

  const getBottomPadding = useCallback(() => {
    const activeIndex = days.indexOf(activeDay)
    const remainingDays = days.length - activeIndex - 1
    return `${remainingDays * 64}px` // 64px is the height of each day button
  }, [activeDay, days])

  return { scrollRef, handleScroll, scrollPosition, getBottomPadding }
}

