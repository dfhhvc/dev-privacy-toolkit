/**
 * Base64 Tool Component
 * Encode and decode Base64 strings and files
 * FIXED: Removed unused 'err' variables, added accessibility
 * FIXED: Added proper error messages
 * FIXED: File download uses proper MIME type detection
 */

"use client"

import { useState, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { useToast } from "@/hooks/useToast"
import { copyToClipboard } from "@/lib/utils"
import { 
  Lock, 
  Copy, 
  Trash2, 
  ArrowRightLeft,
  FileUp,
  Download
} from "lucide-react"

function detectMimeType(base64: string): string {
  // Try to detect MIME type from base64 prefix
  if (base64.startsWith("/9j/")) return "image/jpeg"
  if (base64.startsWith("iVBOR")) return "image/png"
  if (base64.startsWith("R0lGOD")) return "image/gif"
  if (base64.startsWith("PHN2Zy")) return "image/svg+xml"
  if (base64.startsWith("JVBERi")) return "application/pdf"
  if (base64.startsWith("UEsDB")) return "application/zip"
  return "application/octet-stream"
}

export function Base64Tool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { success, error: showError } = useToast()

  const encode = useCallback(() => {
    if (!input.trim()) {
      showError("请输入内容")
      return
    }

    try {
      const encoded = btoa(unescape(encodeURIComponent(input)))
      setOutput(encoded)
      success("Base64编码成功")
    } catch {
      showError("编码失败: 包含不支持字符")
    }
  }, [input, success, showError])

  const decode = useCallback(() => {
    if (!input.trim()) {
      showError("请输入内容")
      return
    }

    try {
      const decoded = decodeURIComponent(escape(atob(input)))
      setOutput(decoded)
      success("Base64解码成功")
    } catch {
      showError("解码失败: 无效的Base64字符串")
    }
  }, [input, success, showError])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      // Extract base64 data (remove data:*/*;base64, prefix)
      const base64 = result.split(",")[1]
      if (base64) {
        setInput(base64)
        setFileName(file.name)
        setMode("decode")
        success(`文件 "${file.name}" 已加载`)
      } else {
        showError("文件读取失败")
      }
    }
    reader.onerror = () => {
      showError("文件读取失败")
    }
    reader.readAsDataURL(file)
  }, [success, showError])

  const handleDownload = useCallback(() => {
    if (!output) return

    try {
      const mimeType = detectMimeType(output)
      const byteCharacters = atob(output)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: mimeType })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName || `decoded-file.${mimeType.split("/")[1] || "bin"}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      success("文件下载成功")
    } catch {
      showError("下载失败: 无效的Base64数据")
    }
  }, [output, fileName, success, showError])

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
    setFileName(null)
  }, [])

  const handleAction = useCallback(() => {
    if (mode === "encode") {
      encode()
    } else {
      decode()
    }
  }, [mode, encode, decode])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Base64 工具
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
        <button
          onClick={() => setMode("encode")}
          className={cn(
            "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all",
            mode === "encode"
              ? "bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          )}
          aria-pressed={mode === "encode"}
        >
          编码
        </button>
        <button
          onClick={() => setMode("decode")}
          className={cn(
            "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all",
            mode === "decode"
              ? "bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          )}
          aria-pressed={mode === "decode"}
        >
          解码
        </button>
      </div>

      {/* File Upload */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          aria-label="上传文件"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <FileUp className="h-4 w-4 mr-2" aria-hidden="true" />
          {fileName ? `已选择: ${fileName}` : "上传文件"}
        </Button>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="base64-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === "encode" ? "原文" : "Base64"}
          </label>
          <Button variant="ghost" size="sm" onClick={handleClear} aria-label="清空">
            <Trash2 className="h-4 w-4 mr-1" aria-hidden="true" />
            清空
          </Button>
        </div>
        <Textarea
          id="base64-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "输入要编码的内容..." : "输入Base64字符串..."}
          minRows={5}
          aria-label={mode === "encode" ? "原文输入" : "Base64输入"}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={handleAction} className="flex-1">
          <ArrowRightLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          {mode === "encode" ? "编码" : "解码"}
        </Button>
      </div>

      {/* Output */}
      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="base64-output" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {mode === "encode" ? "Base64结果" : "解码结果"}
            </label>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopy} aria-label="复制结果">
                <Copy className="h-4 w-4 mr-1" aria-hidden="true" />
                复制
              </Button>
              {mode === "decode" && fileName && (
                <Button variant="ghost" size="sm" onClick={handleDownload} aria-label="下载文件">
                  <Download className="h-4 w-4 mr-1" aria-hidden="true" />
                  下载
                </Button>
              )}
            </div>
          </div>
          <Textarea
            id="base64-output"
            value={output}
            readOnly
            minRows={5}
            className="bg-gray-50 dark:bg-gray-900"
            aria-label="输出结果"
          />
        </div>
      )}
    </div>
  )
}
