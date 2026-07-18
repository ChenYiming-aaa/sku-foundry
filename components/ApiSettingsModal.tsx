import React, { useState, useCallback } from 'react';
import { X, KeyRound, Globe, Sparkles, Cpu, Image as ImageIcon, Check, Eye, EyeOff, RotateCcw, Settings2, Link2, Loader2, AlertCircle, Zap } from 'lucide-react';
import { ApiSettings, ApiProvider, ProviderConfig, BillingMode, ProviderCapabilities, RuntimeSettings, GenerationMode } from '../types';
import { testProviderConnection } from '../services/aiService';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ApiSettings;
  onSave: (settings: ApiSettings) => void;
}

const defaultCapabilities: Record<ApiProvider, ProviderCapabilities> = {
  doubao: { vision: true, imageGen: true, nativeFusion: true, streaming: true, tokenPlan: true },
  qwen: { vision: true, imageGen: true, nativeFusion: true, streaming: true, tokenPlan: true },
  tencent: { vision: true, imageGen: true, nativeFusion: false, streaming: true, tokenPlan: true },
  kimi: { vision: true, imageGen: false, nativeFusion: false, streaming: true, tokenPlan: false },
  xiaomi: { vision: true, imageGen: false, nativeFusion: false, streaming: true, tokenPlan: true },
  yi: { vision: true, imageGen: false, nativeFusion: false, streaming: true, tokenPlan: false },
  baidu: { vision: true, imageGen: false, nativeFusion: false, streaming: true, tokenPlan: true },
  custom: { vision: true, imageGen: true, nativeFusion: false, streaming: false, tokenPlan: false },
};

const providerList: { key: ApiProvider; label: string; icon: string }[] = [
  { key: 'doubao', label: '字节豆包 Seedream 5.0', icon: '🟠' },
  { key: 'qwen', label: '阿里 Qwen-Image 2.0', icon: '☁️' },
  { key: 'tencent', label: '腾讯混元 3.0', icon: '🔴' },
  { key: 'kimi', label: '月之暗面 Kimi', icon: '🌙' },
  { key: 'xiaomi', label: '小米 MiMo', icon: '📱' },
  { key: 'yi', label: '零一万物 Yi', icon: '1️⃣' },
  { key: 'baidu', label: '百度千帆', icon: '🟣' },
  { key: 'custom', label: '自定义', icon: '⚙️' },
];

function makeProviderConfig(
  provider: ApiProvider,
  name: string,
  baseUrl: string,
  visionModel: string,
  imageModel: string,
  imageGenBaseUrl: string,
  capabilities: ProviderCapabilities,
  apiFormat: ProviderConfig['apiFormat'],
  tokenPlanBaseUrl?: string
): ProviderConfig {
  return {
    provider,
    name,
    enabled: true,
    apiKey: '',
    baseUrl,
    imageGenBaseUrl,
    visionModel,
    imageModel,
    capabilities,
    apiFormat,
    billingMode: 'payg',
    ...(tokenPlanBaseUrl ? { tokenPlanBaseUrl } : {}),
  };
}

