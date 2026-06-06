/**
 * Toast notification hook
 * Provides user feedback for actions
 * FIXED: Added cleanup for timeouts to prevent memory leaks
 * FIXED: Added max toast limit to prevent UI overflow
 */

"use client"

import { useState, useCallback, useRef } from "react"
import type { Toast } from "@/types"

const MAX_TOASTS = 5

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    // Clear timeout if exists
    const timeout = timeoutsRef.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutsRef.current.delete(id)
    }
  }, [])

  const addToast = useCallback((message: string, type: Toast["type"] = "info", duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9)
    const toast: Toast = { id, message, type, duration }
    
    setToasts(prev => {
      // Remove oldest toast if at max
      const newToasts = [...prev, toast]
      if (newToasts.length > MAX_TOASTS) {
        const removed = newToasts.shift()
        if (removed) {
          const timeout = timeoutsRef.current.get(removed.id)
          if (timeout) {
            clearTimeout(timeout)
            timeoutsRef.current.delete(removed.id)
          }
        }
      }
      return newToasts
    })
    
    if (duration > 0) {
      const timeout = setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
        timeoutsRef.current.delete(id)
      }, duration)
      timeoutsRef.current.set(id, timeout)
    }
    
    return id
  }, [])

  const success = useCallback((message: string, duration?: number) => {
    return addToast(message, "success", duration)
  }, [addToast])

  const error = useCallback((message: string, duration?: number) => {
    return addToast(message, "error", duration)
  }, [addToast])

  const info = useCallback((message: string, duration?: number) => {
    return addToast(message, "info", duration)
  }, [addToast])

  const warning = useCallback((message: string, duration?: number) => {
    return addToast(message, "warning", duration)
  }, [addToast])

  return { toasts, addToast, removeToast, success, error, info, warning }
}
