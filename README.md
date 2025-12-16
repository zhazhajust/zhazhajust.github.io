# JayZ Blog - 个人技术博客

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-brightgreen)](https://zhazhajust.github.io)
[![Hexo](https://img.shields.io/badge/Hexo-7.3.0-blue)](https://hexo.io)
[![Fluid Theme](https://img.shields.io/badge/Theme-Fluid-orange)](https://github.com/fluid-dev/hexo-theme-fluid)

基于 Hexo 框架构建的个人技术博客，专注于分享编程技术、算法、数据科学和开发经验。

## ✨ 特性

- 🚀 **快速构建**：基于 Hexo 静态网站生成器，生成速度快
- 📱 **响应式设计**：适配各种设备屏幕尺寸
- 🎨 **现代化界面**：使用 Fluid 主题，界面简洁美观
- 🔍 **搜索功能**：支持文章内容搜索
- 📊 **代码高亮**：支持多种编程语言的语法高亮
- 📝 **Markdown 支持**：使用 Markdown 编写文章，简单高效
- 🌐 **多语言支持**：支持中英文内容

## 🛠️ 技术栈

- **框架**: [Hexo](https://hexo.io/) 7.3.0
- **主题**: [Fluid](https://github.com/fluid-dev/hexo-theme-fluid) 1.9.8
- **部署**: GitHub Pages
- **构建工具**: npm

## 🚀 快速开始

### 环境要求

- Node.js 14.0+ 
- npm 6.0+

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/zhazhajust/zhazhajust.github.io.git
   cd zhazhajust.github.io
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **本地开发**
   ```bash
   # 启动本地服务器
   npm run server
   # 或使用 hexo 命令
   hexo server
   ```

   访问 http://localhost:4000 查看效果

### 常用命令

```bash
# 清理缓存
npm run clean

# 生成静态文件
npm run build

# 部署到 GitHub Pages
npm run deploy

# 新建文章
hexo new "文章标题"
```

## 📁 项目结构

```
zhazhajust.github.io/
├── source/           # 源文件目录
│   ├── _posts/      # 文章目录
│   ├── about/       # 关于页面
│   └── img/         # 图片资源
├── scaffolds/        # 模板文件
├── _config.yml      # Hexo 配置文件
├── _config.fluid.yml # Fluid 主题配置
├── package.json     # 项目依赖
└── README.md        # 项目说明
```

## 📝 写作指南

### 新建文章

```bash
hexo new "文章标题"
```

文章将创建在 `source/_posts/` 目录下，使用 Markdown 格式编写。

### 文章格式

```markdown
---
title: 文章标题
date: 2024-01-01
tags: [标签1, 标签2]
categories: 分类
---

<!-- 文章内容 -->
```

## 🌐 部署

本项目使用 GitHub Pages 自动部署，当代码推送到 `main` 分支时，GitHub Actions 会自动构建并部署到 `gh-pages` 分支。

### 手动部署

```bash
# 生成静态文件并部署
npm run deploy
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系

- 博客: [https://zhazhajust.github.io](https://zhazhajust.github.io)
- GitHub: [@zhazhajust](https://github.com/zhazhajust)

---

⭐ 如果这个项目对你有帮助，请给它一个 star！
