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

const callOpenAICompatibleChat = async (
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: unknown[]
): Promise<string> => {
  const url = baseUrl.replace(/\/$/, "") + "/chat/completions";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
    },
    body: JSON.stringify({ model, messages, max_tokens: 1000 }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error("OpenAI Chat API failed (" + response.status + "): " + errText);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
};

const callOpenAIImageGen = async (
  baseUrl: string,
  apiKey: string,
  model: string,
  prompt: string
): Promise<string> => {
  const url = baseUrl.replace(/\/$/, "") + "/images/generations";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
    },
    body: JSON.stringify({ model, prompt, n: 1, size: "1024x1024", response_format: "b64_json" }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error("OpenAI Image API failed (" + response.status + "): " + errText);
  }
  const data = await response.json();
  const b64 = data.data?.[0]?.b64_json || data.data?.[0]?.url;
  if (!b64) throw new Error("No image data returned from API");
  if (b64.startsWith("http")) return b64;
  return "data:image/png;base64," + b64;
};

const callDashScopeChat = async (
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: unknown[]
): Promise<string> => {
  const url = baseUrl.replace(/\/$/, "") + "/chat/completions";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
    },
    body: JSON.stringify({ model, messages, max_tokens: 1000 }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error("DashScope Chat API failed (" + response.status + "): " + errText);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || data.output?.text || "";
};

const callKimiChat = async (
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: unknown[]
): Promise<string> => {
  const processedMessages = JSON.parse(JSON.stringify(messages));
  for (const msg of processedMessages) {
    if (Array.isArray(msg.content)) {
      for (const part of msg.content) {
        if (part.type === "image_url" && part.image_url?.url) {
          const urlValue = part.image_url.url;
          if (!urlValue.startsWith("data:") && !urlValue.startsWith("ms://")) {
            const mime = getMimeType(urlValue);
            const b64 = getBase64Data(urlValue);
            part.image_url.url = "data:" + mime + ";base64," + b64;
          }
        }
      }
    }
  }
  const apiUrl = baseUrl.replace(/\/$/, "") + "/chat/completions";
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
    },
    body: JSON.stringify({ model, messages: processedMessages, max_tokens: 1000 }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error("Kimi API failed (" + response.status + "): " + errText);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
};

const callCustomAdapter = async (
  config: ProviderConfig,
  stage: "chat" | "image",
  payload: unknown
): Promise<string> => {
  const customConfig = (config as Record<string, unknown>).customConfig as Record<string, unknown> | undefined;
  if (!customConfig || customConfig.adapterType === "openai-compat") {
    if (stage === "chat") {
      return callOpenAICompatibleChat(config.baseUrl, config.apiKey, config.visionModel, payload as unknown[]);
    }
    return callOpenAIImageGen(config.imageGenBaseUrl, config.apiKey, config.imageModel, payload as string);
  }
  const cHeaders = customConfig.customHeaders as Record<string, string> | undefined;
  const reqTransformer = customConfig.requestTransformer as ((s: string, p: unknown) => unknown) | undefined;
  const resTransformer = customConfig.responseTransformer as ((s: string, r: unknown) => string) | undefined;
  const chatEp = customConfig.chatEndpoint as string | undefined;
  const imgEp = customConfig.imageEndpoint as string | undefined;
  const endpoint = stage === "chat"
    ? (chatEp || config.baseUrl.replace(/\/$/, "") + "/chat/completions")
    : (imgEp || config.imageGenBaseUrl.replace(/\/$/, "") + "/images/generations");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(cHeaders || {}),
  };
  const body = reqTransformer ? reqTransformer(stage, payload) : payload;
  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error("Custom adapter API failed (" + response.status + "): " + errText);
  }
  const raw = await response.json();
  if (resTransformer) {
    return resTransformer(stage, raw);
  }
  if (stage === "chat") return raw.choices?.[0]?.message?.content || "";
  const b64 = raw.data?.[0]?.b64_json || raw.data?.[0]?.url;
  if (!b64) throw new Error("No image data from custom adapter");
  if (b64.startsWith("http")) return b64;
  return "data:image/png;base64," + b64;
};

