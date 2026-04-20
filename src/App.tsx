import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { 
  ChevronLeft, 
  Heart, 
  X, 
  ChevronRight, 
  Box, 
  Layers, 
  Wrench,
  MoreHorizontal,
  RotateCcw,
  Move
} from 'lucide-react';

type PartItem = {
  name: string;
  count: number;
  unit: '颗' | '根';
  kind: 'ball' | 'rod';
  size?: 'short' | 'medium' | 'long';
  colorHex?: string;
};

// --- Mock Data ---
const MODEL_DATA = {
  title: "梅尔卡巴",
  author: "小文同学",
  stats: [
    { label: "零件总数", value: "22 pcs", icon: Box },
    { label: "拼搭难度", value: "简单", icon: Wrench },
  ],
  sets: ["Creator 1", "Creator 3", "Project 1", "Advanced"],
  description: "梅尔卡巴神圣几何造型，以对称结构复刻宇宙奥义，彩球与短棍交织出极致平衡感。它在静态展示时拥有很强的体量感，在旋转观察时又能呈现不同层级的穿插关系，适合作为入门级却非常出效果的分享造型。",
  parts: [
    { name: "白球", count: 7, unit: "颗", kind: "ball", colorHex: "#F7F8FB" },
    { name: "红色短棍", count: 9, unit: "根", kind: "rod", size: "short", colorHex: "#EB4B4B" },
    { name: "蓝色中棍", count: 6, unit: "根", kind: "rod", size: "medium", colorHex: "#2F64F3" },
    { name: "白色长棍", count: 0, unit: "根", kind: "rod", size: "long", colorHex: "#F2F4F8" },
    { name: "黄色中棍", count: 0, unit: "根", kind: "rod", size: "medium", colorHex: "#F2C84B" },
  ] as PartItem[],
  communityWorks: [
    { id: 1, title: "红蓝多面体", author: "小雨", likes: 32, image: "https://picsum.photos/seed/zometool-red-blue/400/400" },
    { id: 2, title: "双子星对比", author: "Austin", likes: 27, image: "https://picsum.photos/seed/zometool-twins/400/400" },
    { id: 3, title: "创意城堡", author: "小明", likes: 15, image: "https://picsum.photos/seed/zometool-castle/400/400" },
    { id: 4, title: "几何之美", author: "Lily", likes: 42, image: "https://picsum.photos/seed/zometool-geo/400/400" },
  ],
  otherModels: [
    { id: 1, title: "病毒", pieces: "48 pcs", shapeType: 'tetrahedron', shapeColor: '#10B981' },
    { id: 2, title: "灵动的蝴蝶", pieces: "78 pcs", shapeType: 'box', shapeColor: '#8B5CF6' },
    { id: 3, title: "星形多面体", pieces: "120 pcs", shapeType: 'octahedron', shapeColor: '#F59E0B' },
    { id: 4, title: "DNA螺旋", pieces: "200 pcs", shapeType: 'dodecahedron', shapeColor: '#EC4899' },
  ],
  buildSteps: [
    { step: 1, image: "https://picsum.photos/seed/step1/800/600", part: { name: "白球", count: 3 } },
    { step: 2, image: "https://picsum.photos/seed/step2/800/600", part: { name: "红色短棍", count: 4 } },
    { step: 3, image: "https://picsum.photos/seed/step3/800/600", part: { name: "蓝色中棍", count: 2 } },
    { step: 4, image: "https://picsum.photos/seed/step4/800/600", part: { name: "白球", count: 4 } },
  ]
};

type AppOpenTarget = {
  title: string;
  destination: string;
};

