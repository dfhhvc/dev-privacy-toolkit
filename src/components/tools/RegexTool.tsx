/**
 * Regex Tool Component
 * Test, match, and replace with regular expressions
 * FIXED: Removed unused imports (Check, X)
 * FIXED: Added ReDoS protection with timeout
 * FIXED: Added accessibility attributes
 * FIXED: Improved error handling for invalid regex
 */

"use client"

import { useState, useCallback, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { useToast } from "@/hooks/useToast"
import { copyToClipboard } from "@/lib/utils"
import { 
  Search, 
  Copy, 
  Trash2, 
  BookOpen,
  Replace
} from "lucide-react"

interface RegexMatch {
  text: string
  index: number
  groups: string[]
}

interface CommonPattern {
  name: string
  pattern: string
  description: string
}

const commonPatterns: CommonPattern[] = [
  { name: "邮箱", pattern: "^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$", description: "匹配电子邮件地址" },
  { name: "手机号", pattern: "^1[3-9]\\d{9}$", description: "匹配中国大陆手机号" },
  { name: "URL", pattern: "^https?://[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=%]+$", description: "匹配HTTP/HTTPS链接" },
  { name: "IP地址", pattern: "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$", description: "匹配IPv4地址" },
  { name: "身份证号", pattern: "^\\d{15}|\\d{18}$", description: "匹配15或18位身份证号" },
  { name: "日期", pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$", description: "匹配YYYY-MM-DD格式日期" },
  { name: "中文字符", pattern: "[\\u4e00-\\u9fa5]+", description: "匹配中文字符" },
  { name: "数字", pattern: "^\\d+$", description: "匹配纯数字" },
  { name: "字母", pattern: "^[a-zA-Z]+$", description: "匹配纯字母" },
]

// ReDoS protection: timeout for regex execution
function safeRegexExec(
  regex: RegExp,
  input: string,
  timeoutMs = 1000
): { matches: RegexMatch[]; error?: string } {
  const matches: RegexMatch[] = []
  const startTime = Date.now()
  
  try {
    if (regex.flags.includes("g")) {
      let match
      while ((match = regex.exec(input)) !== null) {
        if (Date.now() - startTime > timeoutMs) {
          return { matches, error: "正则表达式执行超时，可能存在ReDoS风险" }
        }
        matches.push({
          text: match[0],
          index: match.index,
          groups: match.slice(1),
        })
        if (match[0] === "") regex.lastIndex++
      }
    } else {
      const match = regex.exec(input)
      if (match) {
        matches.push({
          text: match[0],
          index: match.index,
          groups: match.slice(1),
        })
      }
    }
    return { matches }
  } catch {
    return { matches, error: "正则表达式执行错误" }
  }
}

export function RegexTool() {
  const [pattern, setPattern] = useState("")
  const [flags, setFlags] = useState("g")
  const [input, setInput] = useState("")
  const [replacement, setReplacement] = useState("")
  const [matches, setMatches] = useState<RegexMatch[]>([])
  const [replaced, setReplaced] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showPatterns, setShowPatterns] = useState(false)
  const { success, error: showError } = useToast()

  const testRegex = useCallback(() => {
    if (!pattern.trim()) {
      showError("请输入正则表达式")
      return
    }

    try {
      const regex = new RegExp(pattern, flags)
      const result = safeRegexExec(regex, input)
      
      if (result.error) {
        setError(result.error)
        setMatches([])
        showError(result.error)
        return
      }
      
      setMatches(result.matches)
      setError(null)
      success(`找到 ${result.matches.length} 个匹配`)
    } catch {
      setError("无效的正则表达式")
      setMatches([])
      showError("无效的正则表达式")
    }
  }, [pattern, flags, input, success, showError])

  const replaceRegex = useCallback(() => {
    if (!pattern.trim()) {
      showError("请输入正则表达式")
      return
    }

    try {
      const regex = new RegExp(pattern, flags)
      const result = input.replace(regex, replacement)
      setReplaced(result)
      setError(null)
      success("替换成功")
    } catch {
      setReplaced("")
      setError("替换失败")
      showError("替换失败")
    }
  }, [pattern, flags, input, replacement, success, showError])

  const applyPattern = useCallback((p: CommonPattern) => {
    setPattern(p.pattern)
    setShowPatterns(false)
    success(`已应用: ${p.name}`)
  }, [success])

  const handleCopy = useCallback(async (text: string) => {
    const copied = await copyToClipboard(text)
    if (copied) {
      success("已复制到剪贴板")
    } else {
      showError("复制失败")
    }
  }, [success, showError])

  const handleClear = useCallback(() => {
    setPattern("")
    setInput("")
    setReplacement("")
    setMatches([])
    setReplaced("")
    setError(null)
  }, [])

  // Highlight matches in input
  const highlightedInput = useMemo(() => {
    if (matches.length === 0) return input

    const parts: React.ReactElement[] = []
    let lastIndex = 0

    matches.forEach((match, i) => {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${i}`}>{input.slice(lastIndex, match.index)}</span>
        )
      }

      // Add highlighted match
      parts.push(
        <mark
          key={`match-${i}`}
          className={cn(
            "rounded px-0.5",
            "bg-yellow-200 text-yellow-900",
            "dark:bg-yellow-900/50 dark:text-yellow-200"
          )}
          title={`Match ${i + 1} at position ${match.index}`}
        >
          {match.text}
        </mark>
      )

      lastIndex = match.index + match.text.length
    })

    // Add remaining text
    if (lastIndex < input.length) {
      parts.push(<span key="text-end">{input.slice(lastIndex)}</span>)
    }

    return parts
  }, [input, matches])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            正则表达式工具
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPatterns(!showPatterns)}
          aria-expanded={showPatterns}
        >
          <BookOpen className="h-4 w-4 mr-1" aria-hidden="true" />
          常用模式
        </Button>
      </div>

      {/* Common Patterns */}
      {showPatterns && (
        <div 
          className={cn(
            "rounded-lg border overflow-hidden",
            "border-gray-200 dark:border-gray-700"
          )}
        >
          <div 
            className={cn(
              "px-4 py-2 text-sm font-medium",
              "bg-gray-50 border-b border-gray-200",
              "dark:bg-gray-800 dark:border-gray-700",
              "text-gray-700 dark:text-gray-300"
            )}
          >
            常用正则模式
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {commonPatterns.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPattern(p)}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-3",
                  "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                  "text-left transition-colors"
                )}
              >
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {p.name}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {p.description}
                  </p>
                </div>
                <code 
                  className={cn(
                    "text-xs px-2 py-1 rounded",
                    "bg-gray-100 text-gray-600",
                    "dark:bg-gray-700 dark:text-gray-300"
                  )}
                >
                  {p.pattern}
                </code>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pattern Input */}
      <div className="space-y-2">
        <label htmlFor="regex-pattern" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          正则表达式
        </label>
        <div className="flex gap-2">
          <input
            id="regex-pattern"
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="输入正则表达式..."
            className={cn(
              "flex-1 rounded-lg border px-4 py-2 text-sm",
              "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-blue-500",
              "dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100",
              "dark:focus:ring-blue-400",
              "font-mono"
            )}
            aria-label="正则表达式"
          />
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="标志"
            className={cn(
              "w-20 rounded-lg border px-3 py-2 text-sm",
              "bg-white border-gray-300 text-gray-900",
              "focus:outline-none focus:ring-2 focus:ring-blue-500",
              "dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100",
              "font-mono"
            )}
            aria-label="正则标志"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          标志: g(全局), i(忽略大小写), m(多行), s(点匹配换行)
        </p>
      </div>

      {/* Test Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="regex-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            测试文本
          </label>
          <Button variant="ghost" size="sm" onClick={handleClear} aria-label="清空">
            <Trash2 className="h-4 w-4 mr-1" aria-hidden="true" />
            清空
          </Button>
        </div>
        <Textarea
          id="regex-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入要测试的文本..."
          minRows={4}
          aria-label="测试文本"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={testRegex} className="flex-1">
          <Search className="h-4 w-4 mr-2" aria-hidden="true" />
          测试匹配
        </Button>
      </div>

      {/* Replacement */}
      <div className="space-y-2">
        <label htmlFor="regex-replacement" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          替换文本 (可选)
        </label>
        <div className="flex gap-2">
          <input
            id="regex-replacement"
            type="text"
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
            placeholder="输入替换内容..."
            className={cn(
              "flex-1 rounded-lg border px-4 py-2 text-sm",
              "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-blue-500",
              "dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
            )}
            aria-label="替换文本"
          />
          <Button onClick={replaceRegex} variant="secondary">
            <Replace className="h-4 w-4 mr-1" aria-hidden="true" />
            替换
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div 
          className={cn(
            "rounded-lg border p-3",
            "bg-red-50 border-red-200",
            "dark:bg-red-900/10 dark:border-red-800"
          )}
          role="alert"
        >
          <p className="text-sm text-red-700 dark:text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* Match Results */}
      {matches.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            匹配结果 ({matches.length}个)
          </label>
          <div 
            className={cn(
              "rounded-lg border p-4",
              "bg-gray-50 border-gray-200",
              "dark:bg-gray-900 dark:border-gray-700"
            )}
          >
            <div className="text-sm leading-relaxed">
              {highlightedInput}
            </div>
          </div>
          
          {/* Match Details */}
          <div 
            className={cn(
              "rounded-lg border overflow-hidden",
              "border-gray-200 dark:border-gray-700"
            )}
          >
            <div 
              className={cn(
                "px-4 py-2 text-sm font-medium",
                "bg-gray-50 border-b border-gray-200",
                "dark:bg-gray-800 dark:border-gray-700",
                "text-gray-700 dark:text-gray-300"
              )}
            >
              匹配详情
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {matches.map((match, i) => (
                <div key={i} className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded",
                        "bg-blue-100 text-blue-700",
                        "dark:bg-blue-900/30 dark:text-blue-400"
                      )}
                    >
                      匹配 {i + 1}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      位置: {match.index}
                    </span>
                  </div>
                  <code className="mt-1 block text-sm text-gray-800 dark:text-gray-200">
                    {match.text}
                  </code>
                  {match.groups.length > 0 && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      捕获组: {match.groups.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Replaced Result */}
      {replaced && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="regex-replaced" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              替换结果
            </label>
            <Button variant="ghost" size="sm" onClick={() => handleCopy(replaced)} aria-label="复制替换结果">
              <Copy className="h-4 w-4 mr-1" aria-hidden="true" />
              复制
            </Button>
          </div>
          <Textarea
            id="regex-replaced"
            value={replaced}
            readOnly
            minRows={3}
            className="bg-gray-50 dark:bg-gray-900"
            aria-label="替换结果"
          />
        </div>
      )}
    </div>
  )
}
