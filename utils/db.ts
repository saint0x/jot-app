import sqlite3 from "sqlite3"
import { open } from "sqlite"
import path from "path"

const SCHEMA = `
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT 0,
  date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date);
CREATE INDEX IF NOT EXISTS idx_notes_date ON notes(date);
`

let db: any = null

async function openDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), "db", "database.db")
    console.log("Opening database at:", dbPath)
    
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    // Always check if tables exist
    const tableExists = await checkTablesExist()
    console.log("Tables exist:", tableExists)

    if (!tableExists) {
      console.log("Tables don't exist, initializing database...")
      await initializeDatabase()
      console.log("Database initialization complete")
    }
  }
  return db
}

async function checkTablesExist() {
  try {
    // Check if both tables exist by trying to get a row
    await db.get("SELECT 1 FROM notes LIMIT 1")
    await db.get("SELECT 1 FROM tasks LIMIT 1")
    return true
  } catch (error) {
    return false
  }
}

async function initializeDatabase() {
  try {
    console.log("Executing schema...")
    await db.exec(SCHEMA)
    console.log("Schema execution complete")
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}

export async function getTasks(date: string) {
  const db = await openDb()
  return db.all(
    "SELECT * FROM tasks WHERE date = ? ORDER BY created_at DESC", 
    [date]
  )
}

export async function addTask(text: string, date: string) {
  const db = await openDb()
  const result = await db.run(
    `INSERT INTO tasks (text, completed, date, created_at) 
     VALUES (?, ?, ?, datetime('now', 'localtime'))`,
    [text, false, date]
  )
  return result.lastID
}

export async function updateTask(id: number, completed: boolean) {
  const db = await openDb()
  await db.run("UPDATE tasks SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [completed, id])
}

export async function deleteTask(id: number) {
  const db = await openDb()
  await db.run(
    "DELETE FROM tasks WHERE id = ? AND date = date('now', 'localtime')", 
    [id]
  )
}

export async function getNotes(date: string) {
  const db = await openDb()
  return db.all(
    "SELECT * FROM notes WHERE date = ? ORDER BY created_at DESC", 
    [date]
  )
}

export async function addNote(text: string, date: string) {
  const db = await openDb()
  const result = await db.run(
    `INSERT INTO notes (text, date, created_at) 
     VALUES (?, ?, datetime('now', 'localtime'))`,
    [text, date]
  )
  return result.lastID
}

export async function deleteNote(id: number) {
  const db = await openDb()
  await db.run(
    "DELETE FROM notes WHERE id = ? AND date = date('now', 'localtime')", 
    [id]
  )
}

export async function getAllRecords() {
  const db = await openDb()
  const tasks = await db.all("SELECT * FROM tasks ORDER BY date, created_at")
  const notes = await db.all("SELECT * FROM notes ORDER BY date, created_at")
  return { tasks, notes }
}