const Mini3DModel = ({ type, color }: { type: string, color: string }) => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 10]} intensity={2} />
      <group>
        {type === 'octahedron' && (
          <>
            <mesh>
              <octahedronGeometry args={[2, 0]} />
              <meshStandardMaterial color={color} wireframe={true} transparent opacity={0.4} />
            </mesh>
            <mesh>
              <octahedronGeometry args={[1.95, 0]} />
              <meshStandardMaterial color="#F0F2F5" transparent opacity={0.9} />
            </mesh>
          </>
        )}
        {type === 'dodecahedron' && (
          <>
            <mesh>
              <dodecahedronGeometry args={[1.6, 0]} />
              <meshStandardMaterial color={color} wireframe={true} transparent opacity={0.4} />
            </mesh>
            <mesh>
              <dodecahedronGeometry args={[1.55, 0]} />
              <meshStandardMaterial color="#F0F2F5" transparent opacity={0.9} />
            </mesh>
          </>
        )}
        {type === 'tetrahedron' && (
          <>
            <mesh>
              <tetrahedronGeometry args={[1.8, 0]} />
              <meshStandardMaterial color={color} wireframe={true} transparent opacity={0.4} />
            </mesh>
            <mesh>
              <tetrahedronGeometry args={[1.75, 0]} />
              <meshStandardMaterial color="#F0F2F5" transparent opacity={0.9} />
            </mesh>
          </>
        )}
        {type === 'box' && (
          <>
            <mesh>
              <boxGeometry args={[1.8, 1.8, 1.8]} />
              <meshStandardMaterial color={color} wireframe={true} transparent opacity={0.4} />
            </mesh>
            <mesh>
              <boxGeometry args={[1.75, 1.75, 1.75]} />
              <meshStandardMaterial color="#F0F2F5" transparent opacity={0.9} />
            </mesh>
          </>
        )}
      </group>
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
};

