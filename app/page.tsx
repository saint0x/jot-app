"use client"

import { useState, useCallback, useEffect } from "react"
import type { Days, Task, Note } from "../types/todo"
import { DaySection } from "../components/day-section"
import { FloatingButton } from "../components/floating-button"
import { DaysDrawer } from "../components/days-drawer"
import { getCurrentDay, formatDateString } from "../utils/date"

const DAYS: Days[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

export default function TodoApp() {
  const [tasks, setTasks] = useState<Record<string, Task[]>>({})
  const [notes, setNotes] = useState<Record<string, Note[]>>({})
  const [activeDay, setActiveDay] = useState<Days>(getCurrentDay() as Days)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const fetchTasks = useCallback(async (date: string) => {
    try {
      const response = await fetch(`/api/tasks?date=${date}`)
      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }
      const text = await response.text()
      const data = JSON.parse(text)
      setTasks((prev) => ({ ...prev, [date]: data }))
    } catch (error) {
      console.error("Error fetching tasks:", error)
    }
  }, [])

  const fetchNotes = useCallback(async (date: string) => {
    try {
      const response = await fetch(`/api/notes?date=${date}`)
      if (!response.ok) {
        throw new Error("Failed to fetch notes")
      }
      const text = await response.text()
      const data = JSON.parse(text)
      setNotes((prev) => ({ ...prev, [date]: data }))
    } catch (error) {
      console.error("Error fetching notes:", error)
    }
  }, [])

  useEffect(() => {
    const dateString = formatDateString(selectedDate)
    fetchTasks(dateString)
    fetchNotes(dateString)
  }, [selectedDate, fetchTasks, fetchNotes])

  const handleToggleTask = useCallback(
    async (taskId: string) => {
      const dateString = formatDateString(selectedDate)
      const task = tasks[dateString]?.find((t) => t.id.toString() === taskId)
      if (task) {
        try {
          const response = await fetch("/api/tasks", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: taskId, completed: !task.completed }),
          })
          if (!response.ok) {
            throw new Error("Failed to update task")
          }
          const text = await response.text()
          const data = JSON.parse(text)
          if (data.success) {
            setTasks((prev) => ({
              ...prev,
              [dateString]: prev[dateString].map((t) =>
                t.id.toString() === taskId ? { ...t, completed: !t.completed } : t,
              ),
            }))
          }
        } catch (error) {
          console.error("Error updating task:", error)
        }
      }
    },
    [selectedDate, tasks],
  )

  const handleAddTask = useCallback(
    async (text: string) => {
      const dateString = formatDateString(selectedDate)
      try {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, date: dateString }),
        })
        if (!response.ok) {
          throw new Error("Failed to add task")
        }
        const responseText = await response.text()
        const newTask = JSON.parse(responseText)
        setTasks((prev) => ({
          ...prev,
          [dateString]: [...(prev[dateString] || []), newTask],
        }))
      } catch (error) {
        console.error("Error adding task:", error)
      }
    },
    [selectedDate],
  )

  const handleAddNote = useCallback(
    async (text: string) => {
      const dateString = formatDateString(selectedDate)
      try {
        const response = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, date: dateString }),
        })
        if (!response.ok) {
          throw new Error("Failed to add note")
        }
        const responseText = await response.text()
        const newNote = JSON.parse(responseText)
        setNotes((prev) => ({
          ...prev,
          [dateString]: [...(prev[dateString] || []), newNote],
        }))
      } catch (error) {
        console.error("Error adding note:", error)
      }
    },
    [selectedDate],
  )

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      const dateString = formatDateString(selectedDate)
      try {
        const response = await fetch(`/api/tasks?id=${taskId}`, { method: "DELETE" })
        if (!response.ok) {
          throw new Error("Failed to delete task")
        }
        const text = await response.text()
        const data = JSON.parse(text)
        if (data.success) {
          setTasks((prev) => ({
            ...prev,
            [dateString]: prev[dateString].filter((task) => task.id.toString() !== taskId),
          }))
        }
      } catch (error) {
        console.error("Error deleting task:", error)
      }
    },
    [selectedDate],
  )

  const handleDeleteNote = useCallback(
    async (noteId: string) => {
      const dateString = formatDateString(selectedDate)
      try {
        const response = await fetch(`/api/notes?id=${noteId}`, { method: "DELETE" })
        if (!response.ok) {
          throw new Error("Failed to delete note")
        }
        const text = await response.text()
        const data = JSON.parse(text)
        if (data.success) {
          setNotes((prev) => ({
            ...prev,
            [dateString]: prev[dateString].filter((note) => note.id.toString() !== noteId),
          }))
        }
      } catch (error) {
        console.error("Error deleting note:", error)
      }
    },
    [selectedDate],
  )

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev)
  }, [])

  const handleSelectDay = useCallback((day: Days) => {
    setActiveDay(day)
    setIsDrawerOpen(false)
  }, [])

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date)
    setActiveDay(getCurrentDay(date) as Days)
  }, [])

  const dateString = formatDateString(selectedDate)

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="max-w-md mx-auto bg-white h-screen relative overflow-hidden">
        <DaySection
          day={activeDay}
          tasks={tasks[dateString] || []}
          notes={notes[dateString] || []}
          onToggleTask={handleToggleTask}
          onAddTask={handleAddTask}
          onAddNote={handleAddNote}
          onDeleteTask={handleDeleteTask}
          onDeleteNote={handleDeleteNote}
          onSelectDate={handleSelectDate}
          selectedDate={selectedDate}
        />
      </div>

      <FloatingButton onClick={toggleDrawer} isOpen={isDrawerOpen} />

      <DaysDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeDay={activeDay}
        onSelectDay={handleSelectDay}
        days={DAYS}
      />
    </div>
  )
}

