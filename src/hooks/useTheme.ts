/**
 * Theme hook for dark/light mode
 * Follows system preference with localStorage persistence
 * FIXED: Eliminated setState in effect, used lazy initialization
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import type { Theme } from "@/types"

const STORAGE_KEY = "dev-privacy-toolkit-theme"

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "system"
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored && ["light", "dark", "system"].includes(stored)) {
      return stored
    }
  } catch {
    // localStorage may be disabled
  }
  return "system"
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  const resolvedTheme = theme === "system" ? getSystemTheme() : theme

  // Subscribe to system theme changes
  useEffect(() => {
    if (theme !== "system") return
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      // Force re-render by updating state with same value
      setThemeState((prev) => prev)
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(resolvedTheme)
  }, [resolvedTheme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem(STORAGE_KEY, newTheme)
    } catch {
      // localStorage may be disabled
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev: Theme) => {
      const next = prev === "light" ? "dark" : prev === "dark" ? "system" : "light"
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // localStorage may be disabled
      }
      return next
    })
  }, [])

  return { theme, resolvedTheme, setTheme, toggleTheme }
}
