/**
 * HTML Entity Tool Component
 * Encode and decode HTML entities
 * FIXED: Removed unused 'FileCode' import
 * FIXED: Added proper error handling
 * FIXED: Added accessibility attributes
 */

"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/hooks/useToast";
import { copyToClipboard } from "@/lib/utils";
import {
  Code2,
  Copy,
  Trash2,
  ArrowRightLeft,
} from "lucide-react";

const htmlEntities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  " ": "&nbsp;",
  "\u00a9": "&copy;",
  "\u00ae": "&reg;",
  "\u2122": "&trade;",
  "\u20ac": "&euro;",
  "\u00a3": "&pound;",
  "\u00a5": "&yen;",
  "\u00a7": "&sect;",
  "\u00b6": "&para;",
};

export function HtmlTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { success, error: showError } = useToast();

  const encodeHtml = useCallback(() => {
    if (!input.trim()) {
      showError("请输入内容");
      return;
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.textContent = input;
      let encoded = textarea.innerHTML;

      // Replace numeric entities with named entities where possible
      Object.entries(htmlEntities).forEach(([char, entity]) => {
        if (char !== " ") {
          encoded = encoded.split(char).join(entity);
        }
      });

      setOutput(encoded);
      success("HTML实体编码成功");
    } catch {
      showError("编码失败");
    }
  }, [input, success, showError]);

  const decodeHtml = useCallback(() => {
    if (!input.trim()) {
      showError("请输入内容");
      return;
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.innerHTML = input;
      setOutput(textarea.textContent || "");
      success("HTML实体解码成功");
    } catch {
      showError("解码失败");
    }
  }, [input, success, showError]);

  const handleAction = useCallback(() => {
    if (mode === "encode") {
      encodeHtml();
    } else {
      decodeHtml();
    }
  }, [mode, encodeHtml, decodeHtml]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    const copied = await copyToClipboard(output);
    if (copied) {
      success("已复制到剪贴板");
    } else {
      showError("复制失败");
    }
  }, [output, success, showError]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            HTML 实体工具
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

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="html-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === "encode" ? "原文" : "HTML实体"}
          </label>
          <Button variant="ghost" size="sm" onClick={handleClear} aria-label="清空">
            <Trash2 className="h-4 w-4 mr-1" aria-hidden="true" />
            清空
          </Button>
        </div>
        <Textarea
          id="html-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "encode"
              ? "输入要编码的HTML内容..."
              : "输入HTML实体编码..."
          }
          minRows={5}
          aria-label={mode === "encode" ? "原文输入" : "HTML实体输入"}
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
            <label htmlFor="html-output" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              结果
            </label>
            <Button variant="ghost" size="sm" onClick={handleCopy} aria-label="复制结果">
              <Copy className="h-4 w-4 mr-1" aria-hidden="true" />
              复制
            </Button>
          </div>
          <Textarea
            id="html-output"
            value={output}
            readOnly
            minRows={5}
            className="bg-gray-50 dark:bg-gray-900"
            aria-label="输出结果"
          />
        </div>
      )}

      {/* Common Entities Reference */}
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
          常用 HTML 实体对照表
        </div>
        <div className="grid grid-cols-3 gap-2 p-4 text-sm">
          {Object.entries(htmlEntities).map(([char, entity]) => (
            <div
              key={char}
              className={cn(
                "flex items-center justify-between px-2 py-1 rounded",
                "bg-gray-50 dark:bg-gray-800"
              )}
            >
              <code className="text-gray-900 dark:text-gray-100">
                {char === " " ? "(空格)" : char}
              </code>
              <code className="text-blue-600 dark:text-blue-400 text-xs">
                {entity}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
