import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url: string) {
  console.log(`http://127.0.0.1:8000/${url}`)
  return `http://127.0.0.1:8000/${url}`
}