const buildMultimodalMessages = (
  product: Asset,
  layers: { asset: Asset; placement: PlacedLayer }[],
  instruction: string
): unknown[] => {
  const layoutHints = getLayoutHints(layers);
  const systemPrompt = [
    "Analyze the product base image and the logo/graphics that we want to composite onto it.",
    "",
    "Product Name: " + product.name,
    "Logo/Graphics Count: " + layers.length,
    "",
    "Layout guidance based on user placement on the canvas:",
    layoutHints,
    "",
    "Custom prompt guidelines: " + (instruction || "Place the logos realistically onto the product surface."),
    "",
    "Task: Describe the finished, perfectly blended product mockup image in rich, vivid detail so a Text-to-Image AI model can generate a high-fidelity image of it.",
    "Describe the product, its material (e.g. cotton, ceramic, metal), and precisely where and how each logo is integrated.",
    "Specify that the logo must follow the fabric wrinkles, perspective, lighting, shadows, and contours of the product perfectly.",
    "Avoid mentioning the original separate images; instead, describe the final single composite object.",
    'Your description should start with: "Professional studio product photography of..." and describe ONLY the visual scene.',
    "Do not include any chat commentary or conversational padding, only output the detailed image prompt.",
  ].join("\n");

  const contentPayload: unknown[] = [{ type: "text", text: systemPrompt }];
  contentPayload.push({ type: "image_url", image_url: { url: product.data } });
  layers.forEach((layer) => {
    contentPayload.push({ type: "image_url", image_url: { url: layer.asset.data } });
  });
  return [{ role: "user", content: contentPayload }];
};

const analyzeWithVision = async (
  config: ProviderConfig,
  product: Asset,
  layers: { asset: Asset; placement: PlacedLayer }[],
  instruction: string
): Promise<string> => {
  const messages = buildMultimodalMessages(product, layers, instruction);
  const baseUrl = config.billingMode === "tokenplan" && config.tokenPlanBaseUrl
    ? config.tokenPlanBaseUrl
    : config.baseUrl;

  if (config.provider === "kimi") {
    return callKimiChat(baseUrl, config.apiKey, config.visionModel, messages);
  }

  switch (config.apiFormat) {
    case "dashscope":
      return callDashScopeChat(baseUrl, config.apiKey, config.visionModel, messages);
    case "custom":
      return callCustomAdapter(config, "chat", { messages, model: config.visionModel });
    default:
      return callOpenAICompatibleChat(baseUrl, config.apiKey, config.visionModel, messages);
  }
};

// --- Native Fusion (模式 A) ---

const callDoubaoFusion = async (
  config: ProviderConfig,
  prompt: string,
  product: Asset,
  layers: { asset: Asset; placement: PlacedLayer }[]
): Promise<string> => {
  const url = config.imageGenBaseUrl.replace(/\/$/, "") + "/images/generations";
  const images = [product.data, ...layers.map(l => l.asset.data)];
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + config.apiKey,
    },
    body: JSON.stringify({
      model: config.imageModel,
      prompt,
      image: images,
      size: "2K",
      output_format: "png",
      watermark: false,
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error("Doubao fusion failed (" + response.status + "): " + errText);
  }
  const data = await response.json();
  return data.data?.[0]?.url || data.data?.[0]?.b64_json;
};

const callQwenImageEdit = async (
  config: ProviderConfig,
  prompt: string,
  product: Asset,
  layers: { asset: Asset; placement: PlacedLayer }[]
): Promise<string> => {
  const base = config.imageGenBaseUrl.replace(/\/$/, "");
  const url = base + "/api/v1/services/aigc/multimodal-generation/generation";
  const content: any[] = [
    { image: product.data },
    ...layers.map(l => ({ image: l.asset.data })),
    { text: prompt },
  ];
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
    throw new Error("Qwen image edit failed (" + response.status + "): " + errText);
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

  switch (config.provider) {
    case 'doubao':
      return callDoubaoFusion(config, prompt, product, layers);
    case 'qwen':
      return callQwenImageEdit(config, prompt, product, layers);
    default:
      return callOpenAIImageGen(config.imageGenBaseUrl, config.apiKey, config.imageModel, prompt);
  }
};

// --- Main generateImage (传统 T2I, 用于 generateAsset) ---

const generateImageFn = async (
  config: ProviderConfig,
  prompt: string
): Promise<string> => {
  switch (config.apiFormat) {
    case "dashscope":
      return callDashScopeImageGen(config.apiKey, config.imageModel, prompt);
    case "minimax":
      return callMiniMaxImageGen(config.apiKey, config.imageModel, prompt);
    case "custom":
      return callCustomAdapter(config, "image", { prompt, model: config.imageModel });
    default:
      return callOpenAIImageGen(config.imageGenBaseUrl, config.apiKey, config.imageModel, prompt);
  }
};

const callDashScopeImageGen = async (
  apiKey: string,
  model: string,
  prompt: string
): Promise<string> => {
  const url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
      "X-DashScope-Async": "enable",
    },
    body: JSON.stringify({
      model,
      input: { messages: [{ role: "user", content: [{ text: prompt }] }] },
      parameters: { size: "1024x1024", n: 1, prompt_extend: true },
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error("DashScope Image API failed (" + response.status + "): " + errText);
  }
  const data = await response.json();
  const imageUrl = data.output?.results?.[0]?.url;
  if (!imageUrl) throw new Error("No image URL in DashScope response");
  return imageUrl;
};

