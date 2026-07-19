<div align="center">
  <br/>
  <img src="public/logo.svg" width="80" height="80" alt="SKU Foundry Logo" />
  <h1>SKU Foundry</h1>
  <p><strong>AI 驱动的产品 Mockup 生成工具</strong></p>
  <p>上传 Logo 与产品图，通过 Qwen / Doubao 原生多图融合实现真实光照、阴影与透视合成</p>

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

SKU Foundry 是一款面向电商品牌、产品设计师和营销团队的浏览器端 SPA 应用。提供从 **素材上传 → Studio 设计 → AI 合成 → 导出下载** 的完整工作流，v1.2.0 专注于 **Qwen** 和 **Doubao** 两家供应商的原生多图融合及画布精确定位。

---

## 功能特性


| 特性                | 说明                                                                            |
| ------------------- | ------------------------------------------------------------------------------- |
| **完整工作流**      | 上传 → Studio 设计 → 画廊下载，三步完成                                       |
| **AI 融合**         | 字节豆包 / 阿里 Qwen 原生多图融合（多图直接合成），无中间文字损失               |
| **AI 资产生成**     | 通过文字描述直接生成 Logo 和产品图片                                            |
| **交互式画布**      | 拖拽定位、滚轮缩放、所见即所得的 Logo 布局                                      |
| **提示词库**        | 26 条中英双语模板（布料服饰、硬质产品、数码配件、高端质感、风格美学），默认中文 |
| **连接测试**        | 在 AI 设置中一键测试 API 连通性并显示响应延迟                                   |
| **玻璃拟态暗色 UI** | 统一暗色主题、响应式布局、移动端适配                                            |
| **启动动画**        | Box Bot 角色动画开场                                                            |

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
│   └── aiService.ts          # AI API 调用层（Qwen/Doubao 路由、图像融合、素材生成）
└── data/
    └── prompts.ts            # 提示词库（5 类 26 条模板）
```

---

## AI 供应商配置

点击右上角 **AI 设置** 配置 API Key 和接入地址。

### 支持的供应商


| 供应商    | 模型                                 | 能力                        |
| --------- | ------------------------------------ | --------------------------- |
| 字节豆包  | Seedream 5.0 Pro                     | 原生多图融合、文生图（T2I） |
| 阿里 Qwen | Qwen-Image 2.0 ＆Qwen-Image 2.0 Pro | 原生多图融合、文生图（T2I） |

### 生成流程

v1.2.0 统一使用 **原生多图融合** 模式：将产品图 + Logo 图 + 文字指令直接传入 AI 模型，一步生成融合后的 Mockup，无需中间文字描述，信息零损失。画布坐标系统采用 DOM 实测，确保 Logo 位置精准传递。

> 如需调整供应商，在 AI 设置弹窗中切换即可；内置的"测试连接"按钮可验证配置是否生效。

---

## 使用指南

### 1. 上传素材

在 **Assets** 页面上传产品图和 Logo（支持拖拽或点击上传），也可以通过 AI 直接生成素材（需要先配置 AI）。

### 2. 配置 AI

点击右上角 **AI 设置**，选择供应商并填入 API Key、Base URL、模型名，然后点击 **测试连接** 验证。

### 3. Studio 设计

- 选择产品图作为底图
- 点击 Logo 添加到画布
- 拖拽移动位置，滚轮调整大小
- 从提示词库选择专业模板，或自定义指令

### 4. 生成与下载

点击 **生成产品**，AI 将 Logo 融合到产品表面。在 **作品集** 中预览和下载结果。

---

## 技术栈


| 技术                                              | 用途                        |
| ------------------------------------------------- | --------------------------- |
| [React 19](https://react.dev/)                    | UI 框架                     |
| [Vite 6](https://vitejs.dev/)                     | 构建工具                    |
| [TypeScript 5.8](https://www.typescriptlang.org/) | 类型安全                    |
| [Tailwind CSS](https://tailwindcss.com/)          | 原子化样式                  |
| [Lucide React](https://lucide.dev/)               | 图标库                      |
| [ESM CDN](https://esm.sh/)                        | 运行时依赖加载              |
| [Google Fonts](https://fonts.google.com/)         | Inter + JetBrains Mono 字体 |

---

## 注意事项

- 使用前需自行向各 AI 供应商申请 API Key
- 上传内容需确保拥有合法权利，不得侵犯他人知识产权
- 当前为纯前端 SPA，所有数据仅在浏览器本地存储

---

## License

[Apache-2.0](LICENSE) 

---

<div align="center">
  <p>简体中文 · <a href="docs/i18n/README.en.md">English</a></p>
</div>
