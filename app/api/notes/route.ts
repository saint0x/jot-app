import { NextResponse } from "next/server"
import { getNotes, addNote, deleteNote } from "@/utils/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }
    const notes = await getNotes(date)
    return NextResponse.json(notes)
  } catch (error) {
    console.error("Error in GET /api/notes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { text, date } = await request.json()
    if (!text || !date) {
      return NextResponse.json({ error: "Text and date are required" }, { status: 400 })
    }
    const id = await addNote(text, date)
    return NextResponse.json({ id, text, date })
  } catch (error) {
    console.error("Error in POST /api/notes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Id is required" }, { status: 400 })
    }
    await deleteNote(Number.parseInt(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/notes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

