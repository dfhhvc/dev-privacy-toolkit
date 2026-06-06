/**
 * URL Tool Component
 * Encode, decode, and parse URL parameters
 * FIXED: Removed unused imports (Link2, ExternalLink)
 * FIXED: Added proper error handling
 * FIXED: Added accessibility attributes
 */

"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { useToast } from "@/hooks/useToast"
import { copyToClipboard } from "@/lib/utils"
import { 
  Globe, 
  Copy, 
  Trash2, 
  ArrowRightLeft,
} from "lucide-react"

export function UrlTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode" | "parse">("encode")
  const [parsedParams, setParsedParams] = useState<Record<string, string>>({})
  const { success, error: showError } = useToast()

  const encodeUrl = useCallback(() => {
    if (!input.trim()) {
      showError("请输入内容")
      return
    }

    try {
      const encoded = encodeURIComponent(input)
      setOutput(encoded)
      setParsedParams({})
      success("URL编码成功")
    } catch {
      showError("编码失败")
    }
  }, [input, success, showError])

  const decodeUrl = useCallback(() => {
    if (!input.trim()) {
      showError("请输入内容")
      return
    }

    try {
      const decoded = decodeURIComponent(input)
      setOutput(decoded)
      setParsedParams({})
      success("URL解码成功")
    } catch {
      showError("解码失败: 无效的URL编码")
    }
  }, [input, success, showError])

  const parseUrl = useCallback(() => {
    if (!input.trim()) {
      showError("请输入URL")
      return
    }

    try {
      const url = new URL(input)
      const params: Record<string, string> = {}
      
      // Parse query parameters
      url.searchParams.forEach((value, key) => {
        params[key] = value
      })

      // Add URL components
      params["🔍 协议 (Protocol)"] = url.protocol
      params["🔍 主机 (Host)"] = url.host
      params["🔍 主机名 (Hostname)"] = url.hostname
      params["🔍 端口 (Port)"] = url.port || "默认"
      params["🔍 路径 (Pathname)"] = url.pathname
      params["🔍 哈希 (Hash)"] = url.hash || "无"

      setParsedParams(params)
      setOutput(JSON.stringify(params, null, 2))
      success("URL解析成功")
    } catch {
      showError("解析失败: 无效的URL")
    }
  }, [input, success, showError])

  const handleAction = useCallback(() => {
    switch (mode) {
      case "encode":
        encodeUrl()
        break
      case "decode":
        decodeUrl()
        break
      case "parse":
        parseUrl()
        break
    }
  }, [mode, encodeUrl, decodeUrl, parseUrl])

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
    setParsedParams({})
  }, [])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            URL 工具
          </h2>
        </div>
      </div>

      {/* Mode Toggle */}
      <div 
        className={cn(
          "flex rounded-lg border p-1",
          "bg-gray-50 border-gray-200",
          "dark:bg-gray-800 dark:border-gray-700"
        )}
        role="group"
        aria-label="模式切换"
      >
        {(["encode", "decode", "parse"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all",
              mode === m
                ? "bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            )}
            aria-pressed={mode === m}
          >
            {m === "encode" && "编码"}
            {m === "decode" && "解码"}
            {m === "parse" && "解析"}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="url-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === "encode" && "原文"}
            {mode === "decode" && "编码后"}
            {mode === "parse" && "URL"}
          </label>
          <Button variant="ghost" size="sm" onClick={handleClear} aria-label="清空">
            <Trash2 className="h-4 w-4 mr-1" aria-hidden="true" />
            清空
          </Button>
        </div>
        <Textarea
          id="url-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "encode"
              ? "输入要编码的内容..."
              : mode === "decode"
              ? "输入URL编码字符串..."
              : "输入完整URL，如 https://example.com?key=value..."
          }
          minRows={3}
          aria-label={mode === "encode" ? "原文输入" : mode === "decode" ? "编码输入" : "URL输入"}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={handleAction} className="flex-1">
          <ArrowRightLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          {mode === "encode" && "编码"}
          {mode === "decode" && "解码"}
          {mode === "parse" && "解析"}
        </Button>
      </div>

      {/* Parsed Parameters */}
      {mode === "parse" && Object.keys(parsedParams).length > 0 && (
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
            解析结果
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {Object.entries(parsedParams).map(([key, value]) => (
              <div
                key={key}
                className="flex items-start gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">
                  {key}
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100 break-all">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Output */}
      {output && mode !== "parse" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="url-output" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              结果
            </label>
            <Button variant="ghost" size="sm" onClick={handleCopy} aria-label="复制结果">
              <Copy className="h-4 w-4 mr-1" aria-hidden="true" />
              复制
            </Button>
          </div>
          <Textarea
            id="url-output"
            value={output}
            readOnly
            minRows={3}
            className="bg-gray-50 dark:bg-gray-900"
            aria-label="输出结果"
          />
        </div>
      )}
    </div>
  )
}
