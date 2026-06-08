import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DevPrivacy Toolkit - 离线开发者工具箱",
    short_name: "DevPrivacy",
    description: "100%离线运行的开发者隐私工具箱，所有数据处理在本地完成",
    start_url: "/devvault-pro/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    orientation: "any",
    scope: "/devvault-pro/",
    lang: "zh-CN",
    icons: [
      {
        src: "/devvault-pro/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/devvault-pro/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["developer", "productivity", "utilities"],
    shortcuts: [
      {
        name: "JSON工具",
        short_name: "JSON",
        description: "快速打开JSON格式化工具",
        url: "/devvault-pro/?tool=json",
        icons: [{ src: "/devvault-pro/icon-96x96.png", sizes: "96x96" }],
      },
      {
        name: "Base64工具",
        short_name: "Base64",
        description: "快速打开Base64编解码工具",
        url: "/devvault-pro/?tool=base64",
        icons: [{ src: "/devvault-pro/icon-96x96.png", sizes: "96x96" }],
      },
    ],
  };
}
