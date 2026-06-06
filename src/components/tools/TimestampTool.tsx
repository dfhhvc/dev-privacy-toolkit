/**
 * Timestamp Tool Component
 * Convert between timestamps and human-readable dates
 * Top-tier implementation with multiple formats
 */

"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { copyToClipboard } from "@/lib/utils";
import {
  Clock,
  Copy,
  Trash2,
  Calendar,
  ArrowRightLeft,
} from "lucide-react";

interface TimeInfo {
  label: string;
  value: string;
}

export function TimestampTool() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<TimeInfo[]>([]);
  const [mode, setMode] = useState<"timestamp-to-date" | "date-to-timestamp">(
    "timestamp-to-date"
  );
  const { success, error: showError } = useToast();

  const parseTimestamp = useCallback(() => {
    if (!input.trim()) {
      showError("请输入时间戳");
      return;
    }

    try {
      let timestamp = parseInt(input.trim());

      // Auto-detect seconds vs milliseconds
      const isSeconds = timestamp < 10000000000;
      if (isSeconds) {
        timestamp *= 1000;
      }

      const date = new Date(timestamp);

      if (isNaN(date.getTime())) {
        throw new Error("无效的时间戳");
      }

      const newResults: TimeInfo[] = [
        { label: "本地时间", value: date.toLocaleString("zh-CN") },
        { label: "UTC时间", value: date.toUTCString() },
        { label: "ISO 8601", value: date.toISOString() },
        {
          label: "日期",
          value: date.toLocaleDateString("zh-CN"),
        },
        {
          label: "时间",
          value: date.toLocaleTimeString("zh-CN"),
        },
        {
          label: "Unix时间戳(秒)",
          value: Math.floor(date.getTime() / 1000).toString(),
        },
        {
          label: "Unix时间戳(毫秒)",
          value: date.getTime().toString(),
        },
        {
          label: "年份",
          value: date.getFullYear().toString(),
        },
        {
          label: "月份",
          value: (date.getMonth() + 1).toString(),
        },
        {
          label: "日期",
          value: date.getDate().toString(),
        },
        {
          label: "星期",
          value: ["日", "一", "二", "三", "四", "五", "六"][date.getDay()],
        },
        {
          label: "小时",
          value: date.getHours().toString().padStart(2, "0"),
        },
        {
          label: "分钟",
          value: date.getMinutes().toString().padStart(2, "0"),
        },
        {
          label: "秒",
          value: date.getSeconds().toString().padStart(2, "0"),
        },
      ];

      setResults(newResults);
      success("时间戳转换成功");
    } catch (err) {
      showError(err instanceof Error ? err.message : "转换失败");
    }
  }, [input, success, showError]);

  const parseDate = useCallback(() => {
    if (!input.trim()) {
      showError("请输入日期");
      return;
    }

    try {
      const date = new Date(input.trim());

      if (isNaN(date.getTime())) {
        throw new Error("无效的日期格式");
      }

      const newResults: TimeInfo[] = [
        {
          label: "Unix时间戳(秒)",
          value: Math.floor(date.getTime() / 1000).toString(),
        },
        {
          label: "Unix时间戳(毫秒)",
          value: date.getTime().toString(),
        },
        { label: "本地时间", value: date.toLocaleString("zh-CN") },
        { label: "UTC时间", value: date.toUTCString() },
        { label: "ISO 8601", value: date.toISOString() },
      ];

      setResults(newResults);
      success("日期转换成功");
    } catch (err) {
      showError(err instanceof Error ? err.message : "转换失败");
    }
  }, [input, success, showError]);

  const handleAction = useCallback(() => {
    if (mode === "timestamp-to-date") {
      parseTimestamp();
    } else {
      parseDate();
    }
  }, [mode, parseTimestamp, parseDate]);

  const handleCopy = useCallback(
    async (value: string) => {
      const copied = await copyToClipboard(value);
      if (copied) {
        success("已复制到剪贴板");
      } else {
        showError("复制失败");
      }
    },
    [success, showError]
  );

  const handleClear = useCallback(() => {
    setInput("");
    setResults([]);
  }, []);

  const setCurrentTimestamp = useCallback(() => {
    setInput(Math.floor(Date.now() / 1000).toString());
    setMode("timestamp-to-date");
  }, []);

  const setCurrentDate = useCallback(() => {
    setInput(new Date().toISOString());
    setMode("date-to-timestamp");
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            时间戳工具
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
      >
        <button
          onClick={() => setMode("timestamp-to-date")}
          className={cn(
            "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all",
            mode === "timestamp-to-date"
              ? "bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          )}
        >
          时间戳 → 日期
        </button>
        <button
          onClick={() => setMode("date-to-timestamp")}
          className={cn(
            "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all",
            mode === "date-to-timestamp"
              ? "bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          )}
        >
          日期 → 时间戳
        </button>
      </div>

      {/* Quick Set Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={setCurrentTimestamp}>
          <Clock className="h-3 w-3 mr-1" />
          当前时间戳
        </Button>
        <Button variant="outline" size="sm" onClick={setCurrentDate}>
          <Calendar className="h-3 w-3 mr-1" />
          当前日期
        </Button>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === "timestamp-to-date" ? "时间戳" : "日期"}
          </label>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <Trash2 className="h-4 w-4 mr-1" />
            清空
          </Button>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "timestamp-to-date"
              ? "输入Unix时间戳 (秒或毫秒)..."
              : "输入日期，如 2024-01-01 或 ISO格式..."
          }
          className={cn(
            "w-full rounded-lg border px-4 py-3 text-sm",
            "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100",
            "dark:focus:ring-blue-400",
            "font-mono"
          )}
        />
        {mode === "timestamp-to-date" && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            自动识别秒级(10位)和毫秒级(13位)时间戳
          </p>
        )}
      </div>

      {/* Actions */}
      <Button onClick={handleAction} className="w-full">
        <ArrowRightLeft className="h-4 w-4 mr-2" />
        转换
      </Button>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            转换结果
          </label>
          <div
            className={cn(
              "rounded-lg border overflow-hidden",
              "border-gray-200 dark:border-gray-700"
            )}
          >
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((result) => (
                <div
                  key={result.label}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[140px]">
                    {result.label}
                  </span>
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <code
                      className={cn(
                        "text-sm break-all text-right",
                        "text-gray-900 dark:text-gray-100",
                        "font-mono"
                      )}
                    >
                      {result.value}
                    </code>
                    <button
                      onClick={() => handleCopy(result.value)}
                      className={cn(
                        "p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700",
                        "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                        "transition-colors"
                      )}
                      title="复制"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
