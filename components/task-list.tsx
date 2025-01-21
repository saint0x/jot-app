"use client"

import type { Task } from "../types/todo"

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string) => void
}

export function TaskList({ tasks, onToggle }: TaskListProps) {
  return (
    <div className="space-y-4 px-6">
      {tasks.map((task) => (
        <label key={task.id} className="flex items-start gap-3 group cursor-pointer">
          <div
            className={`
              mt-0.5 w-5 h-5 rounded border flex items-center justify-center
              transition-colors duration-200 ease-in-out
              ${task.completed ? "bg-orange-500 border-orange-500" : "border-zinc-300"}
            `}
            onClick={() => onToggle(task.id)}
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
              text-[15px] leading-6 transition-all duration-200
              ${task.completed ? "text-zinc-400 line-through" : "text-zinc-800"}
            `}
          >
            {task.text}
          </span>
        </label>
      ))}
    </div>
  )
}

