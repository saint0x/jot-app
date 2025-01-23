export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  })
    .format(date)
    .replace(",", "")
    .replace(" at", "")  // Remove the "at" without adding dash
    .replace(/(\d+)/, "$1,") // Add comma after the day number
    .replace(/(\d{4})\s+(\d{1,2})/, "$1 — $2") // Add properly spaced dash between date and time
}

export function formatDateWithoutTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function getCurrentDay(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "America/New_York",
  })
    .format(date)
    .toUpperCase()
}

export function getLocalISOString(date: Date = new Date()): string {
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - (offset * 60 * 1000))
  return localDate.toISOString().split('T')[0]
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function formatDateString(date: Date): string {
  return getLocalISOString(date)
}

