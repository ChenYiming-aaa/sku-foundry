<div align="center">
  <br/>
  <img src="public/logo.svg" width="80" height="80" alt="SKU Foundry Logo" />
  <h1>SKU Foundry</h1>
  <p><strong>AI 驱动的产品 Mockup 生成工具</strong></p>
  <p>上传 Logo 与产品图，通过多供应商 AI 实现真实光照、阴影与透视融合</p>

  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&style=flat-square" alt="React 19" />
    <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&style=flat-square" alt="Vite 6" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&style=flat-square" alt="TypeScript 5.8" />
    <img src="https://img.shields.io/badge/License-Apache--2.0-blue?style=flat-square" alt="License" />
    <img src="https://img.shields.io/badge/Tailwind-latest-06B6D4?logo=tailwindcss&style=flat-square" alt="Tailwind CSS" />
  </p>

  <p><b>简体中文</b> · <a href="docs/i18n/README.en.md">English</a></p>
  <br/>
</div>

---

## 概述

SKU Foundry 是一款面向电商品牌、产品设计师和营销团队的浏览器端 SPA 应用。提供从 **素材上传 → Studio 设计 → AI 合成 → 导出下载** 的完整工作流，支持 **原生多图融合** 和 **双阶段配对** 两种生成模式，兼容多家国内 AI 供应商。

---

## 功能特性

| 特性 | 说明 |
|------|------|
| **完整工作流** | 上传 → Studio 设计 → 画廊下载，三步完成 |
| **多供应商 AI** | 字节豆包 / 阿里 Qwen / 腾讯混元 / 月之暗面 Kimi / 小米 MiMo / 百度千帆 / 零一万物 / 自定义端点 |
| **两种生成模式** | 原生多图融合（多图直接合成）与双阶段（视觉分析 + 文生图） |
| **交互式画布** | 拖拽定位、滚轮缩放、所见即所得的 Logo 布局 |
| **提示词库** | 26 条分类模板（布料服饰、硬质产品、数码配件、高端质感、风格美学） |
| **AI 生成素材** | 通过文字描述直接生成 Logo 和产品图片 |
| **玻璃拟态暗色 UI** | 统一暗色主题、响应式布局、移动端适配 |
| **启动动画** | Box Bot 角色动画开场 |

---

## 快速开始

### 前置要求

- Node.js >= 18

### 安装与运行

```bash
npm install
npm run dev       # 启动开发服务器
npm run build     # 生产构建
npm run preview   # 预览构建产物
```

---

## 项目结构

```
src/
├── App.tsx                   # 主应用（Dashboard / Assets / Studio / Gallery + 开场动画）
├── index.tsx                 # React 入口
├── index.css                 # 全局样式
├── index.html                # 入口 HTML（Tailwind CDN + importmap）
├── types.ts                  # TypeScript 类型定义
├── components/
│   ├── ApiSettingsModal.tsx  # AI 供应商配置弹窗
│   ├── Button.tsx            # 通用按钮组件
│   └── FileUploader.tsx      # 文件拖拽上传组件
├── services/
│   └── aiService.ts          # AI API 调用层（多供应商路由、图像融合、素材生成）
└── data/
    └── prompts.ts            # 提示词库（5 类 26 条模板）
```

---

## AI 供应商配置

点击右上角 **AI Settings** 配置 API Key 和接入地址。

### 支持的供应商

| 供应商 | 模型 | 能力 |
|--------|------|------|
| 字节豆包 | Seedream 5.0 Pro | 原生融合、视觉分析、图生图 |
| 阿里 Qwen | Qwen-Image 2.0 Pro | 原生融合、视觉分析、图生图 |
| 腾讯混元 | Hunyuan 3.0 | 视觉分析、图生图（异步） |
| 月之暗面 Kimi | Kimi K3 | 仅视觉分析 |
| 小米 MiMo | MiMo v2.5 | 仅视觉分析 |
| 零一万物 Yi | Yi-Vision | 仅视觉分析 |
| 百度千帆 | ERNIE 4.5 Turbo VL | 仅视觉分析 |
| 自定义 | 任意 OpenAI 兼容端点 | 可配置 |

### 生成模式

| 模式 | 说明 |
|------|------|
| **原生多图融合** | 多张参考图 + 文字指令 → 直接合成，无需中间文字描述，信息零损失 |
| **双阶段模式** | Vision 模型分析构图 → 独立图生图模型渲染最终图像 |

### 计费模式

- **按量付费** — 按实际调用量计费
- **Token Plan** — 预购套餐
- **Coding Plan** — 开发者订阅计划

---

## 使用指南

### 1. 上传素材

在 **Assets** 页面上传产品图和 Logo（支持拖拽或点击上传），也可以通过 AI 直接生成素材。

### 2. Studio 设计

- 选择产品图作为底图
- 点击 Logo 添加到画布
- 拖拽移动位置，滚轮调整大小
- 从提示词库选择专业模板，或自定义指令

### 3. 生成与下载

点击 **Generate Mockup**，AI 将 Logo 融合到产品表面。在 **Gallery** 中预览和下载结果。

---

## 技术栈

| 技术 | 用途 |
|------|------|
| [React 19](https://react.dev/) | UI 框架 |
| [Vite 6](https://vitejs.dev/) | 构建工具 |
| [TypeScript 5.8](https://www.typescriptlang.org/) | 类型安全 |
| [Tailwind CSS](https://tailwindcss.com/) | 原子化样式 |
| [Lucide React](https://lucide.dev/) | 图标库 |
| [ESM CDN](https://esm.sh/) | 运行时依赖加载 |
| [Google Fonts](https://fonts.google.com/) | Inter + JetBrains Mono 字体 |

---

## 注意事项

- 使用前需自行向各 AI 供应商申请 API Key
- 上传内容需确保拥有合法权利，不得侵犯他人知识产权
- 当前为纯前端 SPA，所有数据仅在浏览器本地存储
- UI 为中文，代码注释为英文

---

## 优化文档

- `PROMPT_LIBRARY_UI_OPTIMIZATION.md` — 提示词库 UI 动效/交互/可访问性优化
- `OPTIMIZATION_PLAN.md` — 阶段性优化计划

---

## License

[Apache-2.0](LICENSE) © ChenYiming-aaa

---

<div align="center">
  <p>简体中文 · <a href="docs/i18n/README.en.md">English</a></p>
</div>
