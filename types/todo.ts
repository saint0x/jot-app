export interface Task {
  id: number
  text: string
  completed: boolean
  date: string
  created_at: string
  updated_at: string
}

export interface Note {
  id: number
  text: string
  date: string
  created_at: string
  updated_at: string
}

export type Days = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"

