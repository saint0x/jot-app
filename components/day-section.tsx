"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, FileText, X, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { MinimalButton } from "./minimal-button"
import { DateScrollWidget } from "./date-scroll-widget"
import { formatDate, getCurrentDay } from "../utils/date"
import { getWeather } from "../utils/weather"
import type { Task, Days, Note } from "../types/todo"

interface DaySectionProps {
  day: Days
  tasks: Task[]
  notes: Note[]
  onToggleTask: (taskId: string) => void
  onAddTask: (text: string) => void
  onAddNote: (text: string) => void
  onDeleteTask: (taskId: string) => void
  onDeleteNote: (index: number) => void
  onSelectDate: (date: Date) => void
  selectedDate: Date
}

export function DaySection({
  day,
  tasks,
  notes,
  onToggleTask,
  onAddTask,
  onAddNote,
  onDeleteTask,
  onDeleteNote,
  onSelectDate,
  selectedDate,
}: DaySectionProps) {
  const [weather, setWeather] = useState<{ temp: number; error?: string }>({ temp: 0 })
  const [loading, setLoading] = useState(true)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [newTaskText, setNewTaskText] = useState("")
  const [newNoteText, setNewNoteText] = useState("")
  const [isDateWidgetOpen, setIsDateWidgetOpen] = useState(false)

  useEffect(() => {
    async function fetchWeather() {
      const weatherData = await getWeather()
      setWeather(weatherData)
      setLoading(false)
    }

    fetchWeather()
    const weatherTimer = setInterval(fetchWeather, 300000)
    return () => clearInterval(weatherTimer)
  }, [])

  const handleAddTask = useCallback(() => {
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim())
      setNewTaskText("")
    }
    setIsAddingTask(false)
  }, [newTaskText, onAddTask])

  const handleAddNote = useCallback(() => {
    if (newNoteText.trim()) {
      onAddNote(newNoteText.trim())
      setNewNoteText("")
    }
    setIsAddingNote(false)
  }, [newNoteText, onAddNote])

  const toggleDateWidget = useCallback(() => {
    setIsDateWidgetOpen((prev) => !prev)
  }, [])

  const formattedDate = formatDate(selectedDate)

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-[32px] font-bold text-zinc-800 mb-1">{day}</h1>
      <motion.div layout transition={{ duration: 0.2, ease: "easeInOut" }} className="mb-6">
        <button
          onClick={toggleDateWidget}
          className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors flex items-center gap-1"
        >
          {loading ? "Loading weather data..." : weather.error ? formattedDate : `${formattedDate} — ${weather.temp}°`}
          {isDateWidgetOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <DateScrollWidget isOpen={isDateWidgetOpen} onSelectDate={onSelectDate} selectedDate={selectedDate} />
      </motion.div>
      <motion.div layout transition={{ duration: 0.2, ease: "easeInOut" }}>
        <div className="flex gap-4 mb-6">
          <MinimalButton onClick={() => setIsAddingTask(true)}>
            <Plus size={16} />
            New To-Do
          </MinimalButton>
          <MinimalButton onClick={() => setIsAddingNote(true)}>
            <FileText size={16} />
            New Note
          </MinimalButton>
        </div>
        <div className="space-y-4 mb-6">
          <AnimatePresence>
            {isAddingTask && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 overflow-hidden"
              >
                <div className="w-5 h-5 rounded border border-zinc-300" />
                <input
                  type="text"
                  className="flex-grow text-[15px] leading-6 text-zinc-800 bg-transparent focus:outline-none"
                  placeholder="New task"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                  autoFocus
                />
                <button onClick={() => setIsAddingTask(false)} className="text-zinc-400 hover:text-zinc-600">
                  <X size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {tasks.map((task) => (
            <motion.div key={task.id} layout className="flex items-start gap-3 group">
              <div
                className={`
                  mt-0.5 w-5 h-5 rounded border flex items-center justify-center
                  transition-colors duration-200 ease-in-out
                  ${task.completed ? "bg-orange-500 border-orange-500" : "border-zinc-300"}
                `}
                onClick={() => onToggleTask(task.id)}
              >
                {task.completed && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`
                  flex-grow text-[15px] leading-6 transition-all duration-200
                  ${task.completed ? "text-zinc-400 line-through" : "text-zinc-800"}
                `}
              >
                {task.text}
              </span>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-zinc-400 hover:text-zinc-600"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
          <AnimatePresence>
            {isAddingNote && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 overflow-hidden"
              >
                <div className="w-5 h-5 rounded border border-zinc-300 flex items-center justify-center">
                  <FileText size={12} className="text-zinc-400" />
                </div>
                <input
                  type="text"
                  className="flex-grow text-[15px] leading-6 text-zinc-600 bg-transparent focus:outline-none"
                  placeholder="New note"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  autoFocus
                />
                <button onClick={() => setIsAddingNote(false)} className="text-zinc-400 hover:text-zinc-600">
                  <X size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {notes.map((note, index) => (
            <motion.div key={index} layout className="flex items-start gap-3 group">
              <div className="mt-0.5 w-5 h-5 rounded border border-zinc-300 flex items-center justify-center">
                <FileText size={12} className="text-zinc-400" />
              </div>
              <span className="flex-grow text-[15px] leading-6 text-zinc-600">{note.text}</span>
              <button
                onClick={() => onDeleteNote(index)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-zinc-400 hover:text-zinc-600"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

