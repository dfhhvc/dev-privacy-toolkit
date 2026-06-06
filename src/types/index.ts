/**
 * Type definitions for the project
 * Strict TypeScript types for maximum safety
 */

/**
 * Tool category enum for organization
 */
export enum ToolCategory {
  JSON = "json",
  BASE64 = "base64",
  URL = "url",
  JWT = "jwt",
  REGEX = "regex",
  HTML = "html",
  HASH = "hash",
  TIMESTAMP = "timestamp",
}

/**
 * Tool interface - every tool must implement this
 */
export interface Tool {
  id: string
  name: string
  description: string
  category: ToolCategory
  icon: string
  component: React.ComponentType
}

/**
 * Theme type for dark/light mode
 */
export type Theme = "light" | "dark" | "system"

/**
 * Toast notification type
 */
export interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info" | "warning"
  duration?: number
}

/**
 * History item for local storage
 */
export interface HistoryItem {
  id: string
  toolId: string
  input: string
  output: string
  timestamp: number
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean
  error?: string
}
