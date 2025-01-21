import sqlite3 from "sqlite3"
import { open } from "sqlite"
import fs from "fs/promises"
import path from "path"

let db: any = null

async function openDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), "db", "database.db")
    console.log("Opening database at:", dbPath)
    
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    // Check if the database is newly created
    const isNewDb = await isNewDatabase()
    console.log("Is new database:", isNewDb)

    if (isNewDb) {
      console.log("Initializing new database...")
      await initializeDatabase()
      console.log("Database initialization complete")
    }
  }
  return db
}

async function isNewDatabase() {
  try {
    const dbPath = path.join(process.cwd(), "db", "database.db")
    const stats = await fs.stat(dbPath)
    console.log("Database file size:", stats.size)
    // Consider it new if the file is empty
    return stats.size === 0
  } catch (error) {
    console.log("Database file does not exist, creating new one")
    return true
  }
}

async function initializeDatabase() {
  try {
    const schemaPath = path.join(process.cwd(), "db", "schema.sql")
    console.log("Reading schema from:", schemaPath)
    const schema = await fs.readFile(schemaPath, "utf-8")
    console.log("Schema contents:", schema)
    await db.exec(schema)
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}

export async function getTasks(date: string) {
  const db = await openDb()
  return db.all("SELECT * FROM tasks WHERE date = ? ORDER BY created_at", [date])
}

export async function addTask(text: string, date: string) {
  const db = await openDb()
  const result = await db.run("INSERT INTO tasks (text, completed, date) VALUES (?, ?, ?)", [text, false, date])
  return result.lastID
}

export async function updateTask(id: number, completed: boolean) {
  const db = await openDb()
  await db.run("UPDATE tasks SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [completed, id])
}

export async function deleteTask(id: number) {
  const db = await openDb()
  await db.run("DELETE FROM tasks WHERE id = ?", [id])
}

export async function getNotes(date: string) {
  const db = await openDb()
  return db.all("SELECT * FROM notes WHERE date = ? ORDER BY created_at", [date])
}

export async function addNote(text: string, date: string) {
  const db = await openDb()
  const result = await db.run("INSERT INTO notes (text, date) VALUES (?, ?)", [text, date])
  return result.lastID
}

export async function deleteNote(id: number) {
  const db = await openDb()
  await db.run("DELETE FROM notes WHERE id = ?", [id])
}

export async function getAllRecords() {
  const db = await openDb()
  const tasks = await db.all("SELECT * FROM tasks ORDER BY date, created_at")
  const notes = await db.all("SELECT * FROM notes ORDER BY date, created_at")
  return { tasks, notes }
}

