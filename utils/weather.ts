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
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=New York&aqi=no`)

    if (!response.ok) {
      throw new Error("Weather API request failed")
    }

    const data: WeatherResponse = await response.json()

    if (data.error) {
      throw new Error(data.error.message)
    }

    return {
      temp: Math.round(data.current.temp_f),
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return { temp: 0, error: "Failed to fetch weather data" }
  }
}

