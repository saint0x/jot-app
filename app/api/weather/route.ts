import { NextResponse } from "next/server"

const API_KEY = process.env.WEATHERAPI_KEY // Remove NEXT_PUBLIC_ prefix

export async function GET() {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=New York&aqi=no`
    )

    if (!response.ok) {
      throw new Error("Weather API request failed")
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error.message)
    }

    return NextResponse.json({
      temp: Math.round(data.current.temp_f)
    })
  } catch (error) {
    console.error("Error fetching weather:", error)
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    )
  }
} 