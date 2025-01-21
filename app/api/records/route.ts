import { NextResponse } from "next/server"
import { getAllRecords } from "@/utils/db"

export async function GET() {
  const records = await getAllRecords()
  return NextResponse.json(records)
}

