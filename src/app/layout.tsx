/**
 * Root Layout
 * FIXED: Added proper lang attribute
 * FIXED: Added noscript fallback
 * FIXED: Added preconnect hints
 * FIXED: Improved metadata
 */

import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "DevPrivacy Toolkit - 离线开发者工具箱",
  description: "100%离线运行的开发者隐私工具箱。JSON格式化、Base64编解码、URL编码解码、JWT解码、正则测试。零数据上传，保护您的代码安全。",
  keywords: ["developer tools", "privacy", "offline", "JSON", "Base64", "URL", "JWT", "regex", "开发者工具", "隐私保护"],
  authors: [{ name: "DevPrivacy" }],
  manifest: "/devvault-pro/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "DevPrivacy Toolkit - 离线开发者工具箱",
    description: "100%离线运行的开发者隐私工具箱，保护您的代码安全",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevPrivacy Toolkit - 离线开发者工具箱",
    description: "100%离线运行的开发者隐私工具箱",
  },
  robots: {
    index: true,
    follow: true,
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
    <html lang="zh-CN" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <noscript>
          <div style={{
            padding: "1rem",
            backgroundColor: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "0.5rem",
            margin: "1rem",
            textAlign: "center",
          }}>
            <p style={{ margin: 0, color: "#92400e" }}>
              ⚠️ 请启用 JavaScript 以使用 DevPrivacy Toolkit。所有工具均在本地运行，无需担心隐私问题。
            </p>
          </div>
        </noscript>
        {children}
      </body>
    </html>
  )
}
