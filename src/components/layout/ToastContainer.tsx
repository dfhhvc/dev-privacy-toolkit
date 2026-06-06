/**
 * Toast Container Component
 * Displays toast notifications
 * FIXED: Added accessibility attributes
 * FIXED: Added aria-live region for screen readers
 * FIXED: Auto-dismiss with proper cleanup
 */

"use client"

import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { type Toast } from "@/types"
import { Check, X, Info, AlertTriangle } from "lucide-react"

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      role="region"
      aria-live="polite"
      aria-label="通知"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const icons = {
    success: <Check className="h-5 w-5 text-green-500" aria-hidden="true" />,
    error: <X className="h-5 w-5 text-red-500" aria-hidden="true" />,
    info: <Info className="h-5 w-5 text-blue-500" aria-hidden="true" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" aria-hidden="true" />,
  }

  const styles = {
    success: "border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800",
    error: "border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800",
    info: "border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800",
    warning: "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800",
  }

  const ariaLabels = {
    success: "成功",
    error: "错误",
    info: "信息",
    warning: "警告",
  }

  // Auto-dismiss
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id)
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onRemove])

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg",
        "animate-in slide-in-from-right-full",
        styles[toast.type]
      )}
      role="alert"
      aria-label={`${ariaLabels[toast.type]}: ${toast.message}`}
    >
      {icons[toast.type]}
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        aria-label="关闭通知"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
