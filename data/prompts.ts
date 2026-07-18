export interface PromptTemplate {
  id: string;
  title: string;
  enTitle: string;
  category: string;
  prompt: string;
  enPrompt: string;
  icon: string;
}

export const promptCategories = [
  { id: 'fabric', label: '布料服饰', enLabel: 'Fabric & Apparel', icon: '👕' },
  { id: 'hard', label: '硬质产品', enLabel: 'Hard Goods', icon: '🥤' },
  { id: 'tech', label: '数码配件', enLabel: 'Tech Accessories', icon: '📱' },
  { id: 'luxury', label: '高端质感', enLabel: 'Luxury & Premium', icon: '💎' },
  { id: 'style', label: '风格美学', enLabel: 'Style & Aesthetic', icon: '🎨' },
];

export const promptLibrary: PromptTemplate[] = [
  // === Fabric / Apparel ===
  {
    id: 'fabric-standard',
    title: '标准织物融合',
    enTitle: 'Standard Fabric Composite',
    category: 'fabric',
    icon: '👕',
    prompt: '将 Logo 无缝合成到产品表面。确保 Logo 跟随面料的自然褶皱、折叠和垂坠感，具有真实的透视扭曲效果。Logo 应看起来像是直接印染或丝印在面料上，边缘柔化自然，而非贴纸效果。保持整体合成的光影和色彩平衡。输出带有影棚灯光的逼真产品 Mockup。',
    enPrompt: 'Composite the logo seamlessly onto the product surface. Ensure the logo follows the natural fabric wrinkles, folds, and draping of the material with realistic perspective warping. The logo should appear dyed or screen-printed directly onto the fabric with proper edge softness, not like a sticker. Maintain consistent lighting, shadows, and color balance across the entire composite. Output a photorealistic product mockup with studio lighting.',
  },
  {
    id: 'fabric-embroidery',
    title: '刺绣工艺效果',
    enTitle: 'Embroidery Effect',
    category: 'fabric',
    icon: '🧵',
    prompt: '将 Logo 渲染为面料上的精美刺绣。Logo 的每个元素应有凸起的线迹纹理、微妙的 3D 立体感、可见的针脚线条，以及边缘的面料轻微皱缩。线迹在光线照射下呈现自然光泽。刺绣密集处的面料呈现真实的变形效果。输出微距级产品细节照。',
    enPrompt: 'Render the logo as premium embroidery on the fabric surface. Each element of the logo should have a raised thread texture with subtle 3D depth, visible stitch lines, and slight fabric puckering around the edges. The thread should catch the light naturally with a soft sheen. The underlying fabric shows realistic distortion where the embroidery is dense. Output a macro-quality product detail shot.',
  },
  {
    id: 'fabric-premium',
    title: '高端时装质感',
    enTitle: 'Premium Fashion Texture',
    category: 'fabric',
    icon: '👔',
    prompt: '打造奢华时尚品牌 Mockup。采用高品质丝印或烫金工艺将 Logo 融入高端服装面料。使用强调面料编织纹理的戏剧性影棚灯光，带有柔和的阴影。Logo 具有微妙的金属光泽或哑光质感。整体效果应如品牌画册的编辑级摄影作品。',
    enPrompt: 'Create a luxury fashion brand mockup. The logo is integrated with premium screen-print or foil-stamping technique on high-end garment fabric. Use dramatic studio lighting with soft shadows that emphasize the fabric weave texture. The logo has a subtle metallic sheen or matte finish depending on the material. The overall image should look like a lookbook editorial photograph.',
  },
  {
    id: 'fabric-sportswear',
    title: '运动服饰醒目',
    enTitle: 'Sportswear Bold Print',
    category: 'fabric',
    icon: '🏃',
    prompt: '将 Logo 以醒目的运动服饰印花方式应用到功能性运动面料上。Logo 应呈现高品质热转印或升华印效果，色彩饱和鲜艳，略带光泽。面料具有技术纹理，可见吸湿排汗的细节。动态光线暗示活跃的运动场景。Logo 在贴合身体曲线和面料拉伸的同时保持清晰锐利。',
    enPrompt: 'Apply the logo as a bold sportswear print on performance athletic fabric. The logo should look like a high-quality heat-transfer or sublimation print with vibrant color saturation and slight sheen. The fabric has a technical texture with moisture-wicking visible detail. Dynamic lighting suggests an active lifestyle context. The logo remains crisp while conforming to the body contour and fabric stretch.',
  },
  {
    id: 'fabric-denim',
    title: '丹宁牛仔质感',
    enTitle: 'Denim Texture',
    category: 'fabric',
    icon: '👖',
    prompt: '将 Logo 嵌入丹宁面料，呈现真实的纹理交互。Logo 应表现为高品质的布标、刺绣或印花，位于粗犷的丹宁表面。可见的丹宁编织纹理应微妙地透出 Logo 边缘。自然的靛蓝色变化和面料折痕应与 Logo 布局产生互动。影棚灯光搭配轻微的边缘轮廓光。',
    enPrompt: 'Embed the logo onto denim fabric with realistic texture interaction. The logo should appear as a high-quality patch, embroidery, or screen print on the rugged denim surface. Visible denim weave texture should subtly show through the logo edges. Natural indigo color variation and fabric creases should interact with the logo placement. Studio lighting with slight edge rim light.',
  },

  // === Hard Goods ===
  {
    id: 'hard-mug',
    title: '杯具环绕贴印',
    enTitle: 'Mug Wrap Print',
    category: 'hard',
    icon: '☕',
    prompt: '将 Logo 环绕在陶瓷或不锈钢杯/水瓶上，具有精确的圆柱扭曲效果。Logo 跟随产品曲率产生正确的水平畸变，呈现逼真的 3D 环绕效果。在光泽表面上加入微妙的反射，部分覆盖 Logo。光线在圆柱体上呈现柔和的渐变，带有一处柔和的高光。逼真的产品摄影风格。',
    enPrompt: 'Wrap the logo around a ceramic or stainless steel mug/water bottle with precise cylindrical warping. The logo follows the curvature of the product with proper horizontal distortion, creating a realistic 3D wrap effect. Include subtle reflections on the glossy surface that partially overlay the logo. The lighting should show a gentle gradient across the cylindrical form with a soft specular highlight. Photorealistic product photography style.',
  },
  {
    id: 'hard-ceramic',
    title: '陶瓷表面烫印',
    enTitle: 'Ceramic Decal Print',
    category: 'hard',
    icon: '🍶',
    prompt: '采用高档花纸或热转印工艺将 Logo 施加到釉面陶瓷表面。Logo 贴合陶瓷的弧形表面，透视效果真实。光滑的陶瓷表面在 Logo 区域形成微妙的反射。温暖的影棚光线凸显光滑的质感和立体形态。Logo 边缘与釉面自然融合，无可见过渡线。',
    enPrompt: 'Apply the logo onto a glazed ceramic surface using a premium decal or heat-transfer technique. The logo conforms to the curved ceramic surface with realistic perspective. The glossy ceramic finish creates subtle reflections over the logo area. Warm studio lighting emphasizes the smooth texture and dimensional form. The logo edges merge cleanly with the glaze with no visible transition line.',
  },
  {
    id: 'hard-metal',
    title: '金属蚀刻/镭雕',
    enTitle: 'Metal Etching / Laser Engraving',
    category: 'hard',
    icon: '⚙️',
    prompt: '将 Logo 蚀刻或雕刻到拉丝金属表面。Logo 应呈现激光雕刻效果，具有精细的细节、雕刻凹槽内的微妙深度和阴影。周围的金属表面具有定向拉丝纹理和自然的氧化或阳极氧化颜色。光线在金属上形成光泽，带有贯穿 Logo 区域的锐利高光。工业产品摄影风格。',
    enPrompt: 'Etch or engrave the logo onto a brushed metal surface. The logo should appear laser-etched with precise fine detail, showing subtle depth and shadow within the engraved grooves. The surrounding metal surface has a directional brushed texture and natural oxidation or anodized color. Lighting creates a metallic sheen with a sharp specular highlight that crosses the logo area. Industrial product photography style.',
  },
  {
    id: 'hard-glass',
    title: '玻璃磨砂/UV印',
    enTitle: 'Glass Frost / UV Print',
    category: 'hard',
    icon: '🔮',
    prompt: '将 Logo 以磨砂蚀刻或 UV 印刷方式施加到玻璃表面。蚀刻效果的 Logo 应具有半透明质感和柔化边缘；UV 印刷则呈现鲜艳的不透明色彩。玻璃上的反射和折射与 Logo 层产生微妙的互动。背光或侧光营造高端的发光效果。清晰的水晶质感影棚摄影，带有戏剧性阴影。',
    enPrompt: 'Apply the logo as a frost/etched or UV print onto a glass surface. The logo should have a slightly translucent quality with frosted edge softness if etched, or vibrant opacity if UV printed. The glass shows reflections and refractions that subtly interact with the logo layer. Backlighting or side-lighting creates a premium glowing effect. Crystal clear studio photography with dramatic shadows.',
  },
  {
    id: 'hard-wood',
    title: '木质激光雕刻',
    enTitle: 'Wood Laser Engraving',
    category: 'hard',
    icon: '🪵',
    prompt: '将 Logo 灼刻或激光雕刻到天然木纹表面。Logo 跟随木材的有机曲线，雕刻区域具有真实的深度和边缘碳化效果，填充区域则为光滑的漆面处理。天然木纹在 Logo 区域微妙地延续。温暖的氛围光线突出了木材的自然色调和质感。手工艺产品摄影风格。',
    enPrompt: 'Burn or laser-engrave the logo into natural wood grain surface. The logo follows the organic curves of the wood with realistic depth and charring at the edges for engraved areas, or appears as a smooth painted finish for filled areas. The natural wood grain pattern continues subtly through the logo area. Warm ambient lighting emphasizes the natural wood tones and texture. Artisanal product photography style.',
  },

  // === Tech Accessories ===
  {
    id: 'tech-phone',
    title: '手机壳UV彩印',
    enTitle: 'Phone Case UV Print',
    category: 'tech',
    icon: '📱',
    prompt: '在高端手机壳上进行全边缘包裹印刷。Logo 贴合手机壳轮廓，包括摄像头凸起和侧面边缘，透视映射精确。光泽或哑光的表面处理产生真实的表面反射，部分覆盖 Logo。影棚灯光在弧形壳面上呈现柔和渐变。Logo 应看起来嵌入壳材质中，而非浮于表面。',
    enPrompt: 'Print the logo onto a premium phone case with full-edge wrapping. The logo conforms to the case contours including the camera bump and side edges with precise perspective mapping. The glossy or matte case finish creates realistic surface reflections that partially overlay the logo. Studio lighting with a subtle gradient across the curved case surface. The logo should look embedded in the case material, not layered on top.',
  },
  {
    id: 'tech-laptop',
    title: '笔记本/平板贴膜',
    enTitle: 'Laptop / Tablet Skin',
    category: 'tech',
    icon: '💻',
    prompt: '将 Logo 作为高级贴膜应用在笔记本/平板表面。Logo 精确对齐设备几何结构，包括铰链区域和边缘曲线。表面呈现微妙的拉丝金属或哑光质感，Logo 以高品质贴膜或蚀刻徽章形式融入。自然的办公室光线配柔和的窗外反射。专业产品摄影风格。',
    enPrompt: 'Apply the logo as a premium skin or decal on a laptop/tablet surface. The logo precisely aligns with the device geometry including hinge area and edge curves. The surface shows a subtle brushed metal or matte finish with the logo integrated as a high-quality vinyl wrap or etched metal badge. Natural office lighting with soft window reflections. Professional product photography style.',
  },
  {
    id: 'tech-smartwatch',
    title: '智能手表表盘',
    enTitle: 'Smartwatch Face',
    category: 'tech',
    icon: '⌚',
    prompt: '将 Logo 渲染在智能手表表盘或表带上。如在表盘上，Logo 应表现为精致的雕刻或印刷标记，位于屏幕中心或底部边框区域。如在表带上，Logo 跟随弧形、柔性的表带材质，呈现真实的扭曲和拉伸。设备屏幕显示细微的反射和环境光交互。微距产品摄影配浅景深效果。',
    enPrompt: 'Render the logo on a smartwatch face or band. If on the watch face, the logo should appear as a refined engraved or printed mark in the center or bottom of the display bezel area. If on the band, the logo follows the curved, flexible band material with realistic warp and stretch. The device screen shows subtle reflections and ambient light interaction. Macro product photography with shallow depth of field.',
  },
  {
    id: 'tech-airpods',
    title: '耳机仓精致印',
    enTitle: 'Earbuds Case Print',
    category: 'tech',
    icon: '🎧',
    prompt: '将 Logo 应用在无线耳机充电仓上。Logo 精确贴合鹅卵石形状的弧形表面，球面扭曲准确。光泽或哑光塑料表面产生的自然光线反射穿过 Logo 区域。充电仓应看起来是出厂雕刻，而非贴纸。简洁的极简主义产品摄影配柔和的顶光。',
    enPrompt: 'Apply the logo onto a wireless earbuds charging case. The logo precisely conforms to the curved, pebble-like case surface with accurate spherical warping. The glossy or matte plastic finish creates natural light reflections that pass over the logo area. The case should look factory-engraved, not stickered. Clean minimalist product photography with soft overhead lighting.',
  },

  // === Luxury / Premium ===
  {
    id: 'luxury-gold',
    title: '烫金/压凹工艺',
    enTitle: 'Gold Foil / Embossing',
    category: 'luxury',
    icon: '✨',
    prompt: '采用烫金或压凹工艺将 Logo 应用在高端材料上。Logo 具有奢华的金、银或玫瑰金金属光泽，真实的光线反射和微妙的 3D 凸起或凹陷效果。周围材料为高级卡纸、皮革或天鹅绒。戏剧性的侧光强调压印区域的立体质感。超高端包装摄影。',
    enPrompt: 'Apply the logo using hot foil stamping or blind embossing on premium material. The logo should have a luxurious metallic gold, silver, or rose gold finish with realistic light reflection and a slight 3D raised or debossed appearance. The surrounding material is premium cardstock, leather, or velvet. Dramatic side-lighting emphasizes the dimensional quality of the stamped area. Ultra-premium packaging photography.',
  },
  {
    id: 'luxury-leather',
    title: '真皮压印/烫金',
    enTitle: 'Leather Embossing / Foil',
    category: 'luxury',
    icon: '👜',
    prompt: '将 Logo 压印或烫金在真皮表面。Logo 形成永久印记，自然光影在凹陷或凸起区域形成层次。皮革呈现真实的粒面质感、微妙的折痕和丰富的包浆。Logo 像是原始制造工艺的一部分融入皮革。温暖的影棚光线突出皮革的丰富质感。',
    enPrompt: 'Emboss or foil-stamp the logo onto genuine leather surface. The logo creates a permanent impression with natural light and shadow playing across the debossed or embossed area. The leather shows authentic grain texture, subtle creasing, and rich patina. The logo integrates into the leather as if it were part of the original manufacturing process. Studio lighting with warm tones emphasizing leather richness.',
  },
  {
    id: 'luxury-cosmetics',
    title: '美妆瓶身标签',
    enTitle: 'Cosmetics Bottle Label',
    category: 'luxury',
    icon: '💄',
    prompt: '将 Logo 应用在奢华美妆瓶或罐上。Logo 表现为精致的丝印、烫金或压印标记，位于磨砂或透明玻璃、陶瓷或高光塑料表面。容器具有高级的压手感，表面为柔触感或亮面处理。优雅的影棚光线配柔和渐变，Logo 区域有微小的反光点。编辑级美妆产品摄影风格。',
    enPrompt: 'Apply the logo onto a luxury cosmetics bottle or jar. The logo appears as a refined screen-print, hot-stamp, or debossed mark on frosted or clear glass, ceramic, or high-gloss plastic. The container has a premium weighted feel with soft-touch or gloss finish. Elegant studio lighting with soft gradients and a subtle catchlight on the logo area. Editorial beauty product photography style.',
  },
  {
    id: 'luxury-watch',
    title: '腕表精致铭刻',
    enTitle: 'Watch Fine Engraving',
    category: 'luxury',
    icon: '⌚',
    prompt: '将 Logo 铭刻在奢华腕表的表盘、后盖或表扣上。Logo 应呈现精密的微雕效果，在精细光线照射下可见锐利的边缘和微妙的深度。腕表采用蓝宝石水晶、抛光精钢或黄金等高级材料，具有复杂的反射。微距摄影风格，极致细节，展现抛光和拉丝表面上光线的交织。',
    enPrompt: 'Engrave the logo onto a luxury timepiece dial, case back, or buckle. The logo should appear as precision micro-engraving with sharp edges and subtle depth visible under rarefied lighting. The watch has premium materials like sapphire crystal, polished steel, or gold with complex reflections. Macro photography style with extreme detail, showing the interplay of light across polished and brushed surfaces.',
  },

  // === Style / Aesthetic ===
  {
    id: 'style-minimal',
    title: '极简干净风格',
    enTitle: 'Minimalist Clean Style',
    category: 'style',
    icon: '⬜',
    prompt: '创建极简美学 Mockup。Logo 以精确和低调的方式呈现——小型居中或作为微妙的满版重复图案。产品在干净的素色背景上拍摄，使用柔和的散射光。整体感觉简约、现代、含蓄，留有大量留白空间。Logo 融合完美但不张扬。',
    enPrompt: 'Create a minimalist aesthetic mockup. The logo is applied with clean precision and subtle presence — small, centered, or repeated as a subtle all-over pattern. The product is photographed on a clean neutral background with soft diffused lighting. The overall feeling is airy, modern, and understated with plenty of negative space. The logo integration is flawless but understated.',
  },
  {
    id: 'style-streetwear',
    title: '街头潮流风格',
    enTitle: 'Streetwear Style',
    category: 'style',
    icon: '🔥',
    prompt: '创建前卫的街头潮流 Mockup。Logo 以醒目的大尺寸图形印花呈现，带有轻微的做旧纹理或磨损边缘。产品在城市风格的场景中拍摄，使用戏剧性的对比光线，可能加入霓虹灯或氛围环境光。Logo 具有视觉冲击力——大尺寸布局搭配原始、真实的质感。态度鲜明的街拍风格。',
    enPrompt: 'Create an edgy streetwear aesthetic mockup. The logo is applied as a bold oversized graphic print with slight grunge texture or distressed edges. The product is photographed in an urban-inspired setting with dramatic contrast lighting, perhaps with neon or moody ambient light. The logo has visual impact — large placement with a raw, authentic feel. Street-style photography with attitude.',
  },
  {
    id: 'style-nature',
    title: '自然户外风格',
    enTitle: 'Nature Outdoor Style',
    category: 'style',
    icon: '🌿',
    prompt: '创建自然风格的户外生活方式 Mockup。产品在自然环境中展示，金色的黄昏光线穿过树丛。Logo 与周围环境微妙融合——可以是户外装备上的压印标记或有机面料上的自然图案。温暖的大地色调、太阳光晕和自然虚化营造令人向往的户外生活感。',
    enPrompt: 'Create a nature-inspired outdoor lifestyle mockup. The product is shown in a natural setting with soft golden-hour lighting filtering through trees. The logo integrates subtly with the environment — perhaps as a debossed mark on outdoor gear or a natural print on organic fabric. Warm earthy tones, sun flares, and natural bokeh create an aspirational outdoor lifestyle feel.',
  },
  {
    id: 'style-vintage',
    title: '复古做旧风格',
    enTitle: 'Vintage Distressed Style',
    category: 'style',
    icon: '📜',
    prompt: '创建复古美学 Mockup。Logo 呈现为风化或做旧的印刷品，带有轻微的褪色、裂纹或铜锈效果。产品具有经过岁月使用的质感，呈现自然的磨损痕迹。色彩温暖且略微去饱和，带有胶片颗粒纹理。光线模仿 1970 年代的自然窗光，色调温暖。整体感觉真实、怀旧、充满手工感。',
    enPrompt: 'Create a vintage aesthetic mockup. The logo appears as a weathered or distressed print with slight fading, crackle, or patina effect. The product has a lived-in quality with natural wear patterns. Colors are warm and slightly desaturated with film-grain texture. The lighting mimics natural window light from the 1970s with warm tones. The overall feel is authentic, nostalgic, and handcrafted.',
  },
  {
    id: 'style-tech-modern',
    title: '科技未来风格',
    enTitle: 'Tech Futuristic Style',
    category: 'style',
    icon: '⚡',
    prompt: '创建未来科技美学 Mockup，具有干净的几何构图。Logo 呈现为全息、彩虹色或发光标记，位于时尚的现代产品表面。冷色调蓝紫光线配青色高光，营造科幻氛围。线条干净，材质通透，Logo 周围有微弱的辉光效果。赛博朋克与 Apple 设计语言的融合。',
    enPrompt: 'Create a futuristic tech-aesthetic mockup with clean geometric composition. The logo appears as a holographic, iridescent, or light-emitting mark on a sleek modern product surface. Cool blue/purple lighting with cyan accent highlights creates a sci-fi atmosphere. Clean lines, glass materials, and subtle glow effects around the logo. Cyberpunk-meets-Apple design language.',
  },
  {
    id: 'style-japanese',
    title: '和风极简美学',
    enTitle: 'Japanese Wabi-Sabi Style',
    category: 'style',
    icon: '🏯',
    prompt: '创建受侘寂美学启发的日式极简 Mockup。Logo 以克制和精确的方式应用，可能是微妙的压凹或和纸印刷。天然材料如和纸、竹材或原木构成产品表面。柔和自然的光线配温暖的色调，营造宁静、冥想般的氛围。构图遵循日式设计的不对称和留白原则。',
    enPrompt: 'Create a Japanese minimalist aesthetic mockup inspired by wabi-sabi principles. The logo is applied with restraint and precision, perhaps as a subtle blind emboss or rice paper print. Natural materials like washi paper, bamboo, or untreated wood form the product surface. Soft natural lighting with warm neutral tones creates a serene, meditative atmosphere. The composition follows Japanese design principles of asymmetry and negative space.',
  },
];

export const getPromptsByCategory = (category: string): PromptTemplate[] => {
  return promptLibrary.filter(p => p.category === category);
};
