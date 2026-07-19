import { Asset, PlacedLayer, ApiSettings, ProviderConfig } from "../types";

const getBase64Data = (dataUrl: string): string => {
  if (!dataUrl) return "";
  const parts = dataUrl.split(",");
  return parts.length > 1 ? parts[1] : parts[0];
};

const getMimeType = (dataUrl: string): string => {
  if (!dataUrl) return "image/png";
  const match = dataUrl.match(/^data:([^;]+);/);
  return match ? match[1] : "image/png";
};

const getLayoutHints = (layers: { asset: Asset; placement: PlacedLayer }[]): string => {
  let hints = "";
  layers.forEach((layer, index) => {
    const p = layer.placement;
    const vPos = p.y < 33 ? "TOP" : p.y > 66 ? "BOTTOM" : "CENTER-VERTICAL";
    const hPos = p.x < 33 ? "LEFT" : p.x > 66 ? "RIGHT" : "CENTER-HORIZONTAL";
    hints += "\n\n### LOGO " + (index + 1) + ": \"" + layer.asset.name + "\" ###";
    hints += "\nCRITICAL — The logo MUST be placed at EXACTLY these pixel coordinates:";
    hints += "\n  • X position: " + Math.round(p.x) + "% across the product (from left edge)";
    hints += "\n  • Y position: " + Math.round(p.y) + "% down the product (from top edge)";
    hints += "\n  • Region: " + vPos + "-" + hPos + " of the product";
    hints += "\n  • Scale: " + p.scale.toFixed(2) + "× of original logo size";
    hints += "\n  • Rotation: " + p.rotation + "°";
    hints += "\nWARNING: Do NOT center this logo. Place it at (" + Math.round(p.x) + "%," + Math.round(p.y) + "%) as specified.";
    hints += "\nWARNING: Do NOT stretch, squash, or crop the logo. Keep its original aspect ratio.";
  });
  return hints;
};

const callDoubaoGenerate = async (
  config: ProviderConfig,
  prompt: string,
  images?: string[]
): Promise<string> => {
  const url = config.imageGenBaseUrl.replace(/\/$/, "") + "/images/generations";
  const body: Record<string, unknown> = {
    model: config.imageModel,
    prompt,
    size: "2K",
    output_format: "png",
    watermark: false,
  };
  if (images && images.length > 0) {
    body.image = images;
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + config.apiKey,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error("Doubao generation failed (" + response.status + "): " + errText);
  }
  const data = await response.json();
  return data.data?.[0]?.url || data.data?.[0]?.b64_json;
};

const callQwenMultimodal = async (
  config: ProviderConfig,
  prompt: string,
  images?: string[]
): Promise<string> => {
  const base = config.imageGenBaseUrl.replace(/\/$/, "");
  const url = base + "/api/v1/services/aigc/multimodal-generation/generation";
  const content: { image?: string; text?: string }[] = [];
  if (images) {
    for (const img of images) {
      content.push({ image: img });
    }
  }
  content.push({ text: prompt });
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + config.apiKey,
    },
    body: JSON.stringify({
      model: config.imageModel,
      input: { messages: [{ role: "user", content }] },
      parameters: { n: 1, size: "2048*2048" },
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error("Qwen generation failed (" + response.status + "): " + errText);
  }
  const data = await response.json();
  return data.output?.choices?.[0]?.message?.content?.[0]?.image || "";
};

