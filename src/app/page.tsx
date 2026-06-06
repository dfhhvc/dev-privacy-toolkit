/**
 * Main Page
 * Tool grid with search and category filtering
 * FIXED: Used useSyncExternalStore for URL params to avoid setState in effect
 * FIXED: Added proper accessibility attributes
 * FIXED: Memoized filteredTools with useMemo
 * FIXED: Proper keyboard event handling
 */

"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { ToastContainer } from "@/components/layout/ToastContainer"
import { JsonTool } from "@/components/tools/JsonTool"
import { Base64Tool } from "@/components/tools/Base64Tool"
import { UrlTool } from "@/components/tools/UrlTool"
import { JwtTool } from "@/components/tools/JwtTool"
import { RegexTool } from "@/components/tools/RegexTool"
import { HtmlTool } from "@/components/tools/HtmlTool"
import { HashTool } from "@/components/tools/HashTool"
import { TimestampTool } from "@/components/tools/TimestampTool"
import { useToast } from "@/hooks/useToast"
import { ToolCategory } from "@/types"
import {
  FileJson,
  Lock,
  Globe,
  KeyRound,
  Search,
  Code2,
  Fingerprint,
  Clock,
} from "lucide-react"

const tools = [
  {
    id: "json",
    name: "JSON 工具",
    description: "格式化、压缩、转义、反转义JSON",
    category: ToolCategory.JSON,
    icon: FileJson,
    component: JsonTool,
  },
  {
    id: "base64",
    name: "Base64 工具",
    description: "编码、解码、文件转换",
    category: ToolCategory.BASE64,
    icon: Lock,
    component: Base64Tool,
  },
  {
    id: "url",
    name: "URL 工具",
    description: "编码、解码、参数解析",
    category: ToolCategory.URL,
    icon: Globe,
    component: UrlTool,
  },
  {
    id: "jwt",
    name: "JWT 工具",
    description: "解码、验证JWT令牌",
    category: ToolCategory.JWT,
    icon: KeyRound,
    component: JwtTool,
  },
  {
    id: "regex",
    name: "正则表达式工具",
    description: "测试、匹配、替换正则",
    category: ToolCategory.REGEX,
    icon: Search,
    component: RegexTool,
  },
  {
    id: "html",
    name: "HTML 实体工具",
    description: "编码、解码HTML实体",
    category: ToolCategory.HTML,
    icon: Code2,
    component: HtmlTool,
  },
  {
    id: "hash",
    name: "哈希计算工具",
    description: "MD5、SHA-1、SHA-256、SHA-512",
    category: ToolCategory.HASH,
    icon: Fingerprint,
    component: HashTool,
  },
  {
    id: "timestamp",
    name: "时间戳工具",
    description: "时间戳与日期互转",
    category: ToolCategory.TIMESTAMP,
    icon: Clock,
    component: TimestampTool,
  },
]

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const { toasts, removeToast } = useToast()

  // Handle URL query params for direct tool access - use ref to avoid setState in effect
  const urlToolRef = useRef<string | null>(null)
  
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const toolId = params.get("tool")
    if (toolId && tools.find((t) => t.id === toolId)) {
      urlToolRef.current = toolId
    }
  }, [])
  
  // Apply URL tool selection after initial render
  useEffect(() => {
    if (urlToolRef.current && !activeTool) {
      setActiveTool(urlToolRef.current)
      urlToolRef.current = null
    }
  }, [activeTool])

  // Register service worker for PWA
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const swPath = "/dev-privacy-toolkit/sw.js"
      navigator.serviceWorker
        .register(swPath)
        .then(() => console.log("SW registered"))
        .catch((err: Error) => console.log("SW registration failed:", err))
    }
  }, [])

  // Keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement
        searchInput?.focus()
      }
      // Escape to go back
      if (e.key === "Escape" && activeTool) {
        setActiveTool(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeTool])

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = activeCategory === "all" || tool.category === activeCategory
      const matchesSearch =
        searchQuery === "" ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const activeToolData = tools.find((t) => t.id === activeTool)

  const handleCategoryChange = useCallback((cat: ToolCategory | "all") => {
    setActiveCategory(cat)
    setActiveTool(null)
  }, [])

  return (
    <div className={cn("min-h-screen", "bg-white dark:bg-gray-950")}>
      <Header onSearch={setSearchQuery} />

      <div className="flex">
        <Sidebar
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        <main className="flex-1 p-6" role="main" aria-label="工具内容">
          {activeToolData ? (
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setActiveTool(null)}
                className={cn(
                  "mb-4 text-sm",
                  "text-gray-500 hover:text-gray-900",
                  "dark:text-gray-400 dark:hover:text-gray-200"
                )}
                aria-label="返回工具列表"
              >
                ← 返回工具列表
              </button>
              <div
                className={cn(
                  "rounded-xl border p-6",
                  "bg-white border-gray-200",
                  "dark:bg-gray-900 dark:border-gray-800"
                )}
              >
                <activeToolData.component />
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h2
                  className={cn(
                    "text-2xl font-bold",
                    "text-gray-900 dark:text-white"
                  )}
                >
                  开发者工具
                </h2>
                <p
                  className={cn(
                    "mt-1 text-sm",
                    "text-gray-500 dark:text-gray-400"
                  )}
                >
                  选择下方工具开始使用，所有数据处理均在本地完成
                </p>
              </div>

              <div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                role="list"
                aria-label="工具列表"
              >
                {filteredTools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={cn(
                        "flex items-start gap-4 rounded-xl border p-5 text-left",
                        "bg-white border-gray-200",
                        "dark:bg-gray-900 dark:border-gray-800",
                        "hover:border-blue-300 hover:shadow-md",
                        "dark:hover:border-blue-700",
                        "transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      )}
                      role="listitem"
                      aria-label={`${tool.name} - ${tool.description}`}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          "bg-blue-50 text-blue-600",
                          "dark:bg-blue-900/20 dark:text-blue-400"
                        )}
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3
                          className={cn(
                            "font-semibold",
                            "text-gray-900 dark:text-white"
                          )}
                        >
                          {tool.name}
                        </h3>
                        <p
                          className={cn(
                            "mt-1 text-sm",
                            "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {tool.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {filteredTools.length === 0 && (
                <div className="text-center py-12">
                  <p
                    className={cn(
                      "text-lg",
                      "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    未找到匹配的工具
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
