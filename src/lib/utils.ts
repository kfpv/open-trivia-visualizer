import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function groupBy<T>(
  items: T[],
  keySelector: (item: T) => string
) {
  const counts = items.reduce((acc, item) => {
    const key = keySelector(item)
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(counts).map(([key, count]) => ({ key, count }))
}
