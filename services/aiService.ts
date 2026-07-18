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
  let layoutHints = "";
  layers.forEach((layer, index) => {
    const vPos = layer.placement.y < 33 ? "top" : layer.placement.y > 66 ? "bottom" : "center";
    const hPos = layer.placement.x < 33 ? "left" : layer.placement.x > 66 ? "right" : "center";
    layoutHints += "\n- Logo/Graphic " + (index + 1) + " (" + layer.asset.name + "): Place at " + vPos + "-" + hPos + " area (approx coords: " + Math.round(layer.placement.x) + "% x, " + Math.round(layer.placement.y) + "% y on the canvas). Scale: " + layer.placement.scale.toFixed(2) + ", Rotation: " + layer.placement.rotation + "\u00b0";
  });
  return layoutHints;
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
  const prompt = [
    instruction,
    "Layout:",
    layoutHints,
    "Composite the provided logo/graphic images onto the product to create a realistic mockup.",
    "Follow the Layout Guidance for positioning, scaling, and rotation.",
    "Ensure realistic surface warping, natural wrinkles, proper lighting, reflections, and perspective blending.",
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
