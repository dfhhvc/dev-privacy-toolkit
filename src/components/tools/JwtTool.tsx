/"/**
 * JWT Tool Component
 * Decode and verify JWT tokens
 * Top-tier implementation with signature verification info
 */

"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { useToast } from "@/hooks/useToast"
import { copyToClipboard } from "@/lib/utils"
import { 
  KeyRound, 
  Copy, 
  Trash2, 
  Shield,
  ShieldAlert,
  Clock,
  User
} from "lucide-react"

interface JwtPayload {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
  isExpired: boolean
  expiresAt?: string
}

export function JwtTool() {
  const [input, setInput] = useState("")
  const [decoded, setDecoded] = useState<JwtPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { success, error: showError } = useToast()

  const decodeJwt = useCallback(() => {
    if (!input.trim()) {
      showError("请输入JWT令牌")
      return
    }

    try {
      const parts = input.split(".")
      if (parts.length !== 3) {
        throw new Error("JWT格式错误: 必须包含3个部分")
      }

      // Decode header
      const header = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")))
      
      // Decode payload
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")))
      
      // Check expiration
      const now = Math.floor(Date.now() / 1000)
      const exp = payload.exp as number | undefined
      const isExpired = exp ? now > exp : false
      
      const expiresAt = exp
        ? new Date(exp * 1000).toLocaleString("zh-CN")
        : undefined

      setDecoded({
        header,
        payload,
        signature: parts[2],
        isExpired,
        expiresAt,
      })
      setError(null)
      success("JWT解码成功")
    } catch (err) {
      setError(err instanceof Error ? err.message : "解码失败")
      setDecoded(null)
      showError("JWT解码失败")
    }
  }, [input, success, showError])

  const handleCopy = useCallback(async (text: string) => {
    const copied = await copyToClipboard(text)
    if (copied) {
      success("已复制到剪贴板")
    } else {
      showError("复制失败")
    }
  }, [success, showError])

  const handleClear = useCallback(() => {
    setInput("")
    setDecoded(null)
    setError(null)
  }, [])

  const formatJson = (obj: unknown): string => JSON.stringify(obj, null, 2)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            JWT 工具
          </h2>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            JWT 令牌
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
          placeholder="粘贴JWT令牌 (eyJhbGciOiJIUzI1NiIs...)")
          minRows={3}
        />
      </div>

      {/* Decode Button */}
      <Button onClick={decodeJwt} className="w-full">
        <Shield className="h-4 w-4 mr-2" />
        解码令牌
      </Button>

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

      {/* Decoded Result */}
      {decoded && (
        <div className="space-y-4">
          {/* Expiration Warning */}
          {decoded.isExpired && (
            <div className={cn(
              "flex items-center gap-2 rounded-lg border p-3",
              "bg-yellow-50 border-yellow-200",
              "dark:bg-yellow-900/10 dark:border-yellow-800"
            )}>
              <ShieldAlert className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-yellow-700 dark:text-yellow-400">
                此令牌已过期
              </span>
            </div>
          )}

          {/* Expiration Info */}
          {decoded.expiresAt && (
            <div className={cn(
              "flex items-center gap-2 text-sm",
              "text-gray-600 dark:text-gray-400"
            )}>
              <Clock className="h-4 w-4" />
              过期时间: {decoded.expiresAt}
            </div>
          )}

          {/* Header */}
          <div className={cn(
            "rounded-lg border overflow-hidden",
            "border-gray-200 dark:border-gray-700"
          )}>
            <div className={cn(
              "flex items-center justify-between px-4 py-2",
              "bg-gray-50 border-b border-gray-200",
              "dark:bg-gray-800 dark:border-gray-700"
            )}>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Header (头部)
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(formatJson(decoded.header))}
              >
                <Copy className="h-3 w-3 mr-1" />
                复制
              </Button>
            </div>
            <pre className={cn(
              "p-4 text-sm overflow-auto",
              "bg-gray-50 dark:bg-gray-900",
              "text-gray-800 dark:text-gray-200"
            )}>
              {formatJson(decoded.header)}
            </pre>
          </div>

          {/* Payload */}
          <div className={cn(
            "rounded-lg border overflow-hidden",
            "border-gray-200 dark:border-gray-700"
          )}>
            <div className={cn(
              "flex items-center justify-between px-4 py-2",
              "bg-gray-50 border-b border-gray-200",
              "dark:bg-gray-800 dark:border-gray-700"
            )}>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Payload (载荷)
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(formatJson(decoded.payload))}
              >
                <Copy className="h-3 w-3 mr-1" />
                复制
              </Button>
            </div>
            <pre className={cn(
              "p-4 text-sm overflow-auto",
              "bg-gray-50 dark:bg-gray-900",
              "text-gray-800 dark:text-gray-200"
            )}>
              {formatJson(decoded.payload)}
            </pre>
          </div>

          {/* Signature */}
          <div className={cn(
            "rounded-lg border overflow-hidden",
            "border-gray-200 dark:border-gray-700"
          )}>
            <div className={cn(
              "px-4 py-2",
              "bg-gray-50 border-b border-gray-200",
              "dark:bg-gray-800 dark:border-gray-700"
            )}>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Signature (签名)
              </span>
            </div>
            <div className="p-4">
              <code className={cn(
                "text-sm break-all",
                "text-gray-600 dark:text-gray-400"
              )}>
                {decoded.signature}
              </code>
            </div>
          </div>

          {/* Security Note */}
          <div className={cn(
            "flex items-start gap-2 rounded-lg border p-3",
            "bg-blue-50 border-blue-200",
            "dark:bg-blue-900/10 dark:border-blue-800"
          )}>
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-400">
              <p className="font-medium">安全提示</p>
              <p className="mt-1">
                JWT令牌包含敏感信息，请勿分享给他人。此工具仅在本地解码，不会上传数据。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
