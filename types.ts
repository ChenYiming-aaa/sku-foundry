export interface Asset {
  id: string;
  type: 'logo' | 'product';
  name: string;
  data: string;
  mimeType: string;
}

export interface PlacedLayer {
  uid: string;
  assetId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface GeneratedMockup {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: number;
  layers?: PlacedLayer[];
  productId?: string;
}

export type AppView = 'dashboard' | 'assets' | 'studio' | 'gallery';

export interface LoadingState {
  isGenerating: boolean;
  message: string;
}

export type ApiProvider =
  | 'doubao'       // 字节豆包 Seedream 5.0 Pro（原生多图融合）
  | 'qwen'         // 阿里 Qwen-Image 2.0 Pro（原生多图融合）
  | 'tencent'      // 腾讯混元 3.0（图生图，异步）
  | 'kimi'         // 月之暗面（仅 Vision）
  | 'xiaomi'       // 小米 MiMo（仅 Vision）
  | 'yi'           // 零一万物（仅 Vision）
  | 'baidu'        // 百度千帆（仅 Vision）
  | 'custom';      // 自定义

export type GenerationMode = 'native-fusion' | 'dual-stage';
export type BillingMode = 'payg' | 'tokenplan' | 'codingplan';
export type ApiFormat = 'openai' | 'dashscope' | 'tencent-hunyuan' | 'minimax' | 'custom';

export interface ProviderCapabilities {
  vision: boolean;
  imageGen: boolean;
  nativeFusion: boolean;
  streaming: boolean;
  tokenPlan: boolean;
}

export interface ProviderConfig {
  provider: ApiProvider;
  name: string;
  enabled: boolean;
  apiKey: string;
  baseUrl: string;
  imageGenBaseUrl: string;
  tokenPlanBaseUrl?: string;
  visionModel: string;
  imageModel: string;
  capabilities: ProviderCapabilities;
  apiFormat: ApiFormat;
  billingMode: BillingMode;
}

export interface CustomProviderConfig {
  adapterType: 'openai-compat' | 'full-custom';
  customHeaders?: Record<string, string>;
  requestTransformer?: (stage: 'chat' | 'image', payload: any) => any;
  responseTransformer?: (stage: 'chat' | 'image', rawResponse: any) => string;
  chatEndpoint?: string;
  imageEndpoint?: string;
}

export interface RuntimeSettings {
  analysisProvider: ApiProvider;
  generationProvider: ApiProvider;
  unifiedMode: boolean;
  generationMode: GenerationMode;
}

export interface ApiSettings {
  providers: Record<ApiProvider, ProviderConfig>;
  runtimeSettings: RuntimeSettings;
  customConfigs?: Record<string, CustomProviderConfig>;
}