const PartIllustration = ({ part }: { part: PartItem }) => {
  const isInactive = part.count === 0;
  const gradientId = React.useId();
  const strokeColor = isInactive ? "#D8DCE5" : "#B9C0CC";
  const baseRodColor = isInactive ? "#E8EBF1" : (part.colorHex ?? "#D5DAE4");
  const rodWidth = part.size === 'long' ? 150 : part.size === 'medium' ? 114 : 82;

  if (part.kind === 'ball') {
    return (
      <div
        className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-opacity ${isInactive ? 'opacity-55' : ''}`}
        style={{
          background:
            "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.98) 0%, rgba(248,249,252,0.98) 42%, rgba(227,232,240,0.96) 70%, rgba(206,214,226,0.95) 100%)",
          boxShadow: isInactive
            ? "inset -8px -10px 14px rgba(195,202,215,0.42), inset 8px 8px 12px rgba(255,255,255,0.92)"
            : "inset -10px -12px 16px rgba(202,210,221,0.55), inset 10px 10px 14px rgba(255,255,255,0.98), 0 12px 20px rgba(102,112,131,0.08)",
        }}
      >
        <svg viewBox="0 0 80 80" className="h-full w-full">
          <defs>
            <radialGradient id={gradientId} cx="34%" cy="30%" r="76%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="42%" stopColor={isInactive ? "#F4F6FA" : "#F8FAFD"} />
              <stop offset="100%" stopColor={isInactive ? "#DCE2EB" : "#CBD4E0"} />
            </radialGradient>
          </defs>
          <circle cx="40" cy="40" r="31" fill={`url(#${gradientId})`} />
          <circle cx="40" cy="40" r="31" fill="none" stroke={strokeColor} strokeWidth="1.3" opacity="0.95" />
          {[
            [40, 15], [23, 24], [57, 24], [18, 41], [62, 41], [29, 56], [51, 56], [40, 66],
          ].map(([cx, cy], idx) => (
            <g key={`${cx}-${cy}-${idx}`}>
              <circle cx={cx} cy={cy} r="5.6" fill={isInactive ? "#EEF1F5" : "#FFFFFF"} stroke="#C5CCD8" strokeWidth="1" />
              <circle cx={cx} cy={cy} r="2.4" fill={isInactive ? "#D9DFE8" : "#D4DCE7"} />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`flex h-20 items-center justify-center transition-opacity ${isInactive ? 'opacity-55' : ''}`}
      style={{ width: Math.max(rodWidth + 26, 118) }}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: rodWidth + 18, height: 28 }}
      >
        <span
          className="absolute left-0 h-4 w-4 rounded-full border"
          style={{
            backgroundColor: isInactive ? "#F8FAFD" : "#FFFFFF",
            borderColor: isInactive ? "#D5DAE2" : "#CBD3DF",
            boxShadow: isInactive ? "none" : "0 1px 2px rgba(31,41,55,0.08)",
          }}
        />
        <span
          className="absolute right-0 h-4 w-4 rounded-full border"
          style={{
            backgroundColor: isInactive ? "#F8FAFD" : "#FFFFFF",
            borderColor: isInactive ? "#D5DAE2" : "#CBD3DF",
            boxShadow: isInactive ? "none" : "0 1px 2px rgba(31,41,55,0.08)",
          }}
        />
        <span
          className="absolute left-[8px] rounded-full"
          style={{
            width: rodWidth,
            height: 14,
            background: isInactive
              ? "linear-gradient(180deg, #F0F3F8 0%, #E4E8EF 100%)"
              : `linear-gradient(180deg, #FFFFFF 0%, ${baseRodColor} 16%, ${baseRodColor} 84%, #FFFFFF 100%)`,
            boxShadow: isInactive
              ? "inset 0 0 0 1px rgba(196,204,215,0.55)"
              : `inset 0 0 0 1px rgba(255,255,255,0.5), 0 2px 5px color-mix(in srgb, ${baseRodColor} 24%, transparent)`,
          }}
        >
          <span
            className="absolute left-[10%] top-[2px] h-[3px] rounded-full"
            style={{
              width: rodWidth * 0.78,
              background: isInactive ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.78)",
            }}
          />
        </span>
      </div>
    </div>
  );
};

const ProgressiveModel = ({ step, onInteract }: { step: number, onInteract?: () => void }) => {
  const [isInteracting, setIsInteracting] = React.useState(false);

  React.useEffect(() => {
    setIsInteracting(false);
  }, [step]);

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 10]} intensity={2} />
      <directionalLight position={[-10, -10, -10]} intensity={0.5} />
      
      {step === 1 && (
        <group>
          <mesh><sphereGeometry args={[0.4, 32, 32]} /><meshStandardMaterial color="#F0F2F5" roughness={0.1} metalness={0.1} /></mesh>
          <mesh position={[0, 1, 0]}><cylinderGeometry args={[0.08, 0.08, 2]} /><meshStandardMaterial color="#E84545" /></mesh>
          <mesh position={[0.866, -0.5, 0]} rotation={[0, 0, -Math.PI/3]}><cylinderGeometry args={[0.08, 0.08, 2]} /><meshStandardMaterial color="#E84545" /></mesh>
          <mesh position={[-0.866, -0.5, 0]} rotation={[0, 0, Math.PI/3]}><cylinderGeometry args={[0.08, 0.08, 2]} /><meshStandardMaterial color="#E84545" /></mesh>
        </group>
      )}
      
      {step === 2 && (
        <group>
          <mesh>
            <tetrahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial color="#E84545" wireframe={true} transparent opacity={0.6} />
          </mesh>
          <mesh>
            <tetrahedronGeometry args={[1.45, 0]} />
            <meshStandardMaterial color="#F0F2F5" transparent opacity={0.9} roughness={0.1} metalness={0.1} />
          </mesh>
        </group>
      )}

      {step === 3 && (
        <group>
          <mesh>
            <octahedronGeometry args={[1.8, 0]} />
            <meshStandardMaterial color="#2A5BD7" wireframe={true} transparent opacity={0.5} />
          </mesh>
          <mesh>
            <octahedronGeometry args={[1.75, 0]} />
            <meshStandardMaterial color="#F0F2F5" transparent opacity={0.9} roughness={0.1} metalness={0.1} />
          </mesh>
        </group>
      )}

      {step === 4 && (
        <group>
          <mesh>
            <icosahedronGeometry args={[2, 0]} />
            <meshStandardMaterial color="#2A5BD7" wireframe={true} transparent opacity={0.3} />
          </mesh>
          <mesh>
            <icosahedronGeometry args={[1.98, 0]} />
            <meshStandardMaterial color="#F0F2F5" transparent opacity={0.9} roughness={0.1} metalness={0.1} />
          </mesh>
        </group>
      )}

      <OrbitControls 
        enablePan={false} 
        minDistance={3} 
        maxDistance={10} 
        onStart={() => {
          setIsInteracting(true);
          onInteract?.();
        }}
      />
    </Canvas>
  );
};

