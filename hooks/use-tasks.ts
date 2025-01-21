"use client"

import { useState } from "react"
import type { Task, Days } from "../types/todo"

const initialTasks: Record<Days, Task[]> = {
  MONDAY: [
    { id: "1", text: "5km run", completed: true },
    { id: "2", text: "Read 10 pages", completed: false },
    { id: "3", text: "Walk the dog", completed: false },
    { id: "4", text: "Get groceries", completed: false },
    { id: "5", text: "Design a to-do app (?)", completed: false },
  ],
  TUESDAY: [],
  WEDNESDAY: [],
  THURSDAY: [],
  FRIDAY: [],
}

export function useTasks() {
  const [tasks, setTasks] = useState(initialTasks)
  const [activeDay, setActiveDay] = useState<Days>("MONDAY")

  const toggleTask = (day: Days, taskId: string) => {
    setTasks((prev) => ({
      ...prev,
      [day]: prev[day].map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    }))
  }

  return {
    tasks,
    activeDay,
    setActiveDay,
    toggleTask,
  }
}

