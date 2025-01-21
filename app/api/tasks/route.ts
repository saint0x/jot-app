import { NextResponse } from "next/server"
import { getTasks, addTask, updateTask, deleteTask } from "@/utils/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }
    const tasks = await getTasks(date)
    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error in GET /api/tasks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { text, date } = await request.json()
    if (!text || !date) {
      return NextResponse.json({ error: "Text and date are required" }, { status: 400 })
    }
    const id = await addTask(text, date)
    return NextResponse.json({ id, text, completed: false, date })
  } catch (error) {
    console.error("Error in POST /api/tasks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, completed } = await request.json()
    if (id === undefined || completed === undefined) {
      return NextResponse.json({ error: "Id and completed status are required" }, { status: 400 })
    }
    await updateTask(id, completed)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in PUT /api/tasks:", error)
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
    await deleteTask(Number.parseInt(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/tasks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

