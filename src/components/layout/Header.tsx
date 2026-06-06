/**
 * Header component
 * Top navigation with theme toggle and search
 * FIXED: Removed unused 'resolvedTheme' variable
 * FIXED: Added accessibility attributes
 * FIXED: Added keyboard navigation for theme dropdown
 */

"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/useTheme"
import { 
  Shield, 
  Sun, 
  Moon, 
  Monitor, 
  Search,
  Command
} from "lucide-react"

interface HeaderProps {
  onSearch?: (query: string) => void
}

export function Header({ onSearch }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const themeIcons = {
    light: <Sun className="h-4 w-4" aria-hidden="true" />,
    dark: <Moon className="h-4 w-4" aria-hidden="true" />,
    system: <Monitor className="h-4 w-4" aria-hidden="true" />,
  }

  const themeLabels = {
    light: "浅色",
    dark: "深色",
    system: "系统",
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close dropdown on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false)
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b backdrop-blur-lg",
      "bg-white/80 border-gray-200",
      "dark:bg-gray-900/80 dark:border-gray-800"
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              "bg-blue-600 text-white",
              "dark:bg-blue-500"
            )}>
              <Shield className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="hidden sm:block">
              <h1 className={cn(
                "text-lg font-bold leading-tight",
                "text-gray-900 dark:text-white"
              )}>
                DevPrivacy
              </h1>
              <p className={cn(
                "text-xs",
                "text-gray-500 dark:text-gray-400"
              )}>
                离线开发者工具箱
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                "text-gray-400"
              )} aria-hidden="true" />
              <input
                type="text"
                placeholder="搜索工具..."
                value={searchQuery}
                onChange={handleSearch}
                className={cn(
                  "w-full rounded-lg border pl-10 pr-10 py-2 text-sm",
                  "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100",
                  "dark:placeholder:text-gray-500 dark:focus:ring-blue-400"
                )}
                aria-label="搜索工具"
              />
              <div className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2",
                "hidden sm:flex items-center gap-1"
              )}>
                <kbd className={cn(
                  "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium",
                  "bg-gray-100 text-gray-500 border border-gray-200",
                  "dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                )}>
                  <Command className="h-3 w-3 mr-0.5" aria-hidden="true" />
                  K
                </kbd>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <div className="relative" ref={dropdownRef}>
              <button
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg",
                  "text-gray-500 hover:bg-gray-100",
                  "dark:text-gray-400 dark:hover:bg-gray-800",
                  "transition-colors"
                )}
                title={`当前主题: ${themeLabels[theme]}`}
                aria-label={`当前主题: ${themeLabels[theme]}，点击切换`}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {themeIcons[theme]}
              </button>
              
              {/* Theme Dropdown */}
              {dropdownOpen && (
                <div className={cn(
                  "absolute right-0 top-full mt-2 w-36 rounded-lg shadow-lg",
                  "bg-white border border-gray-200 py-1",
                  "dark:bg-gray-800 dark:border-gray-700",
                  "z-50"
                )}
                role="menu"
                aria-label="主题选择"
                >
                  {(["light", "dark", "system"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTheme(t)
                        setDropdownOpen(false)
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2 text-sm",
                        "hover:bg-gray-100 dark:hover:bg-gray-700",
                        theme === t && "text-blue-600 dark:text-blue-400"
                      )}
                      role="menuitem"
                      aria-current={theme === t ? "true" : undefined}
                    >
                      {themeIcons[t]}
                      {themeLabels[t]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* GitHub Link */}
            <a
              href="https://github.com/dfhhvc/dev-privacy-toolkit"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg",
                "text-gray-500 hover:bg-gray-100",
                "dark:text-gray-400 dark:hover:bg-gray-800",
                "transition-colors"
              )}
              title="GitHub"
              aria-label="访问GitHub仓库"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
