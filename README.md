<div align="center">
  <br/>
  <img src="public/logo.svg" width="80" height="80" alt="SKU Foundry Logo" />
  <h1>SKU Foundry</h1>
  <p><strong>AI-Powered Product Mockup Generator</strong></p>
  <p>Upload logos & product images — let multi-vendor AI composite them with realistic lighting, shadows, and perspective warping.</p>

  <p>
    <a href="#features"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&style=flat-square" alt="React 19" /></a>
    <a href="#features"><img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&style=flat-square" alt="Vite 6" /></a>
    <a href="#features"><img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&style=flat-square" alt="TypeScript 5.8" /></a>
    <img src="https://img.shields.io/badge/License-Apache--2.0-blue?style=flat-square" alt="License" />
    <img src="https://img.shields.io/badge/Tailwind-latest-06B6D4?logo=tailwindcss&style=flat-square" alt="Tailwind CSS" />
  </p>
  <br/>
</div>

---

## Overview

SKU Foundry is a browser-based SPA for e-commerce brands, product designers, and marketing teams. It provides a complete workflow from **asset upload → visual design → AI compositing → export**, supporting both **Native Multi-Image Fusion** and **Dual-Stage** generation modes across multiple Chinese AI vendors.

> Built for the Chinese AI ecosystem — supports Alibaba Qwen, ByteDance Doubao, Tencent Hunyuan, Moonshot Kimi, Xiaomi MiMo, Baidu Qianfan, Yi, and custom OpenAI-compatible endpoints.

---

<a name="features"></a>

## Features

| Feature | Description |
|---------|-------------|
| **End-to-End Workflow** | Upload → Studio design → Gallery download in 3 steps |
| **Multi-Vendor AI** | Doubao / Qwen / Hunyuan / Kimi / MiMo / Yi / Baidu + custom endpoints |
| **2 Generation Modes** | Native Fusion (direct multi-image composite) & Dual Stage (Vision analysis → T2I) |
| **Interactive Canvas** | Drag-to-position, scroll-to-scale, WYSIWYG logo placement |
| **Prompt Library** | 26 categorized templates (fabric, hard goods, tech, luxury, aesthetics) |
| **AI Asset Generation** | Generate logos & product images from text prompts |
| **Glassmorphism Dark UI** | Consistent dark theme, responsive layout, mobile-friendly |
| **Intro Animation** | Playful Box Bot character animation on startup |

---



## Getting Started

### Prerequisites

- Node.js >= 18

### Install & Run

```bash
npm install
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
```

---

## Project Structure

```
src/
├── App.tsx                   # Main app (Dashboard/Assets/Studio/Gallery + Intro animation)
├── index.tsx                 # React entry point
├── index.css                 # Global styles
├── index.html                # Entry HTML (Tailwind CDN + importmap)
├── types.ts                  # TypeScript type definitions
├── components/
│   ├── ApiSettingsModal.tsx  # AI provider configuration modal
│   ├── Button.tsx            # Reusable button component
│   └── FileUploader.tsx      # Drag-and-drop file upload component
├── services/
│   └── aiService.ts          # AI API layer (multi-provider routing, fusion, generation)
└── data/
    └── prompts.ts            # Prompt library (5 categories, 26 templates)
```

---

## AI Provider Configuration

Click **AI Settings** in the top-right corner to configure API keys and endpoints.

### Supported Providers

| Provider | Model | Capabilities |
|----------|-------|-------------|
| ByteDance Doubao | Seedream 5.0 Pro | Native Fusion, Vision, Image Gen |
| Alibaba Qwen | Qwen-Image 2.0 Pro | Native Fusion, Vision, Image Gen |
| Tencent Hunyuan | Hunyuan 3.0 | Vision, Image Gen (async) |
| Moonshot Kimi | Kimi K3 | Vision only |
| Xiaomi MiMo | MiMo v2.5 | Vision only |
| Yi (Lingyiwanwu) | Yi-Vision | Vision only |
| Baidu Qianfan | ERNIE 4.5 Turbo VL | Vision only |
| Custom | Any OpenAI-compatible | Configurable |

### Generation Modes

| Mode | Description |
|------|-------------|
| **Native Fusion** | Input multiple images + text instruction → direct composite output, no information loss |
| **Dual Stage** | Vision model analyzes layout → separate T2I model renders the final image |

### Billing Modes

- **PAYG** — Pay-as-you-go
- **Token Plan** — Pre-purchased token packages
- **Coding Plan** — Developer subscription plans

---

## Usage Guide

### 1. Upload Assets

On the **Assets** page, upload product base images and logos (drag & drop or click). You can also generate assets via AI by describing what you need.

### 2. Design in Studio

- Select a product image as the base layer
- Click logos to add them to the canvas
- Drag to reposition, scroll to resize
- Choose from the prompt library or write custom instructions

### 3. Generate & Export

Click **Generate Mockup** — AI composites the logos onto the product. View and download results in the **Gallery**.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev/) | UI framework |
| [Vite 6](https://vitejs.dev/) | Build tool |
| [TypeScript 5.8](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Lucide React](https://lucide.dev/) | Icon library |
| [ESM CDN](https://esm.sh/) | Runtime dependency loading |
| [Google Fonts](https://fonts.google.com/) | Inter + JetBrains Mono |

---

## Notes

- API keys must be obtained from each AI provider separately
- You must have the rights to all uploaded content
- This is a client-side SPA — all data stays in your browser locally
- i18n: UI is currently in Chinese, code comments in English

---

## Optimization Docs

- `PROMPT_LIBRARY_UI_OPTIMIZATION.md` — Prompt library UI animations, interactions, and accessibility
- `OPTIMIZATION_PLAN.md` — Phased optimization roadmap

---

## License

[Apache-2.0](LICENSE) © ChenYiming-aaa

---

<div align="center">
  <p>Made with ❤️ for the open-source community</p>
</div>
