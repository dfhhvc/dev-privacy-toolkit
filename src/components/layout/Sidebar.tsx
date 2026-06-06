/**
 * Sidebar component
 * Tool navigation with categories
 */

"use client"

import { cn } from "@/lib/utils"
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
  LayoutGrid,
  type LucideIcon
} from "lucide-react"

interface SidebarProps {
  activeCategory: ToolCategory | "all"
  onCategoryChange: (category: ToolCategory | "all") => void
}

const categories: { id: ToolCategory | "all"; name: string; icon: LucideIcon }[] = [
  { id: "all", name: "全部工具", icon: LayoutGrid },
  { id: ToolCategory.JSON, name: "JSON工具", icon: FileJson },
  { id: ToolCategory.BASE64, name: "Base64工具", icon: Lock },
  { id: ToolCategory.URL, name: "URL工具", icon: Globe },
  { id: ToolCategory.JWT, name: "JWT工具", icon: KeyRound },
  { id: ToolCategory.REGEX, name: "正则工具", icon: Search },
  { id: ToolCategory.HTML, name: "HTML实体", icon: Code2 },
  { id: ToolCategory.HASH, name: "哈希计算", icon: Fingerprint },
  { id: ToolCategory.TIMESTAMP, name: "时间戳", icon: Clock },
]

export function Sidebar({ activeCategory, onCategoryChange }: SidebarProps) {
  return (
    <aside 
      className={cn(
        "w-64 flex-shrink-0 border-r",
        "bg-gray-50 border-gray-200",
        "dark:bg-gray-900 dark:border-gray-800"
      )}
      aria-label="工具分类"
    >
      <nav className="p-4 space-y-1" role="navigation" aria-label="分类导航">
        {categories.map((category) => {
          const Icon = category.icon
          const isActive = activeCategory === category.id
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
              aria-current={isActive ? "page" : undefined}
              aria-label={category.name}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-400 dark:text-gray-500"
              )} aria-hidden="true" />
              {category.name}
            </button>
          )
        })}
      </nav>

      {/* Privacy Badge */}
      <div 
        className={cn(
          "mx-4 mt-6 rounded-lg border p-4",
          "bg-green-50 border-green-200",
          "dark:bg-green-900/10 dark:border-green-800"
        )}
        role="status"
        aria-label="隐私状态"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className={cn(
            "h-2 w-2 rounded-full",
            "bg-green-500 animate-pulse"
          )} aria-hidden="true" />
          <span className={cn(
            "text-xs font-medium",
            "text-green-800 dark:text-green-400"
          )}>
            100% 离线运行
          </span>
        </div>
        <p className={cn(
          "text-xs",
          "text-green-700 dark:text-green-500"
        )}>
          所有数据处理在本地完成，不会上传到任何服务器
        </p>
      </div>

      {/* Keyboard Shortcuts */}
      <div 
        className={cn(
          "mx-4 mt-4 rounded-lg border p-4",
          "bg-gray-50 border-gray-200",
          "dark:bg-gray-800 dark:border-gray-700"
        )}
        aria-label="快捷键说明"
      >
        <p className={cn(
          "text-xs font-medium mb-2",
          "text-gray-600 dark:text-gray-400"
        )}>
          快捷键
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-500">搜索</span>
            <kbd className={cn(
              "px-1.5 py-0.5 rounded text-[10px]",
              "bg-gray-200 text-gray-600",
              "dark:bg-gray-700 dark:text-gray-400"
            )}>
              Ctrl+K
            </kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-500">返回</span>
            <kbd className={cn(
              "px-1.5 py-0.5 rounded text-[10px]",
              "bg-gray-200 text-gray-600",
              "dark:bg-gray-700 dark:text-gray-400"
            )}>
              Esc
            </kbd>
          </div>
        </div>
      </div>
    </aside>
  )
}
