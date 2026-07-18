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

export type ApiProvider = 'doubao' | 'qwen';

export type ApiFormat = 'openai' | 'dashscope';

export interface ProviderConfig {
  provider: ApiProvider;
  name: string;
  enabled: boolean;
  apiKey: string;
  baseUrl: string;
  imageGenBaseUrl: string;
  imageModel: string;
  apiFormat: ApiFormat;
}

export interface RuntimeSettings {
  currentProvider: ApiProvider;
}

export interface ApiSettings {
  providers: Record<ApiProvider, ProviderConfig>;
  runtimeSettings: RuntimeSettings;
}
