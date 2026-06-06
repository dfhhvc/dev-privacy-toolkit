/**
 * Textarea component
 * Optimized for code and text input with auto-resize
 */

"use client"

import { cn } from "@/lib/utils"
import { forwardRef, useEffect, useRef } from "react"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean
  minRows?: number
  maxRows?: number
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = true, minRows = 3, maxRows = 20, style, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    
    // Combine refs
    useEffect(() => {
      if (typeof ref === "function") {
        ref(textareaRef.current)
      } else if (ref) {
        ref.current = textareaRef.current
      }
    }, [ref])

    // Auto-resize logic
    useEffect(() => {
      if (!autoResize || !textareaRef.current) return
      
      const textarea = textareaRef.current
      
      const resize = () => {
        textarea.style.height = "auto"
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20
        const minHeight = minRows * lineHeight
        const maxHeight = maxRows * lineHeight
        const scrollHeight = textarea.scrollHeight
        const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)
        textarea.style.height = `${newHeight}px`
      }

      textarea.addEventListener("input", resize)
      resize() // Initial resize
      
      return () => textarea.removeEventListener("input", resize)
    }, [autoResize, minRows, maxRows])

    return (
      <textarea
        ref={textareaRef}
        className={cn(
          // Base styles
          "w-full rounded-lg border border-gray-300 bg-white px-4 py-3",
          "text-sm text-gray-900 placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "transition-all duration-200",
          "font-mono leading-relaxed",
          "resize-y",
          
          // Dark mode
          "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100",
          "dark:placeholder:text-gray-500",
          "dark:focus:ring-blue-400",
          
          className
        )}
        style={{
          ...style,
          minHeight: minRows * 24,
        }}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }
