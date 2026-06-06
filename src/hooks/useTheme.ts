/**
 * Theme hook for dark/light mode
 * Follows system preference with localStorage persistence
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import type { Theme } from "@/types"

const STORAGE_KEY = "dev-privacy-toolkit-theme"

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  // Initialize theme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored && ["light", "dark", "system"].includes(stored)) {
      setThemeState(stored)
    }
  }, [])

  // Resolve system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    const updateResolved = () => {
      if (theme === "system") {
        setResolvedTheme(mediaQuery.matches ? "dark" : "light")
      } else {
        setResolvedTheme(theme as "light" | "dark")
      }
    }

    updateResolved()
    mediaQuery.addEventListener("change", updateResolved)
    return () => mediaQuery.removeEventListener("change", updateResolved)
  }, [theme])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(resolvedTheme)
  }, [resolvedTheme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(STORAGE_KEY, newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === "light" ? "dark" : prev === "dark" ? "system" : "light"
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [setTheme])

  return { theme, resolvedTheme, setTheme, toggleTheme }
}
