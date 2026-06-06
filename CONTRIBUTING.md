# Contributing to DevPrivacy Toolkit

感谢您对 DevPrivacy Toolkit 的兴趣！我们欢迎所有形式的贡献。

## 如何贡献

### 报告问题

如果您发现了 bug 或有功能建议，请通过 GitHub Issues 提交：

1. 检查是否已有类似 issue
2. 使用对应的 issue 模板
3. 提供详细的复现步骤（对于 bug）

### 提交代码

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

### 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/dfhhvc/dev-privacy-toolkit.git
cd dev-privacy-toolkit

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行代码检查
npm run lint

# 构建
npm run build
```

### 代码规范

- 使用 TypeScript 严格模式
- 组件使用函数组件 + Hooks
- 遵循现有代码风格
- 添加必要的注释

### 提交规范

- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `style:` 代码格式（不影响功能）
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

## 行为准则

- 尊重所有参与者
- 接受建设性批评
- 关注对社区最有利的事情

## 许可证

通过提交代码，您同意您的贡献将在 MIT 许可证下发布。
