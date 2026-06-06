# DevPrivacy Toolkit

<p align="center">
  <img src="https://img.shields.io/badge/100%25-Offline-success?style=flat-square" alt="100% Offline">
  <img src="https://img.shields.io/badge/PWA-Supported-blue?style=flat-square" alt="PWA">
  <img src="https://img.shields.io/badge/Next.js-16.2.7-black?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind">
</p>

<p align="center">
  <strong>离线开发者隐私工具箱</strong> — 所有数据处理在本地完成，零数据上传
</p>

[English](#english) | [中文](#中文)

---

## 中文

### 特性

- **100% 离线运行** — 所有工具在浏览器本地执行，无需网络连接
- **零数据上传** — 您的敏感数据永远不会离开本机
- **PWA 支持** — 可安装为桌面应用，离线可用
- **8 种核心工具** — 覆盖开发日常所需
- **暗色/亮色主题** — 自动跟随系统偏好
- **键盘快捷键** — `Ctrl+K` 搜索，`Esc` 返回
- **响应式设计** — 适配桌面和移动设备

### 工具列表

| 工具 | 功能 | 图标 |
|------|------|------|
| JSON 工具 | 格式化、压缩、转义、反转义 | 📋 |
| Base64 工具 | 编码、解码、文件转换 | 🔐 |
| URL 工具 | 编码、解码、参数解析 | 🌐 |
| JWT 工具 | 解码、验证令牌、过期检查 | 🔑 |
| 正则表达式工具 | 测试、匹配、替换、常用模式 | 🔍 |
| HTML 实体工具 | 编码、解码、实体对照表 | 📝 |
| 哈希计算工具 | MD5、SHA-1、SHA-256、SHA-512 | 🔒 |
| 时间戳工具 | 时间戳与日期互转、自动识别 | ⏰ |

### 安全承诺

```
✅ 无后端服务器
✅ 无数据收集
✅ 无 Cookie
✅ 无追踪脚本
✅ 开源可审计
```

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/dfhhvc/dev-privacy-toolkit.git
cd dev-privacy-toolkit

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建静态站点
npm run build
```

### 部署

本项目使用 Next.js 静态导出，可部署到任何静态托管服务：

- **GitHub Pages** — 直接推送 `dist` 目录
- **Vercel** — 自动部署
- **Netlify** — 拖拽部署
- **Cloudflare Pages** — 自动构建

### 技术栈

- [Next.js](https://nextjs.org/) — React 框架
- [TypeScript](https://www.typescriptlang.org/) — 类型安全
- [Tailwind CSS](https://tailwindcss.com/) — 样式
- [Lucide Icons](https://lucide.dev/) — 图标

### 浏览器支持

| 浏览器 | 版本 |
|--------|------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

### 许可证

[MIT](LICENSE) © DevPrivacy

---

## English

### Features

- **100% Offline** — All tools run locally in your browser
- **Zero Data Upload** — Your sensitive data never leaves your machine
- **PWA Support** — Install as desktop app, works offline
- **8 Core Tools** — Covering daily development needs
- **Dark/Light Theme** — Auto-follows system preference
- **Keyboard Shortcuts** — `Ctrl+K` search, `Esc` back
- **Responsive Design** — Desktop and mobile ready

### Tools

| Tool | Description |
|------|-------------|
| JSON Tool | Format, minify, escape, unescape |
| Base64 Tool | Encode, decode, file conversion |
| URL Tool | Encode, decode, parameter parsing |
| JWT Tool | Decode, verify, expiration check |
| Regex Tool | Test, match, replace, common patterns |
| HTML Entity Tool | Encode, decode, entity reference |
| Hash Tool | MD5, SHA-1, SHA-256, SHA-512 |
| Timestamp Tool | Convert between timestamp and date |

### Security Promise

```
✅ No backend server
✅ No data collection
✅ No cookies
✅ No tracking scripts
✅ Open source & auditable
```

### Development

```bash
git clone https://github.com/dfhhvc/dev-privacy-toolkit.git
cd dev-privacy-toolkit
npm install
npm run dev
```

### License

[MIT](LICENSE) © DevPrivacy
