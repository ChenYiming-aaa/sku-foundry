/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Box, Image as ImageIcon, Wand2, Layers, Plus, Trash2, Download, Sparkles, Shirt, Maximize, ArrowRight, Package, Menu, X, Check, Settings } from 'lucide-react';
import { Button } from './components/Button';
import { FileUploader } from './components/FileUploader';
import { generateMockup, generateAsset } from './services/aiService';
import { Asset, GeneratedMockup, AppView, LoadingState, PlacedLayer, ApiSettings } from './types';
import { ApiSettingsModal, DEFAULT_SETTINGS } from './components/ApiSettingsModal';
import { promptLibrary, promptCategories, type PromptTemplate } from './data/prompts';


// ============ INTRO: BAR REVEAL (Framer Motion) ============

const BAR_COLORS = [
  '#1e1b4b', '#312e81', '#3730a3', '#4338ca', '#4f46e5',
  '#6366f1', '#6366f1', '#4f46e5', '#4338ca', '#3730a3',
  '#312e81', '#1e1b4b',
];
const BRAND_CHARS = 'SKU FOUNDRY'.split('');

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.4, delay: 0.2 } },
};
const barVariants = {
  visible: (i: number) => ({
    scaleY: 0,
    transition: { delay: 0.3 + i * 0.04, duration: 0.6, ease: [0.76, 0, 0.24, 1] },
  }),
};
const charVariantsFM = {
  hidden: { y: 60, opacity: 0, rotateX: -90 },
  visible: (i: number) => ({
    y: 0, opacity: 1, rotateX: 0,
    transition: { delay: 0.8 + i * 0.045, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

function IntroBarReveal({ onComplete }: { onComplete: () => void }) {
  const [isDone, setIsDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIsDone(true), 5200);
    const t2 = setTimeout(() => onComplete(), 5800);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
          variants={containerVariants}
          initial="hidden" animate="visible" exit="exit"
        >
          <motion.div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 flex pointer-events-none">
            {BAR_COLORS.map((color, i) => (
              <motion.div key={i} className="h-full flex-1 origin-top"
                style={{ backgroundColor: color }}
                custom={i} variants={barVariants}
                initial={{ scaleY: 1, opacity: 1 }} animate="visible"
              />
            ))}
          </div>
          <div className="relative z-10 text-center px-6">
            <motion.div className="mb-8 flex justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { delay: 1.6, duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40">
                <Package size={32} className="text-white" strokeWidth={2.5} />
              </div>
            </motion.div>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight mb-6 flex flex-wrap justify-center gap-x-3 perspective-[800px]">
              {BRAND_CHARS.map((char, i) => (
                <motion.span key={i} className="inline-block" custom={i}
                  variants={charVariantsFM} initial="hidden" animate="visible"
                  style={{ transformStyle: 'preserve-3d' }}
                >{char === ' ' ? '\u00A0' : char}</motion.span>
              ))}
            </h1>
            <motion.div className="flex justify-center mb-6"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1, transition: { delay: 2.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
              style={{ transformOrigin: 'center' }}
            >
              <div className="h-[3px] w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            </motion.div>
            <motion.p className="text-sm sm:text-base text-indigo-400 font-mono uppercase tracking-[0.35em]"
              initial={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)', transition: { delay: 2.8, duration: 0.5, ease: 'easeOut' } }}
            >AI Product Visualization</motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============ INTRO: LIGHT BURST (Glass Core + Particle Swarm) ============

const SWARM_COLORS = ['#a5b4fc', '#818cf8', '#c084fc', '#6366f1', '#e0e7ff', '#9333ea'];
const SWARM_COUNT = 80;
const SWARM_RADIUS = 130;

const sparkColors = ['#818cf8', '#6366f1', '#a855f7', '#c084fc', '#e9d5ff'];

function IntroLightBurst({ onComplete }: { onComplete: () => void }) {
  const starsRef = useRef<HTMLDivElement>(null);
  const swarmRef = useRef<HTMLDivElement>(null);
  const sparksRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Generate stars
    if (starsRef.current) {
      for (let i = 0; i < 100; i++) {
        const s = document.createElement('div');
        s.style.cssText = `position:absolute;left:${Math.random()*100}%;top:${Math.random()*100}%;width:${1+Math.random()*2}px;height:${1+Math.random()*2}px;border-radius:50%;background:rgba(255,255,255,0.4);animation:lb-starTwinkle ${2+Math.random()*4}s ease-in-out ${Math.random()*3}s infinite;`;
        starsRef.current.appendChild(s);
      }
    }
    // Generate 3D particle swarm
    if (swarmRef.current) {
      for (let i = 0; i < SWARM_COUNT; i++) {
        const p = document.createElement('div');
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const x = SWARM_RADIUS * Math.sin(phi) * Math.cos(theta);
        const y = SWARM_RADIUS * Math.sin(phi) * Math.sin(theta);
        const z = SWARM_RADIUS * Math.cos(phi);
        const size = 1.5 + Math.random() * 2.5;
        const color = SWARM_COLORS[Math.floor(Math.random() * SWARM_COLORS.length)];
        p.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:${color};box-shadow:0 0 ${3+size}px ${color};transform:translate3d(${x}px,${y}px,${z}px);animation:lb-particleFade ${1.5+Math.random()*1.5}s ease-in-out ${Math.random()*2}s infinite alternate;`;
        swarmRef.current.appendChild(p);
      }
    }
    // Generate sparks
    if (sparksRef.current) {
      for (let i = 0; i < 25; i++) {
        const sp = document.createElement('div');
        const angle = Math.random() * Math.PI * 2;
        const dist = 80 + Math.random() * 180;
        const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
        const delay = 0.6 + Math.random() * 1.0;
        sp.style.cssText = `position:absolute;width:${2+Math.random()*4}px;height:${2+Math.random()*4}px;border-radius:50%;background:${color};box-shadow:0 0 6px ${color};animation:lb-sparkFly 1s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s forwards;opacity:0;--tx:${Math.cos(angle)*dist}px;--ty:${Math.sin(angle)*dist}px;`;
        sparksRef.current.appendChild(sp);
      }
    }
    setReady(true);
  }, []);

  const [isDone, setIsDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIsDone(true), 4800);
    const t2 = setTimeout(() => onComplete(), 5200);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05030f] overflow-hidden ${isDone ? 'animate-[lb-sceneOut_0.6s_ease-in_forwards]' : ''}`}>
      {/* Stars */}
      <div ref={starsRef} className="absolute inset-0 pointer-events-none" />

      {/* Ambient glows */}
      <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' }}
      />
      <div className="absolute w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)' }}
      />

      {/* Concentric expanding rings */}
      {['240px','350px','480px','640px'].map((s, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{
            width: s, height: s, border: '1.5px solid rgba(99,102,241,0.2)',
            animation: `lb-ringExpand 2.5s ease-out ${0.3+i*0.3}s forwards`, opacity: 0,
            borderColor: i === 3 ? 'rgba(168,85,247,0.18)' : undefined,
          }}
        />
      ))}

      {/* Orb */}
      <div className="relative" style={{ width: 180, height: 180, animation: 'lb-orbFloat 7s ease-in-out infinite' }}>
        {/* Outer glow */}
        <div className="absolute"
          style={{
            inset: '-50%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.04) 30%, transparent 70%)',
            animation: 'lb-glowBreathe 3.5s ease-in-out infinite',
          }}
        />
        {/* Glass core */}
        <div className="absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(circle at 28% 22%, rgba(255,255,255,0.6) 0%, transparent 28%),
              radial-gradient(circle at 75% 70%, rgba(196,181,253,0.2) 0%, transparent 35%),
              conic-gradient(from 0deg, #6366f1 0deg, #818cf8 60deg, #a5b4fc 120deg, #c084fc 180deg, #818cf8 220deg, #6366f1 280deg, #6366f1 360deg)
            `,
            boxShadow: 'inset 0 -10px 40px rgba(0,0,0,0.3), 0 0 40px rgba(99,102,241,0.25)',
            animation: 'lb-glassSpin 14s linear infinite, lb-glassPulse 3s ease-in-out infinite',
          }}
        />
        {/* Glass specular */}
        <div className="absolute rounded-full" style={{
          top: '7%', left: '14%', width: '42%', height: '28%',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, transparent 65%)',
          transform: 'rotate(-22deg)', filter: 'blur(2px)',
        }} />
        {/* Inner core */}
        <div className="absolute rounded-full" style={{
          top: '35%', left: '35%', width: '30%', height: '30%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(165,180,252,0.25) 40%, transparent 70%)',
          animation: 'lb-corePulse 1.8s ease-in-out infinite', filter: 'blur(1px)',
        }} />

        {/* 3D particle swarm */}
        <div ref={swarmRef} className="absolute" style={{
          top: '50%', left: '50%', width: 0, height: 0,
          transformStyle: 'preserve-3d', perspective: 800,
          animation: 'lb-swarmRotate 18s linear infinite',
        }} />

        {/* Rings */}
        <div className="absolute rounded-full" style={{
          top: '-20%', left: '-20%', width: '140%', height: '140%',
          border: '1.5px solid rgba(129,140,248,0.1)',
          animation: 'lb-ringSpin 9s linear infinite',
        }}>
          <div className="absolute rounded-full" style={{
            top: -3, left: '50%', width: 7, height: 7, marginLeft: -3.5,
            background: '#a5b4fc', boxShadow: '0 0 10px rgba(165,180,252,0.6)',
          }} />
        </div>
        <div className="absolute rounded-full" style={{
          top: '-30%', left: '-30%', width: '160%', height: '160%',
          border: '1px solid rgba(168,85,247,0.07)',
          animation: 'lb-ringSpin 13s linear infinite reverse',
          transform: 'rotateX(60deg) rotateZ(20deg)', transformStyle: 'preserve-3d',
        }}>
          <div className="absolute rounded-full" style={{
            bottom: -2, left: '55%', width: 5, height: 5, marginLeft: -2.5,
            background: '#c084fc', boxShadow: '0 0 8px rgba(192,132,252,0.4)',
          }} />
        </div>
        <div className="absolute rounded-full" style={{
          top: '-10%', left: '-10%', width: '120%', height: '120%',
          border: '1px dashed rgba(129,140,248,0.05)',
          animation: 'lb-ringSpin 4.5s linear infinite',
        }}>
          <div className="absolute rounded-full" style={{
            top: -1, left: '50%', width: 3, height: 3, marginLeft: -1.5,
            background: '#e0e7ff', boxShadow: '0 0 4px rgba(224,231,255,0.4)',
          }} />
        </div>
      </div>

      {/* Sparks */}
      <div ref={sparksRef} className="absolute" style={{ left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }} />

      {/* Brand text */}
      <div className="relative z-10 text-center" style={{ opacity: ready ? undefined : 0 }}>
        <div style={{
          opacity: 0, animation: 'lb-textReveal 0.7s cubic-bezier(0.16,1,0.3,1) 1.6s forwards',
        }}>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight mb-5">
            {BRAND_CHARS.map((c, i) => (
              <span key={i} className="inline-block" style={{
                animation: `lb-charGlow 2s ease-in-out ${i * 0.1}s infinite`,
              }}>{c === ' ' ? '\u00A0' : c}</span>
            ))}
          </h1>
        </div>
        <div className="h-[3px] mx-auto rounded-full" style={{
          background: 'linear-gradient(90deg, transparent, #6366f1, #a855f7, transparent)',
          animation: 'lb-lineGrow 0.6s cubic-bezier(0.16,1,0.3,1) 2s forwards',
        }} />
        <p className="text-sm font-mono uppercase mt-5" style={{
          color: 'rgba(206,201,235,0.8)', letterSpacing: '0.4em',
          animation: 'lb-taglineIn 0.5s ease-out 2.3s forwards', opacity: 0,
        }}>AI Product Visualization</p>
      </div>
    </div>
  );
}

// ============ RANDOM INTRO SELECTOR ============

const IntroSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [variant] = useState(() => Math.random() > 0.5 ? 'bar' : 'burst');

  return variant === 'bar'
    ? <IntroBarReveal onComplete={onComplete} />
    : <IntroLightBurst onComplete={onComplete} />;
};

// --- UI Components ---

const NavButton = ({ icon, label, active, onClick, number }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, number?: number }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
      ${active ? 'bg-indigo-500/10 text-white border-l-2 border-indigo-500' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'}`}
  >
    <span className={`${active ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-400'} transition-colors`}>
      {icon}
    </span>
    <span className="font-medium text-sm tracking-wide flex-1 text-left">{label}</span>
    {number && (
      <span className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded min-w-[1.5rem] text-center transition-colors ${active ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
        {number}
      </span>
    )}
  </button>
);

const WorkflowStepper = ({ currentView, onViewChange, lang }: { currentView: AppView, onViewChange: (view: AppView) => void, lang: 'zh' | 'en' }) => {
  const tl = (zh: string, en: string) => lang === 'zh' ? zh : en;
  const steps = [
    { id: 'assets', label: tl('上传素材', 'Upload Assets'), number: 1 },
    { id: 'studio', label: tl('设计 Mockup', 'Design Mockup'), number: 2 },
    { id: 'gallery', label: tl('下载成品', 'Download Results'), number: 3 },
  ];

  const viewOrder = ['assets', 'studio', 'gallery'];
  const currentIndex = viewOrder.indexOf(currentView);
  const progress = Math.max(0, (currentIndex / (steps.length - 1)) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 hidden md:block animate-fade-in px-4">
      <div className="relative">
         {/* Background Track */}
         <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-800 -translate-y-1/2 rounded-full"></div>
         
         {/* Active Progress Bar */}
         <div 
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
         ></div>

         <div className="relative flex justify-between w-full">
            {steps.map((step, index) => {
               const isCompleted = currentIndex > index;
               const isCurrent = currentIndex === index;
               
               return (
                  <button 
                    key={step.id}
                    onClick={() => onViewChange(step.id as AppView)}
                    className={`group flex flex-col items-center focus:outline-none relative z-10 cursor-pointer`}
                  >
                     <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-[3px] transition-all duration-300 bg-zinc-950
                        ${isCurrent 
                           ? 'border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-110' 
                           : isCompleted 
                              ? 'border-indigo-600 bg-indigo-600 text-white' 
                              : 'border-zinc-800 text-zinc-600 group-hover:border-zinc-600 group-hover:text-zinc-400'}
                     `}>
                        {isCompleted ? (
                           <Check size={18} strokeWidth={3} />
                        ) : (
                           <span className="text-sm font-bold font-mono">{step.number}</span>
                        )}
                     </div>
                     <span className={`
                        absolute top-14 text-xs font-medium tracking-wider transition-all duration-300 whitespace-nowrap
                        ${isCurrent ? 'text-indigo-400 opacity-100 transform translate-y-0' : isCompleted ? 'text-zinc-400 opacity-80' : 'text-zinc-600 opacity-60 group-hover:opacity-100'}
                     `}>
                        {step.label}
                     </span>
                  </button>
               )
            })}
         </div>
      </div>
    </div>
  )
};

// Helper component for Asset Sections
const AssetSection = ({ 
  title, 
  icon, 
  type, 
  assets, 
  onAdd, 
  onRemove,
  validateApiKey,
  onApiError,
  apiSettings,
  lang
}: { 
  title: string, 
  icon: React.ReactNode, 
  type: 'logo' | 'product', 
  assets: Asset[], 
  onAdd: (a: Asset) => void, 
  onRemove: (id: string) => void,
  validateApiKey: () => Promise<boolean>,
  onApiError: (e: any) => void,
  apiSettings: ApiSettings,
  lang: 'zh' | 'en'
}) => {
  const tl = (zh: string, en: string) => lang === 'zh' ? zh : en;
  const [mode, setMode] = useState<'upload' | 'generate'>('upload');
  const [genPrompt, setGenPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!genPrompt) return;
    
    // Validate API key first
    if (!(await validateApiKey())) return;

    setIsGenerating(true);
    try {
      const b64 = await generateAsset(genPrompt, type, apiSettings);
      onAdd({
        id: crypto.randomUUID(),
        type,
        name: `AI Generated ${type}`,
        data: b64,
        mimeType: 'image/png'
      });
      setGenPrompt('');
    } catch (e: any) {
      console.error(e);
      onApiError(e);
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">{icon} {title}</h2>
          <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">{assets.length} {tl('个', 'items')}</span>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 overflow-y-auto max-h-[400px] pr-2">
          {assets.map(asset => (
            <div key={asset.id} className="relative group aspect-square bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700">
                <img src={asset.data} className="w-full h-full object-contain p-2" alt={asset.name} />
                <button onClick={() => onRemove(asset.id)} className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={12} />
                </button>
            </div>
          ))}
          {assets.length === 0 && (
            <div className="col-span-2 sm:col-span-3 flex flex-col items-center justify-center h-32 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
              <p className="text-sm">{tl('暂无', 'No')} {type === 'product' ? tl('产品', 'Products') : tl('Logo', 'Logos')}</p>
            </div>
          )}
      </div>

      {/* Creation Area */}
      <div className="mt-auto pt-4 border-t border-zinc-800">
        <div className="flex gap-4 mb-4">
           <button 
             onClick={() => setMode('upload')}
             className={`text-sm font-medium pb-1 border-b-2 transition-colors ${mode === 'upload' ? 'border-indigo-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
           >
              {tl('上传', 'Upload')}
            </button>
            <button 
              onClick={() => setMode('generate')}
              className={`text-sm font-medium pb-1 border-b-2 transition-colors ${mode === 'generate' ? 'border-indigo-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
              {tl('AI 生成', 'AI Generate')}
           </button>
        </div>

        {mode === 'upload' ? (
           <FileUploader label={`Upload ${type}`} onFileSelect={(f) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                onAdd({
                  id: crypto.randomUUID(),
                  type,
                  name: f.name,
                  data: e.target?.result as string,
                  mimeType: f.type
                });
              };
              reader.readAsDataURL(f);
           }} />
        ) : (
           <div className="space-y-3">
              <textarea 
                value={genPrompt}
                onChange={(e) => setGenPrompt(e.target.value)}
                placeholder={`${tl('描述你想创建的', 'Describe the')} ${type === 'product' ? tl('产品', 'product') : tl('Logo', 'logo')}...`}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-base text-white focus:ring-2 focus:ring-indigo-500 resize-none h-24 placeholder:text-zinc-600"
              />
              <Button 
                onClick={handleGenerate} 
                isLoading={isGenerating} 
                disabled={!genPrompt}
                className="w-full"
                icon={<Sparkles size={16} />}
              >
                {tl('生成', 'Generate')} {type === 'product' ? tl('产品', 'Product') : tl('Logo', 'Logo')}
              </Button>
           </div>
        )}
      </div>
    </div>
  );
};


// --- App Component ---

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showV120Notice, setShowV120Notice] = useState(false);
  const [view, setView] = useState<AppView>('dashboard');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [generatedMockups, setGeneratedMockups] = useState<GeneratedMockup[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedMockup, setSelectedMockup] = useState<GeneratedMockup | null>(null); // State for lightbox

  // Form states for generation
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [placedLogos, setPlacedLogos] = useState<PlacedLayer[]>([]);
  const [prompt, setPrompt] = useState('');
  const [showPromptLib, setShowPromptLib] = useState(false);
  const [promptLibCategory, setPromptLibCategory] = useState('fabric');
  const [promptLang, setPromptLang] = useState<'zh' | 'en'>('zh');
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [showHelp, setShowHelp] = useState(false);
  const t = (zh: string, en: string) => lang === 'zh' ? zh : en;

  useEffect(() => {
    setPromptLang(lang);
  }, [lang]);

  useEffect(() => {
    if (!showPromptLib && !showHelp) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowPromptLib(false); setShowHelp(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showPromptLib, showHelp]);
  const [loading, setLoading] = useState<LoadingState>({ isGenerating: false, message: '' });

  // Custom toast notification state
  const [toast, setToast] = useState<{ message: string, type: 'info' | 'warning' | 'success' } | null>(null);

  const showToast = (message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    setToast({ message, type });
    // Auto hide toast after 4.5 seconds
    setTimeout(() => {
      setToast(current => current?.message === message ? null : current);
    }, 4500);
  };

  const [apiSettings, setApiSettings] = useState<ApiSettings>(() => {
    try {
      const saved = localStorage.getItem('sku_foundry_api_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.runtimeSettings && parsed.runtimeSettings.currentProvider) {
          return parsed as ApiSettings;
        }
      }
    } catch {}
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const saveApiSettings = (newSettings: ApiSettings) => {
    setApiSettings(newSettings);
    localStorage.setItem('sku_foundry_api_settings', JSON.stringify(newSettings));
    const prov = newSettings.runtimeSettings.currentProvider;
    showToast(`${t("AI 设置已更新：当前供应商为", "AI Settings updated: current provider is")} ${newSettings.providers[prov]?.name || prov}`, "success");
  };

  const validateApiSettings = async (): Promise<boolean> => {
    const prov = apiSettings.runtimeSettings.currentProvider;
    const config = apiSettings.providers[prov];
    if (!config || !config.apiKey) {
      showToast(`${t("提示：", "Warning:")}${config?.name || prov} ${t("未填写 API Key，如请求失败请在 AI 设置中配置", "API Key is not set. Configure it in AI Settings if requests fail")}`, "warning");
    }
    return true;
  };

  // API Error Handling Logic
  const handleApiError = (error: any) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    showToast(`${t("生成失败：", "Generation failed:")}${errorMessage}`, "warning");
  };

  // State for Dragging
  const canvasRef = useRef<HTMLDivElement>(null);
  const productImgRef = useRef<HTMLImageElement>(null);
  const [draggedItem, setDraggedItem] = useState<{ uid: string, startX: number, startY: number, initX: number, initY: number } | null>(null);

  // Demo assets on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  // -- LOGO PLACEMENT HANDLERS --

  const addLogoToCanvas = (assetId: string) => {
    // Add new instance of logo to canvas at center
    const newLayer: PlacedLayer = {
      uid: crypto.randomUUID(),
      assetId,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0
    };
    setPlacedLogos(prev => [...prev, newLayer]);
  };

  const removeLogoFromCanvas = (uid: string, e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    setPlacedLogos(prev => prev.filter(l => l.uid !== uid));
  };

  const handleStart = (clientX: number, clientY: number, layer: PlacedLayer) => {
    setDraggedItem({
      uid: layer.uid,
      startX: clientX,
      startY: clientY,
      initX: layer.x,
      initY: layer.y
    });
  };

  const handleMouseDown = (e: React.MouseEvent, layer: PlacedLayer) => {
    e.preventDefault();
    e.stopPropagation();
    handleStart(e.clientX, e.clientY, layer);
  };

  const handleTouchStart = (e: React.TouchEvent, layer: PlacedLayer) => {
    e.stopPropagation(); // Prevent scrolling initiation if possible
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY, layer);
  };

  const handleWheel = (e: React.WheelEvent, layerId: string) => {
     e.stopPropagation();
     // Simple scale on scroll
     const delta = e.deltaY > 0 ? -0.1 : 0.1;
     setPlacedLogos(prev => prev.map(l => {
        if (l.uid !== layerId) return l;
        const newScale = Math.max(0.2, Math.min(3.0, l.scale + delta));
        return { ...l, scale: newScale };
     }));
  };

  // Global mouse/touch move for dragging
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!draggedItem || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = clientX - draggedItem.startX;
      const deltaY = clientY - draggedItem.startY;

      // Convert pixels to percentage
      const deltaXPercent = (deltaX / rect.width) * 100;
      const deltaYPercent = (deltaY / rect.height) * 100;

      setPlacedLogos(prev => prev.map(l => {
        if (l.uid !== draggedItem.uid) return l;
        return {
          ...l,
          x: Math.max(0, Math.min(100, draggedItem.initX + deltaXPercent)),
          y: Math.max(0, Math.min(100, draggedItem.initY + deltaYPercent))
        };
      }));
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      setDraggedItem(null);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (draggedItem) {
         e.preventDefault(); // Prevent scrolling while dragging
         handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = () => {
      setDraggedItem(null);
    };

    if (draggedItem) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false }); // passive: false needed for preventDefault
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [draggedItem]);


  const handleGenerate = async () => {
    if (!selectedProductId && placedLogos.length === 0) {
        return;
    }
    
    const product = assets.find(a => a.id === selectedProductId);
    if (!product) {
        alert(t("未找到所选产品，请重新选择", "Selected product not found, please reselect"));
        setSelectedProductId(null);
        return;
    }

    const layers = placedLogos.map(layer => {
        const asset = assets.find(a => a.id === layer.assetId);
        return asset ? { asset, placement: layer } : null;
    }).filter(Boolean) as { asset: Asset, placement: PlacedLayer }[];

    if (layers.length === 0) {
         alert(t("画布上无有效 Logo，请先添加", "No valid logo on canvas, please add one first"));
         return;
    }

    if (!(await validateApiSettings())) {
      return;
    }

    // Convert container-relative positions to product-relative positions.
    // Measures the actual rendered <img> DOM element to determine where the product
    // image content sits within the container after CSS object-contain.
    // This handles all CSS complexities (padding, border-box, parent layout) automatically.
    const productImgEl = productImgRef.current;
    let adjustedLayers: { asset: Asset; placement: PlacedLayer }[];

    if (productImgEl && productImgEl.naturalWidth > 0) {
      const containerEl = canvasRef.current;
      if (containerEl) {
        adjustedLayers = layers.map(({ asset, placement }) => {
          const prodPos = containerToProductPct(placement.x, placement.y, productImgEl);
          return {
            asset,
            placement: { ...placement, x: prodPos.x, y: prodPos.y },
          };
        });
      } else {
        adjustedLayers = layers;
      }
    } else {
      // Fallback: image not rendered yet, send container-relative coords as-is
      adjustedLayers = layers;
    }

    const currentPrompt = prompt;

    setLoading({ isGenerating: true, message: t('正在分析合成几何结构...', 'Analyzing composition geometry...') });
    try {
      // Send with product-relative coordinates
      const resultImage = await generateMockup(product, adjustedLayers, currentPrompt, apiSettings);
      
      const newMockup: GeneratedMockup = {
        id: crypto.randomUUID(),
        imageUrl: resultImage,
        prompt: currentPrompt,
        createdAt: Date.now(),
        layers: placedLogos, // Save the ORIGINAL layout (container-relative) for re-editing
        productId: selectedProductId
      };
      
      setGeneratedMockups(prev => [newMockup, ...prev]);
      setView('gallery');
    } catch (e: any) {
      console.error(e);
      handleApiError(e);
    } finally {
      setLoading({ isGenerating: false, message: '' });
    }
  };

  useEffect(() => {
    if (!showV120Notice) return;
    const timer = setTimeout(() => setShowV120Notice(false), 3000);
    return () => clearTimeout(timer);
  }, [showV120Notice]);

  // Convert container-relative (x%, y%) to product-relative percentages.
  //
  // CSS left:N% on the absolutely-positioned logo = N% of the container's content box.
  // The <img> element with `w-full h-full` IS that content box — measure it directly.
  // No CSS box-model math needed (padding, border-box, parent layout all handled by DOM).
  function containerToProductPct(
    pctX: number,
    pctY: number,
    imgEl: HTMLImageElement
  ): { x: number; y: number } {
    const r = imgEl.getBoundingClientRect();
    const nw = imgEl.naturalWidth;
    const nh = imgEl.naturalHeight;

    // Step 1: CSS left:N% → pixels from img element's top-left
    const ix = (pctX / 100) * r.width;
    const iy = (pctY / 100) * r.height;

    // Step 2: object-contain — the actual image content is scaled within the img box
    const scale = Math.min(r.width / nw, r.height / nh);
    const cw = nw * scale;
    const ch = nh * scale;
    const ox = (r.width - cw) / 2;
    const oy = (r.height - ch) / 2;

    // Step 3: pixels → product-relative percentage
    return {
      x: Math.max(0, Math.min(100, (ix - ox) / cw * 100)),
      y: Math.max(0, Math.min(100, (iy - oy) / ch * 100)),
    };
  }

  if (showIntro) {
    return <IntroSequence onComplete={() => { setShowIntro(false); setShowV120Notice(true); }} />;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans flex overflow-hidden relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[200] max-w-sm bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-2xl flex items-start gap-3 animate-[slideUp_0.3s_ease-out_forwards]">
          <div className="mt-0.5 shrink-0">
            {toast.type === 'success' ? (
              <span className="text-emerald-500 font-bold">✓</span>
            ) : toast.type === 'warning' ? (
              <span className="text-amber-500 font-bold">⚠</span>
            ) : (
              <span className="text-indigo-400 font-bold">ℹ</span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs text-zinc-300 font-medium leading-relaxed">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-zinc-500 hover:text-zinc-300 text-xs px-1 transition-colors">
            ✕
          </button>
        </div>
      )}

      {/* v1.2.1 Notice Banner */}
      {showV120Notice && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowV120Notice(false)} />
          <div className="relative bg-zinc-900 border border-zinc-700/60 rounded-2xl text-white text-center py-8 px-10 max-w-sm w-full shadow-2xl animate-[scaleFadeIn_0.35s_ease-out_forwards]">
            <button
              onClick={() => setShowV120Notice(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close"
            >
              <X size={16} strokeWidth={2} />
            </button>

            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-indigo-500/25 to-purple-500/25 border border-indigo-500/20 flex items-center justify-center">
              <Sparkles size={24} className="text-indigo-400" strokeWidth={1.5} />
            </div>

            <h3 className="text-base font-semibold text-white mb-2">
              {t("v1.2.1 随机开场", "v1.2.1 Random Intro")}
            </h3>

            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              {t("新增 Light Burst 开场动画，每次启动随机展示 Bar Reveal 或 Light Burst 两种开场效果。", "New Light Burst intro animation; randomly shows Bar Reveal or Light Burst on each startup.")}
            </p>

            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-[shrink_3s_linear_forwards]" />
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation (Desktop) */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950/50 hidden md:flex flex-col">
        <div className="h-16 border-b border-zinc-800 flex items-center px-6">
          <Package className="text-indigo-500 mr-2" />
          <span className="font-bold text-lg tracking-tight">SKU FOUNDRY</span>
        </div>

        <div className="p-4 space-y-2 flex-1">
          <NavButton 
            icon={<Layout size={18} />} 
            label={t("控制台", "Dashboard")} 
            active={view === 'dashboard'} 
            onClick={() => setView('dashboard')} 
          />
          <NavButton 
            icon={<Box size={18} />} 
            label={t("素材库", "Assets")} 
            active={view === 'assets'} 
            number={1}
            onClick={() => setView('assets')} 
          />
          <NavButton 
            icon={<Wand2 size={18} />} 
            label={t("设计室", "Studio")} 
            active={view === 'studio'} 
            number={2}
            onClick={() => setView('studio')} 
          />
          <NavButton 
            icon={<ImageIcon size={18} />} 
            label={t("作品集", "Gallery")} 
            active={view === 'gallery'} 
            number={3}
            onClick={() => setView('gallery')} 
          />
        </div>

        <div className="p-4 border-t border-zinc-800">
          <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 text-center">
             <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => setShowHelp(true)}>{t("帮助文档", "Help")}</Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center">
          <Package className="text-indigo-500 mr-2" />
          <span className="font-bold text-lg">SKU FOUNDRY</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-zinc-400 hover:text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-black/95 backdrop-blur-xl p-4 animate-fade-in flex flex-col">
          <div className="space-y-2">
            <NavButton 
              icon={<Layout size={18} />} 
              label={t("控制台", "Dashboard")} 
              active={view === 'dashboard'} 
              onClick={() => { setView('dashboard'); setIsMobileMenuOpen(false); }} 
            />
            <NavButton 
              icon={<Box size={18} />} 
              label={t("素材库", "Assets")} 
              active={view === 'assets'} 
              number={1}
              onClick={() => { setView('assets'); setIsMobileMenuOpen(false); }} 
            />
            <NavButton 
              icon={<Wand2 size={18} />} 
              label={t("设计室", "Studio")} 
              active={view === 'studio'} 
              number={2}
              onClick={() => { setView('studio'); setIsMobileMenuOpen(false); }} 
            />
            <NavButton 
              icon={<ImageIcon size={18} />} 
              label={t("作品集", "Gallery")} 
              active={view === 'gallery'} 
              number={3}
              onClick={() => { setView('gallery'); setIsMobileMenuOpen(false); }} 
            />
          </div>
          
          <div className="mt-auto pb-8 border-t border-zinc-800 pt-6">
              <button onClick={() => { setShowHelp(true); setIsMobileMenuOpen(false); }} className="w-full text-center py-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                {t("帮助文档", "Help")}
              </button>
              <p className="text-xs text-zinc-500 text-center mt-2">SKU FOUNDRY v1.2.1</p>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedMockup && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" 
          onClick={() => setSelectedMockup(null)}
        >
          <div className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            {/* Close Button */}
            <button 
              onClick={() => setSelectedMockup(null)}
              className="absolute top-4 right-4 md:top-0 md:-right-12 p-2 bg-zinc-800 text-white rounded-full hover:bg-zinc-700 transition-colors z-50 border border-zinc-700"
            >
              <X size={24} />
            </button>

            {/* Image Container */}
            <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden rounded-lg">
              <img 
                src={selectedMockup.imageUrl} 
                alt={t("全尺寸预览", "Full-size preview")} 
                className="max-w-full max-h-[85vh] object-contain shadow-2xl" 
              />
            </div>

            {/* Caption / Actions */}
            <div className="mt-4 bg-zinc-900/90 backdrop-blur border border-zinc-700 px-6 py-3 rounded-full flex items-center gap-4">
               <p className="text-sm text-zinc-300 max-w-[200px] md:max-w-md truncate">
                  {selectedMockup.prompt || t("生成的作品", "Generated work")}
                </p>
                <div className="h-4 w-px bg-zinc-700"></div>
                <a 
                  href={selectedMockup.imageUrl} 
                  download={`mockup-${selectedMockup.id}.png`}
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-2"
                >
                  <Download size={16} />
                  {t("下载", "Download")}
                </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative pt-16 md:pt-0">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 h-16 bg-black/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-8">
           <div className="text-sm text-zinc-400 breadcrumbs">
               <span className="opacity-50">{t("应用", "App")}</span> 
               <span className="mx-2">/</span> 
               <span className="text-white capitalize">{view === 'dashboard' ? t("控制台", "Dashboard") : view === 'assets' ? t("素材库", "Assets") : view === 'studio' ? t("设计室", "Studio") : t("作品集", "Gallery")}</span>
           </div>
           <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                 {apiSettings.providers[apiSettings.runtimeSettings.currentProvider]?.name || t("未配置", "Not configured")}
              </span>
              <div className="flex gap-1 bg-zinc-900 rounded-lg p-0.5 border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setLang('zh')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${lang === 'zh' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  中文
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${lang === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  EN
                </button>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                icon={<Settings size={15} />}
                onClick={() => setIsSettingsOpen(true)}
                className="hover:border-indigo-500 transition-colors"
              >
                {t("AI 设置", "AI Settings")}
              </Button>
           </div>
        </div>

        <div className="max-w-6xl mx-auto p-6 md:p-12">
           
           {/* --- DASHBOARD VIEW --- */}
           {view === 'dashboard' && (
              <div className="animate-fade-in space-y-8">
                 <div className="text-center py-12">
                  <h1 className="text-4xl md:text-6xl font-black mb-6 text-white">
                     {t("创建逼真的", "Create Realistic")} <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">{t("商品 Mockup", "Product Mockups")}</span>
                  </h1>
                  <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-10">
                     {t("上传你的 Logo 和产品图，让 AI 以真实的光影、阴影和扭曲效果完美融合。", "Upload your logo and product photo, and let AI blend them perfectly with realistic lighting, shadows, and distortion.")}
                  </p>
                  <Button size="lg" onClick={() => setView('assets')} icon={<ArrowRight size={20} />}>
                     {t("开始创作", "Get Started")}
                     </Button>
                 </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                         { icon: <Box className="text-indigo-400" />, title: t("素材管理", "Asset Management"), desc: t("管理 Logo 和产品素材", "Manage logos and product assets") },
                         { icon: <Wand2 className="text-purple-400" />, title: t("AI 合成", "AI Compositing"), desc: t("智能融合与表面映射", "Smart blending & surface mapping") },
                         { icon: <Download className="text-pink-400" />, title: t("高清导出", "HD Export"), desc: t("生产级视觉成品", "Production-ready visuals") }
                      ].map((feat, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/30 transition-colors">
                           <div className="mb-4 p-3 bg-zinc-900 w-fit rounded-lg">{feat.icon}</div>
                           <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
                           <p className="text-zinc-500">{feat.desc}</p>
                        </div>
                     ))}
                  </div>
                  
                  <footer className="mt-20 pt-8 border-t border-zinc-900 text-center">
                      <p className="text-zinc-500 text-xs max-w-2xl mx-auto leading-relaxed">
                         {t("使用本应用即表示您确认拥有所上传内容的合法权利。请勿生成侵犯他人知识产权或隐私权的内容。使用本生成式 AI 服务需遵守禁止使用政策。", "By using this app, you confirm that you have the legal rights to the uploaded content. Do not generate content that infringes on others' intellectual property or privacy rights. Use of this generative AI service must comply with the acceptable use policy.")}
                      </p>
                  </footer>
              </div>
           )}

           {/* --- ASSETS VIEW --- */}
           {view === 'assets' && (
              <div className="animate-fade-in">
                <WorkflowStepper currentView="assets" onViewChange={setView} lang={lang} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Products Section */}
                  <AssetSection 
                    title={t("产品", "Product")} 
                    icon={<Box size={20} />}
                    type="product"
                    assets={assets.filter(a => a.type === 'product')}
                    onAdd={(a) => setAssets(prev => [...prev, a])}
                    onRemove={(id) => setAssets(prev => prev.filter(a => a.id !== id))}
                    validateApiKey={validateApiSettings}
                    onApiError={handleApiError}
                    apiSettings={apiSettings}
                    lang={lang}
                  />

                  {/* Logos Section */}
                  <AssetSection 
                    title={t("Logo 与图形", "Logos & Graphics")} 
                    icon={<Layers size={20} />}
                    type="logo"
                    assets={assets.filter(a => a.type === 'logo')}
                    onAdd={(a) => setAssets(prev => [...prev, a])}
                    onRemove={(id) => setAssets(prev => prev.filter(a => a.id !== id))}
                    validateApiKey={validateApiSettings}
                    onApiError={handleApiError}
                    apiSettings={apiSettings}
                    lang={lang}
                  />
                </div>

                <div className="mt-8 flex justify-end">
                    <Button onClick={() => setView('studio')} disabled={assets.length < 2} icon={<ArrowRight size={16} />}>
                       {t("前往设计室", "Go to Studio")}
                    </Button>
                </div>
              </div>
           )}

           {/* --- STUDIO VIEW --- */}
           {view === 'studio' && (
             <div className="animate-fade-in h-[calc(100vh-8rem)] md:h-[calc(100vh-12rem)] flex flex-col-reverse lg:flex-row gap-4 lg:gap-6">
                {/* Left Controls (Bottom on Mobile) */}
                <div className="w-full lg:w-80 flex flex-col gap-6 glass-panel p-6 rounded-2xl overflow-y-auto flex-1 lg:flex-none">
                   <div>
                        <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">1. {t("选择产品", "Select Product")}</h3>
                       <div className="grid grid-cols-3 gap-2">
                          {assets.filter(a => a.type === 'product').map(a => (
                             <div 
                                key={a.id} 
                                onClick={() => setSelectedProductId(selectedProductId === a.id ? null : a.id)}
                                className={`aspect-square rounded-lg border-2 cursor-pointer p-1 transition-all ${selectedProductId === a.id ? 'border-indigo-500 bg-indigo-500/20' : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900'}`}
                             >
                                <img src={a.data} className="w-full h-full object-contain" alt={a.name} />
                             </div>
                          ))}
                           {assets.filter(a => a.type === 'product').length === 0 && <p className="text-xs text-zinc-400 col-span-3">{t("暂无产品", "No products")}</p>}
                       </div>
                    </div>

                    <div>
                       <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">2. {t("添加 Logo", "Add Logo")}</h3>
                         {placedLogos.length > 0 && (
                             <span className="text-xs text-indigo-400">{placedLogos.length} {t("在画布上", "on canvas")}</span>
                         )}
                       </div>
                       <p className="text-xs text-zinc-400 mb-2">{t("点击添加，拖拽移动，滚轮缩放", "Click to add, drag to move, scroll to zoom")}</p>
                       <div className="grid grid-cols-3 gap-2">
                          {assets.filter(a => a.type === 'logo').map(a => (
                             <div 
                                key={a.id} 
                                onClick={() => addLogoToCanvas(a.id)}
                                className={`relative aspect-square rounded-lg border-2 cursor-pointer p-1 transition-all border-zinc-700 hover:border-zinc-500 bg-zinc-900`}
                             >
                                <img src={a.data} className="w-full h-full object-contain" alt={a.name} />
                                {/* Count badge */}
                                {placedLogos.filter(l => l.assetId === a.id).length > 0 && (
                                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold border border-zinc-900">
                                        {placedLogos.filter(l => l.assetId === a.id).length}
                                    </div>
                                )}
                             </div>
                          ))}
                           {assets.filter(a => a.type === 'logo').length === 0 && <p className="text-xs text-zinc-400 col-span-3">{t("暂无 Logo", "No logos")}</p>}
                       </div>
                    </div>

                    <div>
                         <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">3. {t("生成指令", "Prompt")}</h3>
                           <button
                             type="button"
                             onClick={() => setShowPromptLib(true)}
                             className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 hover:bg-zinc-900"
                           >
                             <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" />
                             <span>{t("提示词库", "Prompt Library")}</span>
                           </button>
                         </div>

                        <textarea 
                           className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-base text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none h-24"
                           placeholder={t("例如：将 Logo 嵌入到面料纹理中...", "e.g. Embed the logo into the fabric texture...")}
                           value={prompt}
                           onChange={(e) => setPrompt(e.target.value)}
                        />
                     </div>

                    <div className="mt-auto space-y-1">
                      <Button 
                        onClick={handleGenerate} 
                        isLoading={loading.isGenerating} 
                        disabled={!selectedProductId || placedLogos.length === 0} 
                        size="lg" 
                        className="w-full"
                        icon={<Wand2 size={18} />}
                     >
                        {t("生成 Mockup", "Generate Mockup")}
                     </Button>
                     {(!selectedProductId || placedLogos.length === 0) && (
                       <p className="text-[10px] text-zinc-500 text-center">
                         {!selectedProductId ? t("请先选择产品", "Select a product first") : t("请添加 Logo 到画布", "Add a logo to the canvas")}
                       </p>
                     )}
                    </div>
                </div>

                {/* Right Preview - Canvas (Top on Mobile) */}
                <div className="h-[45vh] lg:h-auto lg:flex-1 glass-panel rounded-2xl flex items-center justify-center bg-zinc-900 relative overflow-hidden select-none flex-shrink-0">
                   {loading.isGenerating && (
                      <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
                         <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                         <p className="text-indigo-400 font-mono animate-pulse">{loading.message}</p>
                      </div>
                   )}
                   
                   {selectedProductId ? (
                      <div 
                         ref={canvasRef}
                         className="relative w-full h-full max-h-[600px] p-4"
                      >
                          {/* Product Base */}
                          <img 
                             ref={productImgRef}
                             src={assets.find(a => a.id === selectedProductId)?.data} 
                             className="w-full h-full object-contain drop-shadow-2xl pointer-events-none select-none" 
                             alt="Preview" 
                             draggable={false}
                          />

                         {/* Overlay Layers */}
                         {placedLogos.map((layer) => {
                            const logoAsset = assets.find(a => a.id === layer.assetId);
                            if (!logoAsset) return null;
                            const isDraggingThis = draggedItem?.uid === layer.uid;

                            return (
                               <div
                                  key={layer.uid}
                                  className={`absolute cursor-move group ${isDraggingThis ? 'z-50 opacity-80' : 'z-10'}`}
                                  style={{
                                     left: `${layer.x}%`,
                                     top: `${layer.y}%`,
                                     transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg)`,
                                     // We use a fixed width for the container relative to viewport/container would be better but simplified here
                                     width: '15%', // Base width relative to container
                                     aspectRatio: '1/1'
                                  }}
                                  onMouseDown={(e) => handleMouseDown(e, layer)}
                                  onTouchStart={(e) => handleTouchStart(e, layer)}
                                  onWheel={(e) => handleWheel(e, layer.uid)}
                               >
                                  {/* Selection Border */}
                                  <div className="absolute -inset-2 border-2 border-indigo-500/0 group-hover:border-indigo-500/50 rounded-lg transition-all pointer-events-none"></div>
                                  
                                  {/* Remove Button */}
                                  <button 
                                    onClick={(e) => removeLogoFromCanvas(layer.uid, e)}
                                    onTouchEnd={(e) => removeLogoFromCanvas(layer.uid, e)}
                                    className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-lg z-50"
                                    title="Remove"
                                  >
                                    <X size={12} />
                                  </button>

                                  <img 
                                     src={logoAsset.data} 
                                     className="w-full h-full object-contain drop-shadow-lg pointer-events-none"
                                     draggable={false}
                                     alt="layer"
                                  />
                               </div>
                            );
                         })}
                      </div>
                   ) : (
                      <div className="text-center text-zinc-600">
                          <Shirt size={64} className="mx-auto mb-4 opacity-20" />
                           <p>{t("选择一个产品开始设计", "Select a product to start designing")}</p>
                       </div>
                   )}
                </div>
             </div>
           )}

           {/* --- GALLERY VIEW --- */}
           {view === 'gallery' && (
              <div className="animate-fade-in">
               <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold">{t("生成的作品", "Generated Works")}</h2>
                      <Button variant="outline" onClick={() => setView('studio')} icon={<Plus size={16}/>}>{t("新建", "New")}</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {generatedMockups.map(mockup => (
                        <div key={mockup.id} className="group glass-panel rounded-xl overflow-hidden">
                           <div className="aspect-square bg-zinc-900 relative overflow-hidden">
                              <img src={mockup.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Mockup" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                 <Button 
                                   size="sm" 
                                   variant="secondary" 
                                   icon={<Maximize size={16}/>}
                                   onClick={() => setSelectedMockup(mockup)}
                                 >
                                    {t("预览", "Preview")}
                                  </Button>
                                  <a href={mockup.imageUrl} download={`mockup-${mockup.id}.png`}>
                                    <Button size="sm" variant="primary" icon={<Download size={16}/>}>{t("下载", "Download")}</Button>
                                 </a>
                              </div>
                           </div>
                           <div className="p-4">
                              <p className="text-xs text-zinc-500 mb-1">{new Date(mockup.createdAt).toLocaleDateString()}</p>
                               <p className="text-sm text-zinc-300 line-clamp-2">{mockup.prompt || t("自动生成的作品", "Auto-generated work")}</p>
                               {mockup.layers && mockup.layers.length > 0 && (
                                   <div className="mt-2 flex gap-1">
                                       <span className="text-xs px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">{mockup.layers.length} {t("个 Logo", "Logos")}</span>
                                   </div>
                               )}
                           </div>
                        </div>
                     ))}
                     {generatedMockups.length === 0 && (
                        <div className="col-span-full py-20 text-center glass-panel rounded-xl">
                           <ImageIcon size={48} className="mx-auto mb-4 text-zinc-700" />
                            <h3 className="text-lg font-medium text-zinc-300">{t("暂无作品", "No Works Yet")}</h3>
                            <p className="text-zinc-500 mb-6">{t("在设计室中创建你的第一个作品", "Create your first work in Studio")}</p>
                            <Button onClick={() => setView('studio')}>{t("前往设计室", "Go to Studio")}</Button>
                        </div>
                     )}
                  </div>
              </div>
           )}
        </div>
      </main>

      {/* API Settings Modal */}
      <ApiSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={apiSettings} 
        onSave={saveApiSettings} 
      />

      {/* Prompt Library Modal */}
      {showPromptLib && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[150] p-4 overflow-y-auto animate-fade-in"
          onClick={() => setShowPromptLib(false)}
        >
          <div
            className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden max-h-[85vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 shrink-0">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white tracking-tight">{t("提示词库", "Prompt Library")}</h2>
                <span className="text-[10px] text-zinc-600 font-mono tracking-wider bg-zinc-900 px-2 py-0.5 rounded-full">
                  {promptLibrary.length} {t("模板", "Templates")}
                </span>
                <div className="flex gap-1 ml-2 bg-zinc-900 rounded-lg p-0.5 border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => { setPromptLang('zh'); setLang('zh'); }}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${promptLang === 'zh' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    中文
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPromptLang('en'); setLang('en'); }}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${promptLang === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    EN
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPromptLib(false)}
                className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-0 px-4 pt-3 border-b border-zinc-800/60 overflow-x-auto scrollbar-hide shrink-0">
              {promptCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setPromptLibCategory(cat.id)}
                   className={`shrink-0 flex items-center gap-2 px-5 py-3 text-xs font-medium transition-all duration-200 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 ${
                    promptLibCategory === cat.id
                      ? 'border-indigo-500 text-indigo-300 bg-indigo-600/8'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  <span className="text-sm leading-none">{cat.icon}</span>
                  {promptLang === 'en' ? cat.enLabel : cat.label}
                </button>
              ))}
            </div>

            {/* Prompt Cards */}
            <div key={promptLibCategory} className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-hide animate-fade-in">
              {promptLibrary.filter(p => p.category === promptLibCategory).length === 0 && (
                <p className="text-xs text-zinc-600 text-center py-12">{t("该分类暂无模板", "No templates in this category")}</p>
              )}
              {promptLibrary.filter(p => p.category === promptLibCategory).map((tpl, idx) => {
                const accentColor = promptLibCategory === 'fabric' ? 'border-l-indigo-500/60'
                  : promptLibCategory === 'hard' ? 'border-l-emerald-500/60'
                  : promptLibCategory === 'tech' ? 'border-l-cyan-500/60'
                  : promptLibCategory === 'luxury' ? 'border-l-amber-500/60'
                  : 'border-l-purple-500/60';
                return (
                  <button
                    key={tpl.id}
                     type="button"
                    onClick={() => { setPrompt(promptLang === 'en' ? tpl.enPrompt : tpl.prompt); setShowPromptLib(false); }}
                    style={{ animationDelay: `${idx * 40}ms` }}
                    className={`w-full text-left p-4 rounded-xl border border-zinc-800/40 border-l-2 ${accentColor}
                      bg-zinc-900/20 hover:bg-zinc-800/40 hover:border-zinc-700/60 hover:border-l-2
                      hover:scale-[1.005] active:scale-[0.995] transition-[transform,colors,opacity] duration-200 group
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950
                      animate-[fade-in-card_0.35s_ease-out_backwards]`}
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="text-xl leading-none mt-0.5 shrink-0">{tpl.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors tracking-wide">{promptLang === 'en' ? tpl.enTitle : tpl.title}</span>
                          <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider bg-zinc-900 px-1.5 py-0.5 rounded">Prompt</span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 group-hover:text-zinc-400 transition-colors">{promptLang === 'en' ? tpl.enPrompt : tpl.prompt}</p>
                      </div>
                      <div className="shrink-0 self-center p-2 rounded-full bg-zinc-800/40 text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:text-indigo-400 transition-all duration-200 -mr-1">
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Help Document Modal */}
      {showHelp && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[150] p-4 overflow-y-auto animate-fade-in"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden max-h-[85vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-white tracking-tight">{t("帮助文档", "Help Documentation")}</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {/* One: Quick Start */}
              <section>
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">
                  {t("一、快速开始", "I. Quick Start")}
                </h3>
                <ol className="space-y-2 text-xs text-zinc-300 leading-relaxed list-decimal list-inside">
                  <li>{t("上传素材 — 在\"素材库\"页面上传 Logo/图案 和产品照片", "Upload Assets — Upload your logo/pattern and product photo on the Assets page")}</li>
                  <li>{t("配置 AI — 点击右上角\"AI 设置\"，填入供应商的 API Key 等信息", "Configure AI — Click \"AI Settings\" (top-right), fill in provider API Key and model info")}</li>
                  <li>{t("设计 Mockup — 进入\"设计室\"，放置素材并输入提示词", "Design Mockup — Enter Studio, place assets and enter a prompt")}</li>
                  <li>{t("生成作品 — 点击\"生成产品\"，AI 将自动融合 Logo 与产品图", "Generate — Click Generate, AI will automatically blend the logo with the product image")}</li>
                  <li>{t("下载成品 — 在\"作品集\"页面查看和下载生成的作品", "Download — View and download generated works on the Gallery page")}</li>
                </ol>
              </section>

              {/* Two: Prompt Library */}
              <section>
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">
                  {t("二、提示词库", "II. Prompt Library")}
                </h3>
                <ul className="space-y-1.5 text-xs text-zinc-300 leading-relaxed list-disc list-inside">
                  <li>{t("在设计室右侧点击\"提示词库\"按钮", "Click \"Prompt Library\" button on the right side of Studio")}</li>
                  <li>{t("内置 26 条专业模板，覆盖布料、硬质表面、电子产品、奢侈品、场景环境 5 大类", "26 built-in templates across Fabric, Hard Surface, Electronics, Luxury, and Scene categories")}</li>
                  <li>{t("支持中英文切换", "Supports Chinese/English switching")}</li>
                  <li>{t("点击模板自动填充到提示词输入框", "Click a template to auto-fill the prompt input")}</li>
                </ul>
              </section>

              {/* Three: AI Settings */}
              <section>
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">
                  {t("三、AI 设置", "III. AI Settings")}
                </h3>
                <ul className="space-y-1.5 text-xs text-zinc-300 leading-relaxed list-disc list-inside">
                  <li>{t("点击右上角\"AI 设置\"按钮", "Click \"AI Settings\" button in the top-right corner")}</li>
                  <li>{t("v1.2.1 支持两家供应商：字节豆包（Seedream 5.0）和 阿里 Qwen-Image 2.0", "v1.2.1 supports two providers: ByteDance Doubao (Seedream 5.0) and Alibaba Qwen-Image 2.0")}</li>
                  <li>{t("两者都支持原生多图融合（直接传入多张图 + prompt 生成一张融合图）", "Both support native multi-image fusion (multiple images + prompt → one composited output)")}</li>
                  <li>{t("也支持文生图（T2I）资产生成", "Also support text-to-image (T2I) asset generation")}</li>
                  <li>{t("填入 API Key、Base URL、生图 Base URL、模型名后可用\"测试\"按钮验证连接", "Fill in API Key, Base URL, Image Gen Base URL, Model name, then use \"Test\" button to verify")}</li>
                </ul>
              </section>

              {/* Four: Gallery Management */}
              <section>
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">
                  {t("四、作品管理", "IV. Gallery Management")}
                </h3>
                <ul className="space-y-1.5 text-xs text-zinc-300 leading-relaxed list-disc list-inside">
                  <li>{t("生成的 Mockup 保存在\"作品集\"页面", "Generated mockups are saved on the Gallery page")}</li>
                  <li>{t("支持单张下载", "Single image download supported")}</li>
                  <li>{t("作品数据存储在浏览器本地", "Data stored in browser local storage")}</li>
                </ul>
              </section>

              {/* Five: FAQ */}
              <section>
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">
                  {t("五、常见问题", "V. FAQ")}
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-zinc-200 mb-1">
                      {t("生成失败？", "Generation failed?")}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {t("检查 AI 设置中的 API Key 是否正确，以及所选模型是否可用", "Check if the API Key in AI Settings is correct and the selected model is available")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-200 mb-1">
                      {t("图片效果不佳？", "Poor image quality?")}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {t("尝试使用更详细的提示词，或更换产品照片", "Try using more detailed prompts or changing the product photo")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-200 mb-1">
                      {t("如何清除所有数据？", "How to clear all data?")}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {t("在浏览器开发者工具的 Application → Local Storage 中清除站点数据", "Clear site data in Browser DevTools → Application → Local Storage")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-200 mb-1">
                      {t("v1.2.1 变了什么？", "What changed in v1.2.1?")}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {t("新增 Light Burst 开场动画（玻璃核心 + 粒子群 + 光爆），启动时随机切换两种开场效果。", "New Light Burst intro (glass core + particle swarm + light burst). Randomly switches between two intro styles on startup.")}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}