export default function App() {
  const [appOpenTarget, setAppOpenTarget] = useState<AppOpenTarget | null>(null);
  const [isPartsModalOpen, setIsPartsModalOpen] = useState(false);
  const [isBuildViewOpen, setIsBuildViewOpen] = useState(false);
  const [miniPreviewVersion, setMiniPreviewVersion] = useState(0);
  const [isCurrentPartCompact, setIsCurrentPartCompact] = useState(false);
  
  // Build View State
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompletionSheetOpen, setIsCompletionSheetOpen] = useState(false);
  const [hasInteracted3D, setHasInteracted3D] = useState(false);

  const totalSteps = MODEL_DATA.buildSteps.length;
  const currentBuildPart = MODEL_DATA.buildSteps[currentStep - 1].part;
  const currentBuildPartDetail = MODEL_DATA.parts.find((part) => part.name === currentBuildPart.name) ?? {
    name: currentBuildPart.name,
    count: currentBuildPart.count,
    unit: '根' as const,
    kind: 'rod' as const,
    size: 'medium' as const,
    colorHex: '#D5DAE4',
  };
  const currentPartAccentClass =
    currentBuildPartDetail.kind === 'ball'
      ? 'text-[#141414]'
      : currentBuildPartDetail.colorHex === '#2F64F3'
        ? 'text-[#178FC7]'
        : currentBuildPartDetail.colorHex === '#F2C84B'
          ? 'text-[#E5A100]'
          : currentBuildPartDetail.colorHex === '#EB4B4B'
            ? 'text-[#D94B46]'
            : 'text-[#141414]';

  React.useEffect(() => {
    if (isBuildViewOpen) {
      setIsCurrentPartCompact(false);
    }
  }, [isBuildViewOpen]);

  const openAppPrompt = (target: AppOpenTarget) => {
    setAppOpenTarget(target);
  };

  const closeAppPrompt = () => {
    setAppOpenTarget(null);
    setMiniPreviewVersion((version) => version + 1);
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompletionSheetOpen(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReplay = () => {
    setCurrentStep(1);
    setIsCompletionSheetOpen(false);
  };

  const openBuildView = () => {
    setCurrentStep(1);
    setHasInteracted3D(false);
    setIsBuildViewOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1D1D1F] font-sans pb-12 selection:bg-blue-200">
      {/* WeChat H5 Navigation Bar */}
      <div className="sticky top-0 z-50 bg-[#F2F2F7] px-4 py-3 flex items-center justify-between border-b border-gray-200/50">
        <X size={24} className="text-gray-900 cursor-pointer" />
        <span className="font-medium text-base">Zometool</span>
        <MoreHorizontal size={24} className="text-gray-900 cursor-pointer" />
      </div>

      {/* Download App Banner */}
      <header className="bg-white px-4 py-3 flex items-center justify-between shadow-sm relative z-40">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
            Z
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-sm leading-tight truncate">Zometool App</h1>
            <p className="text-xs text-gray-500 truncate">在家拼出空间思维，成就未来全科精英</p>
          </div>
        </div>
        <button 
          onClick={() => openAppPrompt({
            title: "即将打开 Zometool",
            destination: "造型库首页",
          })}
          className="bg-[#2A5BD7] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm hover:opacity-90 transition-opacity shrink-0 ml-3"
        >
          打开 App
        </button>
      </header>

      {/* Hero Section */}
      <div className="bg-white rounded-b-[40px] relative z-10 shadow-sm border-b border-gray-100">
        {/* 3D Canvas */}
        <div className="w-full aspect-[10/9] cursor-move">
          <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 10]} intensity={2} />
            <directionalLight position={[-10, -10, -10]} intensity={0.5} />
            <group>
              <mesh>
                <icosahedronGeometry args={[2, 0]} />
                <meshStandardMaterial color="#2A5BD7" wireframe={true} transparent opacity={0.3} />
              </mesh>
              <mesh>
                <icosahedronGeometry args={[1.98, 0]} />
                <meshStandardMaterial color="#F0F2F5" transparent opacity={0.9} roughness={0.1} metalness={0.1} />
              </mesh>
            </group>
            <OrbitControls enablePan={false} autoRotate autoRotateSpeed={2} minDistance={3} maxDistance={10} />
          </Canvas>
        </div>
      </div>

      <main className="max-w-md mx-auto pb-32">
        {/* Header Area */}
        <div className="px-4 mt-6 mb-6 flex flex-col items-center text-center">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 leading-tight mb-3">
            {MODEL_DATA.title}
          </h1>
          <button
            type="button"
            onClick={() => openAppPrompt({
              title: "即将打开 Zometool",
              destination: "作者个人主页",
            })}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-gray-200/60 hover:bg-white transition-colors"
          >
            <span className="text-xs text-gray-500 font-medium">原创 by:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">文</div>
              <span className="text-sm font-bold text-gray-800">{MODEL_DATA.author}</span>
            </div>
          </button>
        </div>

        {/* Content Sections */}
        <div className="px-4 flex flex-col gap-4">
          
          {/* Info Bento Grid */}
          <div className="grid grid-cols-2 gap-3">
            {MODEL_DATA.stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <stat.icon size={16} />
                    <span className="text-xs font-medium">{stat.label}</span>
                  </div>
                  {stat.label === "零件总数" && (
                    <button 
                      onClick={() => setIsPartsModalOpen(true)}
                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#FFBD1E]/15 text-[#D99B10] hover:bg-[#FFBD1E]/25 transition-colors"
                      title="查看零件清单"
                    >
                      <Layers size={12} />
                      <span className="text-[10px] font-bold">清单</span>
                    </button>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <strong className="text-2xl font-black text-gray-900">
                    {stat.value.replace(' pcs', '')}
                  </strong>
                  {stat.value.includes('pcs') && (
                    <span className="text-sm font-bold text-gray-400">pcs</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sets Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-500 mb-3">
              <Layers size={16} />
              <span className="text-xs font-medium">适用套装</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {MODEL_DATA.sets.map((set, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-xl border border-gray-100/80">
                  {set}
                </span>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-[#2A5BD7] rounded-full" />
              <h3 className="font-bold text-gray-900 text-lg">造型说明</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {MODEL_DATA.description}
            </p>
          </section>

          {/* Community Inspiration */}
          <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-[#2A5BD7] rounded-full" />
                <h3 className="font-bold text-gray-900 text-lg">跟拼作品</h3>
              </div>
              <button 
                onClick={() => openAppPrompt({
                  title: "即将打开 Zometool",
                  destination: "该造型的跟拼作品列表",
                })}
                className="text-sm text-gray-500 font-medium hover:text-gray-900"
              >
                查看更多
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MODEL_DATA.communityWorks.map(work => (
                <button 
                  key={work.id}
                  onClick={() => openAppPrompt({
                    title: "即将打开 Zometool",
                    destination: `“${work.title}”跟拼作品详情`,
                  })}
                  className="text-left group"
                >
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-2 bg-gray-100 relative">
                    <img 
                      src={work.image} 
                      alt={work.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900 truncate">{work.title}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="truncate">{work.author}</span>
                    <div className="flex items-center gap-1">
                      <Heart size={12} />
                      <span>{work.likes}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Other Popular Models */}
          <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-[#E84545] rounded-full" />
                <h3 className="font-bold text-gray-900 text-lg">其他热门造型</h3>
              </div>
              <button 
                onClick={() => openAppPrompt({
                  title: "即将打开 Zometool",
                  destination: "热门造型列表页",
                })}
                className="text-sm text-gray-500 font-medium hover:text-gray-900"
              >
                查看更多
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MODEL_DATA.otherModels.map(model => (
                <button 
                  key={model.id}
                  onClick={() => openAppPrompt({
                    title: "即将打开 Zometool",
                    destination: `“${model.title}”造型详情页`,
                  })}
                  className="text-left group"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden mb-2 bg-gray-50 relative pointer-events-none">
                    {!isBuildViewOpen && (
                      <Mini3DModel key={`${model.id}-${miniPreviewVersion}`} type={model.shapeType} color={model.shapeColor} />
                    )}
                  </div>
                  <h4 className="font-bold text-sm mb-0.5 text-gray-900 truncate">{model.title}</h4>
                  <span className="text-xs text-gray-500">{model.pieces}</span>
                </button>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* --- Modals & Overlays --- */}

      {/* App Prompt Modal */}
      <AnimatePresence>
        {appOpenTarget && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              className="w-full max-w-sm overflow-hidden rounded-[28px] bg-[#2C2C2E] text-white shadow-2xl"
            >
              <div className="border-b border-white/10 px-8 py-7 text-center">
                <h3 className="mb-3 text-[20px] font-bold leading-tight">
                  {appOpenTarget.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/75">
                  将跳转至 {appOpenTarget.destination}
                </p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-white/10">
                <button
                  onClick={closeAppPrompt}
                  className="py-4 text-center text-[17px] font-medium text-white/80 transition-colors hover:bg-white/5"
                >
                  取消
                </button>
                <button 
                  onClick={closeAppPrompt}
                  className="py-4 text-center text-[17px] font-medium text-[#6EA8FF] transition-colors hover:bg-white/5"
                >
                  允许
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parts Modal */}
      <AnimatePresence>
        {isPartsModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm sm:p-4"
          >
            <div className="absolute inset-0" onClick={() => setIsPartsModalOpen(false)} />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[var(--color-card-bg)] rounded-t-[var(--radius-bento)] sm:rounded-[var(--radius-bento)] w-full max-w-md shadow-2xl relative flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-[var(--color-text-main)]">零件清单</h3>
                <button 
                  onClick={() => setIsPartsModalOpen(false)}
                  className="w-8 h-8 bg-[var(--color-bg-app)] rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:opacity-80 transition-opacity"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="rounded-[30px] bg-[#F2F1EF] px-5 py-5">
                  {MODEL_DATA.parts.map((part, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between gap-3 py-2.5 transition-opacity ${
                        idx !== MODEL_DATA.parts.length - 1 ? 'border-b border-black/[0.03]' : ''
                      } ${part.count === 0 ? 'opacity-60' : ''}`}
                    >
                      <div className="flex min-w-0 items-baseline gap-3">
                        <span
                          className={`shrink-0 text-[15px] font-bold leading-none ${
                            part.count === 0
                              ? 'text-[#BFC6D1]'
                              : part.kind === 'ball'
                                ? 'text-[#141414]'
                                : part.colorHex === '#2F64F3'
                                  ? 'text-[#178FC7]'
                                  : part.colorHex === '#F2C84B'
                                    ? 'text-[#E5A100]'
                                    : part.colorHex === '#EB4B4B'
                                      ? 'text-[#D94B46]'
                                      : 'text-[#141414]'
                          }`}
                        >
                          {part.name}
                        </span>
                        <span
                          className={`shrink-0 text-[15px] font-bold leading-none ${
                            part.count === 0
                              ? 'text-[#BFC6D1]'
                              : part.kind === 'ball'
                                ? 'text-[#141414]'
                                : part.colorHex === '#2F64F3'
                                  ? 'text-[#178FC7]'
                                  : part.colorHex === '#F2C84B'
                                    ? 'text-[#E5A100]'
                                    : part.colorHex === '#EB4B4B'
                                      ? 'text-[#D94B46]'
                                      : 'text-[#141414]'
                          }`}
                        >
                          x{part.count}
                        </span>
                      </div>
                      <div className="ml-3 shrink-0 scale-[0.72] origin-right">
                        <PartIllustration part={part} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Build View (Fullscreen) */}
      <AnimatePresence>
        {isBuildViewOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex flex-col bg-[#F6F7FB] text-[#1D1D1F]"
          >
            {/* Topbar */}
            <div className="z-10 flex items-center justify-between bg-gradient-to-b from-white via-white/92 to-transparent p-4">
              <button 
                onClick={() => setIsBuildViewOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/6 transition-colors hover:bg-gray-50"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="font-medium text-sm tracking-wide opacity-80">
                {MODEL_DATA.title} | Zometool
              </div>
              <div className="w-10 h-10" /> {/* Spacer */}
            </div>

            {/* HUD */}
            <div className="absolute top-20 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
              <button
                onClick={() => setIsCurrentPartCompact((prev) => !prev)}
                className="pointer-events-auto flex rounded-[22px] border border-black/5 bg-[#EFEFED]/96 px-4 py-3 text-left shadow-[0_8px_18px_rgba(31,41,55,0.07)] backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5"
                type="button"
              >
                <div className="flex min-h-[56px] items-center gap-3">
                  <div className="min-w-[108px]">
                    <div className="mb-1.5 text-[9px] uppercase tracking-[0.2em] text-[#8A8F98]">当前所需</div>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-[15px] font-bold leading-none ${currentPartAccentClass}`}>
                        {currentBuildPart.name}
                      </span>
                      <span className={`text-[15px] font-bold leading-none ${currentPartAccentClass}`}>
                        x{currentBuildPart.count}
                      </span>
                    </div>
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    {!isCurrentPartCompact && (
                      <motion.div
                        key={`${currentBuildPart.name}-illustration`}
                        initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                        animate={{ opacity: 1, width: 'auto', marginLeft: 4 }}
                        exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="scale-[0.58] origin-center">
                          <PartIllustration
                            part={{
                              ...currentBuildPartDetail,
                              count: currentBuildPart.count,
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
              <div className="flex flex-col gap-2 pointer-events-auto">
                <button className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-black/6 bg-white/92 px-3 text-sm font-medium shadow-sm backdrop-blur-md transition-colors hover:bg-gray-50">
                  <RotateCcw size={16} />
                  视角重置
                </button>
              </div>
            </div>

            {/* Stage */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentStep}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full cursor-move"
                >
                  <ProgressiveModel step={currentStep} onInteract={() => setHasInteracted3D(true)} />
                </motion.div>
              </AnimatePresence>

              {/* Interaction Tooltip */}
              <AnimatePresence>
                {!hasInteracted3D && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-black/6 bg-white/92 px-4 py-2 text-xs text-[#1D1D1F] shadow-sm backdrop-blur-md pointer-events-none"
                  >
                    <Move size={14} className="animate-pulse" />
                    <span>滑动屏幕旋转查看</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Nav */}
            <div className="z-10 bg-gradient-to-t from-white via-white/94 to-transparent p-6">
              <div className="flex items-center justify-between max-w-md mx-auto gap-6">
                <button 
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#1D1D1F] shadow-sm ring-1 ring-black/6 backdrop-blur transition-colors hover:bg-gray-50 disabled:opacity-30"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <div className="flex-1 flex flex-col items-center gap-3">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/12">
                    <motion.div 
                      className="h-full bg-[var(--color-accent-blue)] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="text-sm font-mono font-bold tracking-widest text-[#1D1D1F]">
                    {currentStep} <span className="text-black/35">/ {totalSteps}</span>
                  </div>
                </div>

                {currentStep === totalSteps ? (
                  <button 
                    onClick={() => setIsCompletionSheetOpen(true)}
                    className="px-6 h-14 rounded-full bg-[#2A5BD7] text-white font-bold flex items-center justify-center hover:bg-blue-700 transition-colors flex-shrink-0 shadow-[0_0_20px_rgba(42,91,215,0.4)]"
                  >
                    查看更多造型
                  </button>
                ) : (
                  <button 
                    onClick={handleNextStep}
                    className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </div>
            </div>

            {/* Completion Sheet */}
            <AnimatePresence>
              {isCompletionSheetOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm"
                >
                  <motion.div 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="bg-[var(--color-card-bg)] text-[var(--color-text-main)] rounded-t-[2rem] w-full p-8 pb-12 shadow-2xl"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-black mb-3">想看更多 3D 造型？</h3>
                      <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                        海量酷炫造型尽在 Zometool App，等你来解锁！
                      </p>
                    </div>

                    {/* Marquee */}
                    <div className="flex overflow-hidden gap-3 mb-8 -mx-8 px-8">
                      <motion.div 
                        animate={{ x: [0, -1000] }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        className="flex gap-3"
                      >
                        {[...MODEL_DATA.otherModels, ...MODEL_DATA.otherModels].map((item, i) => (
                          <div key={i} className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 pointer-events-none">
                            <Mini3DModel key={`${item.id}-${i}-${miniPreviewVersion}`} type={item.shapeType} color={item.shapeColor} />
                          </div>
                        ))}
                      </motion.div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => openAppPrompt({
                          title: "即将打开 Zometool",
                          destination: "当前造型详情页",
                        })}
                        className="w-full bg-[var(--color-accent-blue)] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-600/20"
                      >
                        打开 App
                      </button>
                      <button 
                        onClick={handleReplay}
                        className="w-full bg-gray-50 text-[var(--color-text-main)] font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        稍后再说
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Bottom Action Bar */}
      {!isBuildViewOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-white/0 via-white/82 to-white" />
          <div className="relative max-w-md mx-auto px-4 pb-8 pt-16 pointer-events-auto">
            <button 
              onClick={() => setIsBuildViewOpen(true)}
              className="w-full bg-[#2A5BD7] text-white font-bold text-lg py-4 rounded-2xl shadow-[0_4px_0_#1E40AF] flex items-center justify-center gap-2 hover:translate-y-[2px] hover:shadow-[0_2px_0_#1E40AF] active:translate-y-[4px] active:shadow-none transition-all"
            >
              <Box size={20} /> 开始拼搭
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
