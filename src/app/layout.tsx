import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DevPrivacy Toolkit - 离线开发者工具箱",
  description: "100%离线运行的开发者隐私工具箱。JSON格式化、Base64编解码、URL编码解码、JWT解码、正则测试。零数据上传，保护您的代码安全。",
  keywords: ["developer tools", "privacy", "offline", "JSON", "Base64", "URL", "JWT", "regex", "开发者工具"],
  authors: [{ name: "DevPrivacy" }],
  manifest: "/dev-privacy-toolkit/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "DevPrivacy Toolkit - 离线开发者工具箱",
    description: "100%离线运行的开发者隐私工具箱，保护您的代码安全",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