const callNativeFusion = async (
  config: ProviderConfig,
  product: Asset,
  layers: { asset: Asset; placement: PlacedLayer }[],
  instruction: string
): Promise<string> => {
  const layoutHints = getLayoutHints(layers);
  const posStr = layers.map(l =>
    "(" + Math.round(l.placement.x) + "%," + Math.round(l.placement.y) + "%)"
  ).join(", ");

  const prompt = [
    "========================================================================",
    "ABSOLUTE POSITION CONSTRAINT — READ THIS FIRST BEFORE GENERATING ANYTHING",
    "========================================================================",
    "",
    "The logo(s) MUST be placed EXACTLY at the position(s) specified below.",
    "This position constraint is the SINGLE MOST IMPORTANT requirement.",
    "Do NOT center any logo. Do NOT move any logo from its specified position.",
    "",
    "TARGET POSITIONS: " + posStr,
    "",
    layoutHints,
    "",
    "========================================================================",
    "POSITION REMINDER — You MUST place each logo at its exact (X%,Y%) coordinate.",
    "These coordinates are measured from the top-left of the product surface.",
    "========================================================================",
    "",
    "PRESERVATION RULES — You MUST keep ALL original image proportions:",
    "- Do NOT stretch, squash, or distort the logo shape.",
    "- Do NOT change the logo's aspect ratio.",
    "- Do NOT crop or cut off the logo.",
    "- Do NOT resize the logo beyond the specified scale factor.",
    "- Do NOT alter the product's proportions.",
    "",
    instruction,
    "",
    "--- FINAL POSITION CHECK ---",
    "Before outputting, verify: Is the logo at position " + posStr + "?",
    "If you placed the logo anywhere else — especially the center — you have made a mistake.",
    "The position " + posStr + " is NOT the center (unless 50%,50% is specified).",
    "---",
    "",
    "Composite the logo(s) onto the product at the EXACT specified position(s).",
    "Keep the logo's original aspect ratio intact.",
    "Apply realistic surface warping, natural wrinkles, proper lighting, reflections, and perspective blending.",
    "Output ONLY the resulting image.",
  ].join("\n");
  const images = [product.data, ...layers.map(l => l.asset.data)];
  if (config.provider === 'doubao') {
    return callDoubaoGenerate(config, prompt, images);
  }
  return callQwenMultimodal(config, prompt, images);
};

export const generateMockup = async (
  product: Asset,
  layers: { asset: Asset; placement: PlacedLayer }[],
  instruction: string,
  settings: ApiSettings
): Promise<string> => {
  const provider = settings.runtimeSettings.currentProvider;
  const genConfig = settings.providers[provider];
  if (!genConfig) {
    throw new Error("Provider " + provider + " not configured");
  }
  return callNativeFusion(genConfig, product, layers, instruction);
};

const testDoubaoConnection = async (config: ProviderConfig): Promise<void> => {
  const url = config.imageGenBaseUrl.replace(/\/$/, "") + "/images/generations";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + config.apiKey,
      },
      body: JSON.stringify({ model: config.imageModel, prompt: "test", n: 1, size: "1024x1024", output_format: "png" }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const errText = await response.text();
      let msg = `API 返回错误 (${response.status})`;
      try {
        const errJson = JSON.parse(errText);
        msg += ': ' + (errJson.error?.message || errJson.message || JSON.stringify(errJson));
      } catch {
        if (errText) msg += ': ' + errText.slice(0, 200);
      }
      throw new Error(msg);
    }
    await response.json();
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('连接超时（15秒），请检查 Base URL 或网络');
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
};

const testQwenConnection = async (config: ProviderConfig): Promise<void> => {
  const base = config.imageGenBaseUrl.replace(/\/$/, "");
  const url = base + "/api/v1/services/aigc/multimodal-generation/generation";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + config.apiKey,
      },
      body: JSON.stringify({
        model: config.imageModel,
        input: { messages: [{ role: "user", content: [{ text: "test" }] }] },
        parameters: { n: 1, size: "1024*1024" },
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const errText = await response.text();
      let msg = `API 返回错误 (${response.status})`;
      try {
        const errJson = JSON.parse(errText);
        msg += ': ' + (errJson.error?.message || errJson.message || JSON.stringify(errJson));
      } catch {
        if (errText) msg += ': ' + errText.slice(0, 200);
      }
      throw new Error(msg);
    }
    await response.json();
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('连接超时（15秒），请检查 Base URL 或网络');
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const testProviderConnection = async (config: ProviderConfig): Promise<void> => {
  if (config.provider === 'doubao') return testDoubaoConnection(config);
  if (config.provider === 'qwen') return testQwenConnection(config);
  throw new Error("Unsupported provider: " + config.provider);
};

export const generateAsset = async (
  prompt: string,
  type: "logo" | "product",
  settings: ApiSettings
): Promise<string> => {
  const provider = settings.runtimeSettings.currentProvider;
  const config = settings.providers[provider];
  if (!config) throw new Error("Provider " + provider + " not configured");
  const enhancedPrompt = type === "logo"
    ? "A high-quality, professional vector-style logo design of a " + prompt + ". Isolated on a pure white background. Minimalist and clean, single distinct logo."
    : "Professional studio product photography of a single " + prompt + ". Ghost mannequin style or flat lay. Front view, isolated on neutral background. High resolution, photorealistic. Single object only, no stacks, no duplicates.";
  if (config.provider === 'doubao') {
    return callDoubaoGenerate(config, enhancedPrompt);
  }
  return callQwenMultimodal(config, enhancedPrompt);
};