const callMiniMaxImageGen = async (
  apiKey: string,
  model: string,
  prompt: string
): Promise<string> => {
  const url = "https://api.minimaxi.com/v1/image_generation";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
    },
    body: JSON.stringify({ model, prompt, aspect_ratio: "1:1" }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error("MiniMax Image API failed (" + response.status + "): " + errText);
  }
  const data = await response.json();
  const imageUrl = data.data?.image_urls?.[0];
  if (!imageUrl) throw new Error("No image URL in MiniMax response");
  return imageUrl;
};

const getProviderConfig = (settings: ApiSettings, provider: string): ProviderConfig | undefined => {
  return settings.providers[provider as keyof typeof settings.providers];
};

export const testProviderConnection = async (config: ProviderConfig): Promise<void> => {
  const baseUrl = config.billingMode === 'tokenplan' && config.tokenPlanBaseUrl
    ? config.tokenPlanBaseUrl
    : config.baseUrl;

  const url = baseUrl.replace(/\/$/, '') + '/chat/completions';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + config.apiKey,
      },
      body: JSON.stringify({
        model: config.visionModel,
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1,
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
    if (err.name === 'AbortError') {
      throw new Error('连接超时（15秒），请检查 Base URL 或网络');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const generateMockup = async (
  product: Asset,
  layers: { asset: Asset; placement: PlacedLayer }[],
  instruction: string,
  settings: ApiSettings
): Promise<string> => {
  const rt = settings.runtimeSettings;

  if (rt.generationMode === 'native-fusion') {
    const genConfig = getProviderConfig(settings, rt.analysisProvider);
    if (!genConfig || !genConfig.capabilities.nativeFusion) {
      throw new Error("Native fusion mode requires a provider with nativeFusion capability (doubao or qwen).");
    }
    return callNativeFusion(genConfig, product, layers, instruction);
  }

  const analysisConfig = getProviderConfig(settings, rt.analysisProvider);
  const genConfig = getProviderConfig(settings, rt.generationProvider);

  if (!analysisConfig) {
    throw new Error("Analysis provider " + rt.analysisProvider + " not configured");
  }
  if (!analysisConfig.capabilities.vision) {
    throw new Error(analysisConfig.name + " does not support vision analysis");
  }
  if (!genConfig) {
    throw new Error("Generation provider " + rt.generationProvider + " not configured");
  }
  if (!genConfig.capabilities.imageGen) {
    throw new Error(genConfig.name + " does not support image generation");
  }

  const detailedPrompt = await analyzeWithVision(analysisConfig, product, layers, instruction);

  if (genConfig.capabilities.nativeFusion) {
    return callNativeFusion(genConfig, product, layers, detailedPrompt);
  }
  return generateImageFn(genConfig, detailedPrompt);
};

export const generateAsset = async (
  prompt: string,
  type: "logo" | "product",
  settings: ApiSettings
): Promise<string> => {
  const rt = settings.runtimeSettings;
  const config = getProviderConfig(settings, rt.analysisProvider);
  if (!config) throw new Error("Provider " + rt.analysisProvider + " not configured");

  const enhancedPrompt = type === "logo"
    ? "A high-quality, professional vector-style logo design of a " + prompt + ". Isolated on a pure white background. Minimalist and clean, single distinct logo."
    : "Professional studio product photography of a single " + prompt + ". Ghost mannequin style or flat lay. Front view, isolated on neutral background. High resolution, photorealistic. Single object only, no stacks, no duplicates.";

  if (config.capabilities.imageGen) {
    return generateImageFn(config, enhancedPrompt);
  }

  let superPrompt = enhancedPrompt;
  try {
    const messages = [{ role: "user", content: "Refine and expand this image prompt into a masterpiece text-to-image prompt. Return ONLY the enhanced prompt: \"" + enhancedPrompt + "\"" }];
    const baseUrl = config.billingMode === "tokenplan" && config.tokenPlanBaseUrl
      ? config.tokenPlanBaseUrl
      : config.baseUrl;
    if (config.provider === "kimi") {
      superPrompt = await callKimiChat(baseUrl, config.apiKey, config.visionModel, messages);
    } else {
      superPrompt = await callOpenAICompatibleChat(baseUrl, config.apiKey, config.visionModel, messages);
    }
  } catch (err) {
    console.warn("Prompt enhancement failed, using base prompt", err);
  }

  const genConfig = getProviderConfig(settings, rt.generationProvider);
  if (genConfig && genConfig.capabilities.imageGen) {
    return generateImageFn(genConfig, superPrompt);
  }

  throw new Error("Current provider does not support image generation. Please configure a T2I-capable provider.");
};
