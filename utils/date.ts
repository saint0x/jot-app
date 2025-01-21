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
    .replace(" at", "—")
    .replace(/(\d+)/, "$1,") // Add comma after the day number
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

export function formatDateString(date: Date): string {
  return date.toISOString().split("T")[0]
}

