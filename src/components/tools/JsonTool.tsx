/"/**
 * JSON Tool Component
 * Format, validate, compress, and escape JSON
 * Top-tier implementation with error handling
 */

"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { useToast } from "@/hooks/useToast"
import { copyToClipboard } from "@/lib/utils"
import { 
  FileJson, 
  Check, 
  X, 
  Copy, 
  Trash2, 
  Minimize2,
  Maximize2,
  Braces
} from "lucide-react"

export function JsonTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    size: 0,
    lines: 0,
    keys: 0,
  })
  const { success, error: showError } = useToast()

  const validateJson = useCallback((json: string): boolean => {
    try {
      JSON.parse(json)
      return true
    } catch {
      return false
    }
  }, [])

  const countKeys = useCallback((obj: unknown): number => {
    if (typeof obj !== "object" || obj === null) return 0
    let count = 0
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        count++
        count += countKeys((obj as Record<string, unknown>)[key])
      }
    }
    return count
  }, [])

  const updateStats = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json)
      setStats({
        size: new Blob([json]).size,
        lines: json.split("\n").length,
        keys: countKeys(parsed),
      })
    } catch {
      setStats({ size: 0, lines: 0, keys: 0 })
    }
  }, [countKeys])

  const formatJson = useCallback(() => {
    if (!input.trim()) {
      showError("请输入JSON内容")
      return
    }

    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError(null)
      updateStats(formatted)
      success("JSON格式化成功")
    } catch (err) {
      setError(err instanceof Error ? err.message : "无效的JSON")
      setOutput("")
      showError("JSON格式错误")
    }
  }, [input, success, showError, updateStats])

  const compressJson = useCallback(() => {
    if (!input.trim()) {
      showError("请输入JSON内容")
      return
    }

    try {
      const parsed = JSON.parse(input)
      const compressed = JSON.stringify(parsed)
      setOutput(compressed)
      setError(null)
      updateStats(compressed)
      success("JSON压缩成功")
    } catch (err) {
      setError(err instanceof Error ? err.message : "无效的JSON")
      setOutput("")
      showError("JSON格式错误")
    }
  }, [input, success, showError, updateStats])

  const escapeJson = useCallback(() => {
    if (!input.trim()) {
      showError("请输入JSON内容")
      return
    }

    try {
      const escaped = JSON.stringify(input).slice(1, -1)
      setOutput(escaped)
      setError(null)
      success("JSON转义成功")
    } catch (err) {
      setError(err instanceof Error ? err.message : "转义失败")
      showError("转义失败")
    }
  }, [input, success, showError])

  const unescapeJson = useCallback(() => {
    if (!input.trim()) {
      showError("请输入JSON内容")
      return
    }

    try {
      const unescaped = JSON.parse(`"${input}"`)
      setOutput(unescaped)
      setError(null)
      success("JSON反转义成功")
    } catch (err) {
      setError(err instanceof Error ? err.message : "反转义失败")
      showError("反转义失败")
    }
  }, [input, success, showError])

  const handleCopy = useCallback(async () => {
    if (!output) return
    const copied = await copyToClipboard(output)
    if (copied) {
      success("已复制到剪贴板")
    } else {
      showError("复制失败")
    }
  }, [output, success, showError])

  const handleClear = useCallback(() => {
    setInput("")
    setOutput("")
    setError(null)
    setStats({ size: 0, lines: 0, keys: 0 })
  }, [])

  const isValid = validateJson(input)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileJson className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            JSON 工具
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isValid && input && (
            <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <Check className="h-3 w-3" />
              有效JSON
            </span>
          )}
          {!isValid && input && (
            <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
              <X className="h-3 w-3" />
              无效JSON
            </span>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            输入
          </label>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <Trash2 className="h-4 w-4 mr-1" />
            清空
          </Button>
        </div>
        <Textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setError(null)
          }}
          placeholder="在此粘贴JSON内容..."
          minRows={5}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={formatJson}>
          <Maximize2 className="h-4 w-4 mr-1" />
          格式化
        </Button>
        <Button onClick={compressJson} variant="secondary">
          <Minimize2 className="h-4 w-4 mr-1" />
          压缩
        </Button>
        <Button onClick={escapeJson} variant="secondary">
          <Braces className="h-4 w-4 mr-1" />
          转义
        </Button>
        <Button onClick={unescapeJson} variant="secondary">
          <Braces className="h-4 w-4 mr-1" />
          反转义
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className={cn(
          "rounded-lg border p-3",
          "bg-red-50 border-red-200",
          "dark:bg-red-900/10 dark:border-red-800"
        )}>
          <p className="text-sm text-red-700 dark:text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              输出
            </label>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1" />
              复制
            </Button>
          </div>
          <Textarea
            value={output}
            readOnly
            minRows={5}
            className="bg-gray-50 dark:bg-gray-900"
          />
        </div>
      )}

      {/* Stats */}
      {stats.size > 0 && (
        <div className={cn(
          "flex gap-4 text-xs",
          "text-gray-500 dark:text-gray-400"
        )}>
          <span>大小: {stats.size} bytes</span>
          <span>行数: {stats.lines}</span>
          <span>键数: {stats.keys}</span>
        </div>
      )}
    </div>
  )
}
