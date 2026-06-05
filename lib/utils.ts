import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** @deprecated Prefer `Card variant="artifact"` or `Card variant="elevated"`. */
export function artifactSurface(...inputs: ClassValue[]) {
  return cn(
    "rounded-sm border border-white/10 bg-artifact shadow-artifact-inset",
    ...inputs
  )
}
