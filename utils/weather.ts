const API_KEY = process.env.NEXT_PUBLIC_WEATHERAPI_KEY

interface WeatherResponse {
  current: {
    temp_f: number
    condition: {
      text: string
      icon: string
    }
  }
  error?: {
    message: string
  }
}

export async function getWeather(): Promise<{ temp: number; error?: string }> {
  try {
    const response = await fetch('/api/weather')
    
    if (!response.ok) {
      throw new Error("Weather API request failed")
    }

    const data = await response.json()
    
    if (data.error) {
      return { temp: 0, error: data.error }
    }

    return { temp: data.temp }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return { temp: 0, error: "Failed to fetch weather data" }
  }
}

