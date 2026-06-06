/**
 * Header component
 * Top navigation with theme toggle and search
 */

"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/useTheme"
import { 
  Shield, 
  Sun, 
  Moon, 
  Monitor, 
  Search,
  Command,
  Github
} from "lucide-react"

interface HeaderProps {
  onSearch?: (query: string) => void
}

export function Header({ onSearch }: HeaderProps) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const themeIcons = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    system: <Monitor className="h-4 w-4" />,
  }

  const themeLabels = {
    light: "浅色",
    dark: "深色",
    system: "系统",
  }

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
              <Shield className="h-5 w-5" />
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
              )} />
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
                  <Command className="h-3 w-3 mr-0.5" />
                  K
                </kbd>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <div className="relative group">
              <button
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg",
                  "text-gray-500 hover:bg-gray-100",
                  "dark:text-gray-400 dark:hover:bg-gray-800",
                  "transition-colors"
                )}
                title={`当前主题: ${themeLabels[theme]}`}
              >
                {themeIcons[theme]}
              </button>
              
              {/* Theme Dropdown */}
              <div className={cn(
                "absolute right-0 top-full mt-2 w-36 rounded-lg shadow-lg",
                "bg-white border border-gray-200 py-1",
                "dark:bg-gray-800 dark:border-gray-700",
                "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
                "transition-all duration-200"
              )}>
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-sm",
                      "hover:bg-gray-100 dark:hover:bg-gray-700",
                      theme === t && "text-blue-600 dark:text-blue-400"
                    )}
                  >
                    {themeIcons[t]}
                    {themeLabels[t]}
                  </button>
                ))}
              </div>
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
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
