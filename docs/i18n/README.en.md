<div align="center">
  <br/>
  <img src="../../public/logo.svg" width="80" height="80" alt="SKU Foundry Logo" />
  <h1>SKU Foundry</h1>
  <p><strong>AI-Powered Product Mockup Generator</strong></p>
  <p>Upload logos & product images — let Qwen / Doubao native fusion composite them with realistic lighting, shadows, and perspective warping.</p>

  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&style=flat-square" alt="React 19" />
    <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&style=flat-square" alt="Vite 6" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&style=flat-square" alt="TypeScript 5.8" />
    <img src="https://img.shields.io/badge/License-Apache--2.0-blue?style=flat-square" alt="License" />
    <img src="https://img.shields.io/badge/Tailwind-latest-06B6D4?logo=tailwindcss&style=flat-square" alt="Tailwind CSS" />
  </p>

  <p><a href="../../README.md">简体中文</a> · <b>English</b></p>
  <br/>
</div>

---

## Overview

SKU Foundry is a browser-based SPA for e-commerce brands, product designers, and marketing teams. It provides a complete workflow from **asset upload → visual design → AI compositing → export**, using native multi-image fusion from **Qwen** and **Doubao**.

> v1.1.0 focuses on native multi-image fusion — no dual-stage pairing, no intermediate text generation.

---

## Features

| Feature | Description |
|---------|-------------|
| **End-to-End Workflow** | Upload → Studio design → Gallery download in 3 steps |
| **AI Fusion** | Doubao / Qwen native multi-image fusion (direct composite, no text loss) |
| **AI Asset Generation** | Generate logos & product images from text prompts |
| **Interactive Canvas** | Drag-to-position, scroll-to-scale, WYSIWYG logo placement |
| **Prompt Library** | 26 bilingual templates (Chinese/English toggle, default Chinese) across 5 categories |
| **Connection Test** | One-click API test in AI Settings with latency display |
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
│   └── aiService.ts          # AI API layer (Qwen/Doubao routing, fusion, generation)
└── data/
    └── prompts.ts            # Prompt library (5 categories, 26 templates)
```

---

## AI Provider Configuration

Click **AI Settings** in the top-right corner to configure API keys and endpoints.

### Supported Providers

| Provider | Model | Capabilities |
|----------|-------|-------------|
| ByteDance Doubao | Seedream 5.0 Pro | Native Fusion, Text-to-Image |
| Alibaba Qwen | Qwen-Image 2.0 Pro | Native Fusion, Text-to-Image |

### Generation Flow

v1.1.0 uses **Native Multi-Image Fusion** exclusively: product image + logo image + text prompt are sent directly to the AI model, producing the composited mockup in one step — no intermediate text description, zero information loss.

> Switch providers in the AI Settings modal. Use the built-in **Test Connection** button to verify your configuration.

---

## Usage Guide

### 1. Upload Assets

On the **Assets** page, upload product base images and logos (drag & drop or click). You can also generate assets via AI (configure AI first).

### 2. Configure AI

Click **AI Settings** (top-right), select a provider, fill in API Key, Base URL, Model name, then click **Test Connection** to verify.

### 3. Design in Studio

- Select a product image as the base layer
- Click logos to add them to the canvas
- Drag to reposition, scroll to resize
- Choose from the prompt library or write custom instructions

### 4. Generate & Export

Click **Generate** — AI composites the logos onto the product. View and download results in the **Gallery**.

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



## License

[Apache-2.0](../../LICENSE) © ChenYiming-aaa

---

<div align="center">
  <p><a href="../../README.md">简体中文</a> · English</p>
</div>