export const DEFAULT_SETTINGS: ApiSettings = {
  providers: {
    doubao: makeProviderConfig('doubao', '字节豆包 Seedream 5.0',
      'https://ark.cn-beijing.volces.com/api/v3',
      'doubao-vision-pro-32k', 'doubao-seedream-5-0-pro-260628',
      'https://ark.cn-beijing.volces.com/api/v3',
      defaultCapabilities.doubao, 'openai',
      'https://ark.cn-beijing.volces.com/api/coding/v3'),
    qwen: makeProviderConfig('qwen', '阿里 Qwen-Image 2.0',
      'https://dashscope.aliyuncs.com/compatible-mode/v1',
      'qwen3-vl-plus', 'qwen-image-2.0-pro',
      'https://dashscope.aliyuncs.com',
      defaultCapabilities.qwen, 'dashscope',
      'https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1'),
    tencent: makeProviderConfig('tencent', '腾讯混元 3.0',
      'https://tokenhub.tencentmaas.com/v1',
      'hy-vision-2.0-instruct', 'HY-Image-V3.0',
      'https://tokenhub.tencentmaas.com/v1',
      defaultCapabilities.tencent, 'openai',
      'https://api.lkeap.cloud.tencent.com/plan/v3'),
    kimi: makeProviderConfig('kimi', '月之暗面 Kimi',
      'https://api.moonshot.cn/v1',
      'kimi-k3', '',
      '',
      defaultCapabilities.kimi, 'openai'),
    xiaomi: makeProviderConfig('xiaomi', '小米 MiMo',
      'https://api.xiaomimimo.com/v1',
      'mimo-v2.5', '',
      '',
      defaultCapabilities.xiaomi, 'openai',
      'https://token-plan-cn.xiaomimimo.com/v1'),
    yi: makeProviderConfig('yi', '零一万物 Yi',
      'https://api.lingyiwanwu.com/v1',
      'yi-vision', '',
      '',
      defaultCapabilities.yi, 'openai'),
    baidu: makeProviderConfig('baidu', '百度千帆',
      'https://qianfan.baidubce.com/v2',
      'ernie-4.5-turbo-vl', '',
      '',
      defaultCapabilities.baidu, 'openai',
      'https://qianfan.baidubce.com/v2/tokenplan/team'),
    custom: makeProviderConfig('custom', '自定义供应商',
      'https://api.example.com/v1',
      'my-vision-model', 'my-image-model',
      'https://api.example.com/v1',
      defaultCapabilities.custom, 'openai'),
  },
  runtimeSettings: {
    analysisProvider: 'doubao',
    generationProvider: 'doubao',
    unifiedMode: true,
    generationMode: 'native-fusion',
  },
};

