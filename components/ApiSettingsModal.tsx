import React, { useState } from 'react';
import { X, KeyRound, Globe, Image as ImageIcon, Cpu, Loader, Check, AlertCircle, Zap } from 'lucide-react';
import { ApiSettings, ApiProvider, ProviderConfig } from '../types';
import { testProviderConnection } from '../services/aiService';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ApiSettings;
  onSave: (settings: ApiSettings) => void;
}

const providerMeta: Record<ApiProvider, { label: string; icon: string }> = {
  doubao: { label: '字节豆包 Seedream 5.0', icon: '🟠' },
  qwen: { label: '阿里 Qwen-Image 2.0', icon: '☁️' },
};

function makeProviderConfig(
  provider: ApiProvider,
  name: string,
  baseUrl: string,
  imageGenBaseUrl: string,
  imageModel: string,
  apiFormat: ProviderConfig['apiFormat']
): ProviderConfig {
  return {
    provider,
    name,
    enabled: true,
    apiKey: '',
    baseUrl,
    imageGenBaseUrl,
    imageModel,
    apiFormat,
  };
}

export const DEFAULT_SETTINGS: ApiSettings = {
  providers: {
    doubao: makeProviderConfig('doubao', '字节豆包 Seedream 5.0',
      'https://ark.cn-beijing.volces.com/api/v3',
      'https://ark.cn-beijing.volces.com/api/v3',
      'doubao-seedream-5-0-pro-260628',
      'openai'),
    qwen: makeProviderConfig('qwen', '阿里 Qwen-Image 2.0',
      'https://dashscope.aliyuncs.com/compatible-mode/v1',
      'https://dashscope.aliyuncs.com',
      'qwen-image-2.0-pro',
      'dashscope'),
  },
  runtimeSettings: {
    currentProvider: 'doubao',
  },
};

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<ApiSettings>(() => JSON.parse(JSON.stringify(settings)));
  const [selectedProvider, setSelectedProvider] = useState<ApiProvider>(settings.runtimeSettings.currentProvider);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string; latency?: number } | null>(null);

  const activeConfig = localSettings.providers[selectedProvider];

  const updateProvider = (key: keyof ProviderConfig, value: string | boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [selectedProvider]: { ...prev.providers[selectedProvider], [key]: value },
      },
    }));
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const config = localSettings.providers[selectedProvider];
      if (!config.apiKey) {
        setTestResult({ ok: false, msg: '请先填写 API Key' });
        setTesting(false);
        return;
      }
      const start = performance.now();
      await testProviderConnection(config);
      const latency = Math.round(performance.now() - start);
      setTestResult({ ok: true, msg: '连接成功', latency });
    } catch (err: any) {
      setTestResult({ ok: false, msg: err.message || '连接失败' });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    const merged = { ...localSettings, runtimeSettings: { currentProvider: selectedProvider } };
    onSave(merged);
    onClose();
  };

  if (!isOpen) return null;

  const providers = Object.keys(localSettings.providers) as ApiProvider[];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[150] p-4 animate-fade-in">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="text-indigo-400 w-4 h-4" />
            AI 设置
          </h2>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">供应商</label>
            <div className="flex gap-2">
              {providers.map(pk => {
                const prov = localSettings.providers[pk];
                const isSel = selectedProvider === pk;
                return (
                  <button
                    key={pk}
                    onClick={() => setSelectedProvider(pk)}
                    className={`flex-1 flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                      isSel
                        ? 'bg-indigo-600/15 border-indigo-500 text-white'
                        : 'bg-zinc-900/30 border-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className="text-lg">{providerMeta[pk]?.icon || '?'}</span>
                    <div>
                      <div className="text-sm font-medium">{prov.name}</div>
                      <div className="text-[10px] text-zinc-500">原生多图融合</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* API Key */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                API Key
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTest}
                  disabled={testing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-[11px] font-medium text-zinc-400 hover:text-zinc-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {testing ? (
                    <Loader className="w-3 h-3 animate-spin" />
                  ) : (
                    <Zap className="w-3 h-3" />
                  )}
                  测试
                </button>
                {testResult && (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium ${
                    testResult.ok
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {testResult.ok ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    <span>{testResult.ok ? (testResult.latency ? `${testResult.latency}ms` : '成功') : '失败'}</span>
                  </div>
                )}
              </div>
            </div>
            <input
              type="password"
              value={activeConfig.apiKey}
              onChange={e => updateProvider('apiKey', e.target.value)}
              placeholder={`输入 ${activeConfig.name} API Key`}
              className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
            />
          </div>

          {/* Base URL */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              Base URL
            </label>
            <input
              type="text"
              value={activeConfig.baseUrl}
              onChange={e => updateProvider('baseUrl', e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
            />
          </div>

          {/* Image Gen Base URL */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
              生图 Base URL
            </label>
            <input
              type="text"
              value={activeConfig.imageGenBaseUrl}
              onChange={e => updateProvider('imageGenBaseUrl', e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
            />
          </div>

          {/* Image Model */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              模型
            </label>
            <input
              type="text"
              value={activeConfig.imageModel}
              onChange={e => updateProvider('imageModel', e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800/50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};
