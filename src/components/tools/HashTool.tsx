/**
 * Hash Tool Component
 * Calculate MD5, SHA-1, SHA-256, SHA-512 hashes
 * Top-tier implementation with file support
 */

"use client";

import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/hooks/useToast";
import { copyToClipboard } from "@/lib/utils";
import {
  Fingerprint,
  Copy,
  Trash2,
  FileUp,
  Check,
} from "lucide-react";

type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-512";

interface HashResult {
  algorithm: HashAlgorithm;
  hash: string;
}

async function calculateHash(
  data: string | ArrayBuffer,
  algorithm: HashAlgorithm
): Promise<string> {
  const algoMap: Record<HashAlgorithm, string> = {
    MD5: "MD5",
    "SHA-1": "SHA-1",
    "SHA-256": "SHA-256",
    "SHA-512": "SHA-512",
  };

  const buffer =
    typeof data === "string"
      ? new TextEncoder().encode(data)
      : new Uint8Array(data);

  const hashBuffer = await crypto.subtle.digest(algoMap[algorithm], buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function HashTool() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<HashResult[]>([]);
  const [selectedAlgos, setSelectedAlgos] = useState<HashAlgorithm[]>([
    "MD5",
    "SHA-256",
  ]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isFileMode, setIsFileMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error: showError } = useToast();

  const calculateHashes = useCallback(async () => {
    if (!input.trim() && !isFileMode) {
      showError("请输入内容");
      return;
    }

    try {
      const newResults: HashResult[] = [];

      for (const algo of selectedAlgos) {
        const hash = await calculateHash(input, algo);
        newResults.push({ algorithm: algo, hash });
      }

      setResults(newResults);
      success(`已计算 ${newResults.length} 个哈希值`);
    } catch (err) {
      showError("哈希计算失败");
    }
  }, [input, selectedAlgos, isFileMode, success, showError]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (!arrayBuffer) return;

        try {
          const newResults: HashResult[] = [];
          for (const algo of selectedAlgos) {
            const hash = await calculateHash(arrayBuffer, algo);
            newResults.push({ algorithm: algo, hash });
          }
          setResults(newResults);
          setFileName(file.name);
          setIsFileMode(true);
          setInput("[文件内容]");
          success(`文件 "${file.name}" 哈希计算完成`);
        } catch {
          showError("文件哈希计算失败");
        }
      };
      reader.readAsArrayBuffer(file);
    },
    [selectedAlgos, success, showError]
  );

  const toggleAlgo = useCallback((algo: HashAlgorithm) => {
    setSelectedAlgos((prev) =>
      prev.includes(algo)
        ? prev.filter((a) => a !== algo)
        : [...prev, algo]
    );
  }, []);

  const handleCopy = useCallback(
    async (hash: string) => {
      const copied = await copyToClipboard(hash);
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
    setFileName(null);
    setIsFileMode(false);
  }, []);

  const algorithms: HashAlgorithm[] = ["MD5", "SHA-1", "SHA-256", "SHA-512"];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Fingerprint className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            哈希计算工具
          </h2>
        </div>
      </div>

      {/* Algorithm Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          选择算法
        </label>
        <div className="flex flex-wrap gap-2">
          {algorithms.map((algo) => (
            <button
              key={algo}
              onClick={() => toggleAlgo(algo)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                selectedAlgos.includes(algo)
                  ? "bg-blue-600 text-white dark:bg-blue-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              )}
            >
              {selectedAlgos.includes(algo) && (
                <Check className="inline h-3 w-3 mr-1" />
              )}
              {algo}
            </button>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <FileUp className="h-4 w-4 mr-2" />
          {fileName ? `已选择: ${fileName}` : "上传文件计算哈希"}
        </Button>
      </div>

      {/* Text Input */}
      {!isFileMode && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              文本内容
            </label>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <Trash2 className="h-4 w-4 mr-1" />
              清空
            </Button>
          </div>
          <Textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setIsFileMode(false);
            }}
            placeholder="输入要计算哈希的文本..."
            minRows={4}
          />
        </div>
      )}

      {/* Calculate Button */}
      <Button onClick={calculateHashes} className="w-full">
        <Fingerprint className="h-4 w-4 mr-2" />
        计算哈希
      </Button>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            计算结果
          </label>
          {results.map((result) => (
            <div
              key={result.algorithm}
              className={cn(
                "rounded-lg border overflow-hidden",
                "border-gray-200 dark:border-gray-700"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-between px-4 py-2",
                  "bg-gray-50 border-b border-gray-200",
                  "dark:bg-gray-800 dark:border-gray-700"
                )}
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {result.algorithm}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(result.hash)}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  复制
                </Button>
              </div>
              <div className="p-4">
                <code
                  className={cn(
                    "text-sm break-all font-mono",
                    "text-gray-800 dark:text-gray-200"
                  )}
                >
                  {result.hash}
                </code>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Security Note */}
      <div
        className={cn(
          "flex items-start gap-2 rounded-lg border p-3",
          "bg-blue-50 border-blue-200",
          "dark:bg-blue-900/10 dark:border-blue-800"
        )}
      >
        <Fingerprint className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="text-sm text-blue-700 dark:text-blue-400">
          <p className="font-medium">安全提示</p>
          <p className="mt-1">
            所有哈希计算在本地浏览器中完成，不会上传数据到服务器。MD5 和 SHA-1
            已不推荐用于安全场景，建议使用 SHA-256 或更高。
          </p>
        </div>
      </div>
    </div>
  );
}