const capsLabel = (cap: ProviderCapabilities): string => {
  if (cap.nativeFusion) return '原生多图融合 🏆';
  if (cap.imageGen) return '图生图';
  if (cap.vision) return '仅视觉分析';
  return '文本';
};

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<ApiSettings>(JSON.parse(JSON.stringify(settings)));
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [selectedProvider, setSelectedProvider] = useState<ApiProvider>(
    settings.runtimeSettings.unifiedMode
      ? settings.runtimeSettings.analysisProvider
      : settings.runtimeSettings.analysisProvider
  );
  const [testResult, setTestResult] = useState<Record<string, { loading: boolean; success?: boolean; message?: string }>>({});

  const activeConfig = localSettings.providers[selectedProvider];
  const runtime = localSettings.runtimeSettings;
  const allProviders = Object.keys(localSettings.providers) as ApiProvider[];

  const updateProvider = (provider: ApiProvider, key: keyof ProviderConfig, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: {
          ...prev.providers[provider],
          [key]: value,
        },
      },
    }));
    if (key === 'apiKey' || key === 'baseUrl' || key === 'imageGenBaseUrl' || key === 'tokenPlanBaseUrl') {
      setTestResult(prev => ({ ...prev, [provider]: { loading: false } }));
    }
  };

  const setRuntime = (update: Partial<RuntimeSettings>) => {
    setLocalSettings(prev => ({
      ...prev,
      runtimeSettings: { ...prev.runtimeSettings, ...update },
    }));
  };

  const toggleShowKey = (provider: string) => {
    setShowKey(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleReset = () => {
    if (confirm('确定要恢复默认 AI 设置吗？')) {
      setLocalSettings(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)));
      setSelectedProvider('doubao');
      setTestResult({});
    }
  };

  const handleSaveClick = () => {
    onSave(localSettings);
    onClose();
  };

  const handleTestConnection = useCallback(async () => {
    const provider = selectedProvider;
    setTestResult(prev => ({ ...prev, [provider]: { loading: true } }));
    try {
      await testProviderConnection(activeConfig);
      setTestResult(prev => ({ ...prev, [provider]: { loading: false, success: true, message: '连接成功' } }));
    } catch (err: any) {
      setTestResult(prev => ({ ...prev, [provider]: { loading: false, success: false, message: err.message } }));
    }
  }, [selectedProvider, activeConfig]);

  if (!isOpen) return null;

  const billingHint = (prov: ApiProvider): string => {
    switch (prov) {
      case 'qwen': return '按量: sk-xxx | Token Plan: sk-sp-xxx | Coding: 专用';
      case 'doubao': return '按量 & Coding Plan 共用格式';
      case 'baidu': return '按量: 普通Key | Token Plan: 企业版Key';
      case 'xiaomi': return 'Token Plan Key 格式: tp-xxxxx';
      default: return '';
    }
  };

  const hasNativeFusion = activeConfig.capabilities.nativeFusion;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[150] p-4 overflow-y-auto animate-fade-in">
      <div className="glass-panel bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row overflow-hidden max-h-[90vh]">

        {/* Left Side: Provider Selection */}
        <div className="w-full md:w-1/3 bg-zinc-900/40 p-6 border-b md:border-b-0 md:border-r border-zinc-800 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Settings2 className="text-indigo-400 w-5 h-5" />
              AI 供应商
            </h2>
            <button
              onClick={handleReset}
              title="恢复默认设置"
              className="p-1.5 text-zinc-500 hover:text-indigo-400 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
              {allProviders.map((provKey) => {
              const prov = localSettings.providers[provKey];
              const isSelected = selectedProvider === provKey;
              return (
                <button
                  key={provKey}
                  onClick={() => {
                    setSelectedProvider(provKey);
                    if (runtime.generationMode === 'native-fusion') {
                      setRuntime({ analysisProvider: provKey, generationProvider: provKey });
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all border text-left
                    ${isSelected
                      ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)] font-semibold'
                      : 'bg-zinc-900/30 hover:bg-zinc-900 border-zinc-800/60 text-zinc-400 hover:text-zinc-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl filter drop-shadow">{providerList.find(p => p.key === provKey)?.icon || '?'}</span>
                    <div>
                      <div className="text-sm font-medium">{prov.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {capsLabel(prov.capabilities)}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="bg-indigo-500 text-white p-0.5 rounded-full">
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Pipeline Mode */}
          <div className="mt-6 pt-4 border-t border-zinc-800/50">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-indigo-400" />
              生成模式
            </label>
            <div className="space-y-2 mb-3">
              <button
                onClick={() => setRuntime({ generationMode: 'native-fusion' })}
                className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                  runtime.generationMode === 'native-fusion'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white'
                    : 'bg-zinc-900/30 border-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-medium text-xs mb-0.5">原生多图融合（推荐）</div>
                <div className="text-[10px] text-zinc-500">多图输入+指令→直接合成，无信息丢失</div>
              </button>
              <button
                onClick={() => setRuntime({ generationMode: 'dual-stage' })}
                className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                  runtime.generationMode === 'dual-stage'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white'
                    : 'bg-zinc-900/30 border-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-medium text-xs mb-0.5">双阶段（配对）</div>
                <div className="text-[10px] text-zinc-500">Vision 分析 + 图生图</div>
              </button>
            </div>

            {runtime.generationMode === 'dual-stage' && (
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1">分析端 (Vision)</label>
                  <select
                    value={runtime.analysisProvider}
                    onChange={e => setRuntime({ analysisProvider: e.target.value as ApiProvider })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  >
                    {allProviders.filter(p => localSettings.providers[p].capabilities.vision).map(p => (
                      <option key={p} value={p}>{localSettings.providers[p].name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1">生成端 (Image)</label>
                  <select
                    value={runtime.generationProvider}
                    onChange={e => setRuntime({ generationProvider: e.target.value as ApiProvider })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  >
                    {allProviders.filter(p => localSettings.providers[p].capabilities.imageGen).map(p => (
                      <option key={p} value={p}>{localSettings.providers[p].name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Provider Configuration */}
        <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto min-h-[350px] md:min-h-0">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/80">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>{providerList.find(p => p.key === selectedProvider)?.icon || '?'}</span>
                  {activeConfig.name} 配置
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {hasNativeFusion ? '🏆 支持原生多图融合 — 无需文字中介，无损合成' : '仅支持双阶段配对模式'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Billing Mode */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  计费模式
                </label>
                <div className="flex gap-2">
                  {(['payg', 'tokenplan', 'codingplan'] as BillingMode[]).map(mode => {
                    const available = mode === 'payg' || activeConfig.capabilities.tokenPlan;
                    if (mode === 'codingplan' && !['doubao', 'qwen', 'baidu'].includes(selectedProvider)) return null;
                    return (
                      <button
                        key={mode}
                        disabled={!available}
                        onClick={() => updateProvider(selectedProvider, 'billingMode', mode)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          activeConfig.billingMode === mode
                            ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300'
                            : available
                              ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                              : 'bg-zinc-900/50 border-zinc-800/30 text-zinc-600 cursor-not-allowed'
                        }`}
                      >
                        {mode === 'payg' ? '按量付费' : mode === 'tokenplan' ? 'Token Plan' : 'Coding Plan'}
                      </button>
                    );
                  })}
                </div>
                {billingHint(selectedProvider) && (
                  <p className="text-[10px] text-zinc-500 mt-1.5">{billingHint(selectedProvider)}</p>
                )}
              </div>

              {/* API Key */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey[selectedProvider] ? 'text' : 'password'}
                    value={activeConfig.apiKey}
                    onChange={(e) => updateProvider(selectedProvider, 'apiKey', e.target.value)}
                    placeholder={`输入 ${activeConfig.name} API Key`}
                    className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 pr-12 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey(selectedProvider)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showKey[selectedProvider] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Test Connection */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={!activeConfig.apiKey || testResult[selectedProvider]?.loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border
                      bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600
                      disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {testResult[selectedProvider]?.loading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Zap className="w-3.5 h-3.5" />
                    )}
                    测试连接
                  </button>

                  {testResult[selectedProvider] && !testResult[selectedProvider].loading && (
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${
                      testResult[selectedProvider].success ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {testResult[selectedProvider].success ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      <span className="max-w-[280px] truncate">{testResult[selectedProvider].message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Base URL */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  Chat Base URL
                </label>
                <input
                  type="text"
                  value={activeConfig.billingMode === 'tokenplan' && activeConfig.tokenPlanBaseUrl
                    ? activeConfig.tokenPlanBaseUrl
                    : activeConfig.baseUrl}
                  onChange={(e) => updateProvider(selectedProvider,
                    activeConfig.billingMode === 'tokenplan' && activeConfig.tokenPlanBaseUrl ? 'tokenPlanBaseUrl' as any : 'baseUrl',
                    e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                />
              </div>

              {/* Model Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    视觉模型
                  </label>
                  <input
                    type="text"
                    value={activeConfig.visionModel}
                    onChange={(e) => updateProvider(selectedProvider, 'visionModel', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                    生图模型
                  </label>
                  <input
                    type="text"
                    value={activeConfig.imageModel}
                    onChange={(e) => updateProvider(selectedProvider, 'imageModel', e.target.value)}
                    placeholder={activeConfig.capabilities.imageGen ? '' : '此供应商不支持生图'}
                    disabled={!activeConfig.capabilities.imageGen}
                    className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Image Gen Base URL (only for imageGen providers) */}
              {activeConfig.capabilities.imageGen && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                    生图 Base URL
                  </label>
                  <input
                    type="text"
                    value={activeConfig.imageGenBaseUrl}
                    onChange={(e) => updateProvider(selectedProvider, 'imageGenBaseUrl', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                  />
                </div>
              )}
            </div>

            {/* Explanation Box */}
            <div className="mt-5 p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/80 text-xs text-zinc-400 flex gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                {runtime.generationMode === 'native-fusion' ? (
                  <span>
                    <strong>原生多图融合模式</strong>：多张参考图 + 文字指令 → 直接输出合成图，无文字中介，无信息丢失。
                    当前供应商 <strong>{activeConfig.name}</strong>{' '}
                    {hasNativeFusion ? '支持原生融合，已是最优配置。' : '不支持原生融合，建议切换到豆包或 Qwen。'}
                  </span>
                ) : (
                  <span>
                    <strong>双阶段模式</strong>：分析端做视觉分析 → 生成端做图生图。
                    分析端 <strong>{localSettings.providers[runtime.analysisProvider]?.name}</strong> → 生成端{' '}
                    <strong>{localSettings.providers[runtime.generationProvider]?.name}</strong>。
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-800/50">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSaveClick}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all"
            >
              保存设置
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
