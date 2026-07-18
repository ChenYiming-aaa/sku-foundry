export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  prompt: string;
  icon: string;
}

export const promptCategories = [
  { id: 'fabric', label: '布料服饰', icon: '👕' },
  { id: 'hard', label: '硬质产品', icon: '🥤' },
  { id: 'tech', label: '数码配件', icon: '📱' },
  { id: 'luxury', label: '高端质感', icon: '💎' },
  { id: 'style', label: '风格美学', icon: '🎨' },
];

export const promptLibrary: PromptTemplate[] = [
  // === Fabric / Apparel ===
  {
    id: 'fabric-standard',
    title: '标准织物融合',
    category: 'fabric',
    icon: '👕',
    prompt: 'Composite the logo seamlessly onto the product surface. Ensure the logo follows the natural fabric wrinkles, folds, and draping of the material with realistic perspective warping. The logo should appear dyed or screen-printed directly onto the fabric with proper edge softness, not like a sticker. Maintain consistent lighting, shadows, and color balance across the entire composite. Output a photorealistic product mockup with studio lighting.',
  },
  {
    id: 'fabric-embroidery',
    title: '刺绣工艺效果',
    category: 'fabric',
    icon: '🧵',
    prompt: 'Render the logo as premium embroidery on the fabric surface. Each element of the logo should have a raised thread texture with subtle 3D depth, visible stitch lines, and slight fabric puckering around the edges. The thread should catch the light naturally with a soft sheen. The underlying fabric shows realistic distortion where the embroidery is dense. Output a macro-quality product detail shot.',
  },
  {
    id: 'fabric-premium',
    title: '高端时装质感',
    category: 'fabric',
    icon: '👔',
    prompt: 'Create a luxury fashion brand mockup. The logo is integrated with premium screen-print or foil-stamping technique on high-end garment fabric. Use dramatic studio lighting with soft shadows that emphasize the fabric weave texture. The logo has a subtle metallic sheen or matte finish depending on the material. The overall image should look like a lookbook editorial photograph.',
  },
  {
    id: 'fabric-sportswear',
    title: '运动服饰醒目',
    category: 'fabric',
    icon: '🏃',
    prompt: 'Apply the logo as a bold sportswear print on performance athletic fabric. The logo should look like a high-quality heat-transfer or sublimation print with vibrant color saturation and slight sheen. The fabric has a technical texture with moisture-wicking visible detail. Dynamic lighting suggests an active lifestyle context. The logo remains crisp while conforming to the body contour and fabric stretch.',
  },
  {
    id: 'fabric-denim',
    title: '丹宁牛仔质感',
    category: 'fabric',
    icon: '👖',
    prompt: 'Embed the logo onto denim fabric with realistic texture interaction. The logo should appear as a high-quality patch, embroidery, or screen print on the rugged denim surface. Visible denim weave texture should subtly show through the logo edges. Natural indigo color variation and fabric creases should interact with the logo placement. Studio lighting with slight edge rim light.',
  },

  // === Hard Goods ===
  {
    id: 'hard-mug',
    title: '杯具环绕贴印',
    category: 'hard',
    icon: '☕',
    prompt: 'Wrap the logo around a ceramic or stainless steel mug/water bottle with precise cylindrical warping. The logo follows the curvature of the product with proper horizontal distortion, creating a realistic 3D wrap effect. Include subtle reflections on the glossy surface that partially overlay the logo. The lighting should show a gentle gradient across the cylindrical form with a soft specular highlight. Photorealistic product photography style.',
  },
  {
    id: 'hard-ceramic',
    title: '陶瓷表面烫印',
    category: 'hard',
    icon: '🍶',
    prompt: 'Apply the logo onto a glazed ceramic surface using a premium decal or heat-transfer technique. The logo conforms to the curved ceramic surface with realistic perspective. The glossy ceramic finish creates subtle reflections over the logo area. Warm studio lighting emphasizes the smooth texture and dimensional form. The logo edges merge cleanly with the glaze with no visible transition line.',
  },
  {
    id: 'hard-metal',
    title: '金属蚀刻/镭雕',
    category: 'hard',
    icon: '⚙️',
    prompt: 'Etch or engrave the logo onto a brushed metal surface. The logo should appear laser-etched with precise fine detail, showing subtle depth and shadow within the engraved grooves. The surrounding metal surface has a directional brushed texture and natural oxidation or anodized color. Lighting creates a metallic sheen with a sharp specular highlight that crosses the logo area. Industrial product photography style.',
  },
  {
    id: 'hard-glass',
    title: '玻璃磨砂/UV印',
    category: 'hard',
    icon: '🔮',
    prompt: 'Apply the logo as a frost/etched or UV print onto a glass surface. The logo should have a slightly translucent quality with frosted edge softness if etched, or vibrant opacity if UV printed. The glass shows reflections and refractions that subtly interact with the logo layer. Backlighting or side-lighting creates a premium glowing effect. Crystal clear studio photography with dramatic shadows.',
  },
  {
    id: 'hard-wood',
    title: '木质激光雕刻',
    category: 'hard',
    icon: '🪵',
    prompt: 'Burn or laser-engrave the logo into natural wood grain surface. The logo follows the organic curves of the wood with realistic depth and charring at the edges for engraved areas, or appears as a smooth painted finish for filled areas. The natural wood grain pattern continues subtly through the logo area. Warm ambient lighting emphasizes the natural wood tones and texture. Artisanal product photography style.',
  },

  // === Tech Accessories ===
  {
    id: 'tech-phone',
    title: '手机壳UV彩印',
    category: 'tech',
    icon: '📱',
    prompt: 'Print the logo onto a premium phone case with full-edge wrapping. The logo conforms to the case contours including the camera bump and side edges with precise perspective mapping. The glossy or matte case finish creates realistic surface reflections that partially overlay the logo. Studio lighting with a subtle gradient across the curved case surface. The logo should look embedded in the case material, not layered on top.',
  },
  {
    id: 'tech-laptop',
    title: '笔记本/平板贴膜',
    category: 'tech',
    icon: '💻',
    prompt: 'Apply the logo as a premium skin or decal on a laptop/tablet surface. The logo precisely aligns with the device geometry including hinge area and edge curves. The surface shows a subtle brushed metal or matte finish with the logo integrated as a high-quality vinyl wrap or etched metal badge. Natural office lighting with soft window reflections. Professional product photography style.',
  },
  {
    id: 'tech-smartwatch',
    title: '智能手表表盘',
    category: 'tech',
    icon: '⌚',
    prompt: 'Render the logo on a smartwatch face or band. If on the watch face, the logo should appear as a refined engraved or printed mark in the center or bottom of the display bezel area. If on the band, the logo follows the curved, flexible band material with realistic warp and stretch. The device screen shows subtle reflections and ambient light interaction. Macro product photography with shallow depth of field.',
  },
  {
    id: 'tech-airpods',
    title: '耳机仓精致印',
    category: 'tech',
    icon: '🎧',
    prompt: 'Apply the logo onto a wireless earbuds charging case. The logo precisely conforms to the curved, pebble-like case surface with accurate spherical warping. The glossy or matte plastic finish creates natural light reflections that pass over the logo area. The case should look factory-engraved, not stickered. Clean minimalist product photography with soft overhead lighting.',
  },

  // === Luxury / Premium ===
  {
    id: 'luxury-gold',
    title: '烫金/压凹工艺',
    category: 'luxury',
    icon: '✨',
    prompt: 'Apply the logo using hot foil stamping or blind embossing on premium material. The logo should have a luxurious metallic gold, silver, or rose gold finish with realistic light reflection and a slight 3D raised or debossed appearance. The surrounding material is premium cardstock, leather, or velvet. Dramatic side-lighting emphasizes the dimensional quality of the stamped area. Ultra-premium packaging photography.',
  },
  {
    id: 'luxury-leather',
    title: '真皮压印/烫金',
    category: 'luxury',
    icon: '👜',
    prompt: 'Emboss or foil-stamp the logo onto genuine leather surface. The logo creates a permanent impression with natural light and shadow playing across the debossed or embossed area. The leather shows authentic grain texture, subtle creasing, and rich patina. The logo integrates into the leather as if it were part of the original manufacturing process. Studio lighting with warm tones emphasizing leather richness.',
  },
  {
    id: 'luxury-cosmetics',
    title: '美妆瓶身标签',
    category: 'luxury',
    icon: '💄',
    prompt: 'Apply the logo onto a luxury cosmetics bottle or jar. The logo appears as a refined screen-print, hot-stamp, or debossed mark on frosted or clear glass, ceramic, or high-gloss plastic. The container has a premium weighted feel with soft-touch or gloss finish. Elegant studio lighting with soft gradients and a subtle catchlight on the logo area. Editorial beauty product photography style.',
  },
  {
    id: 'luxury-watch',
    title: '腕表精致铭刻',
    category: 'luxury',
    icon: '⌚',
    prompt: 'Engrave the logo onto a luxury timepiece dial, case back, or buckle. The logo should appear as precision micro-engraving with sharp edges and subtle depth visible under rarefied lighting. The watch has premium materials like sapphire crystal, polished steel, or gold with complex reflections. Macro photography style with extreme detail, showing the interplay of light across polished and brushed surfaces.',
  },

  // === Style / Aesthetic ===
  {
    id: 'style-minimal',
    title: '极简干净风格',
    category: 'style',
    icon: '⬜',
    prompt: 'Create a minimalist aesthetic mockup. The logo is applied with clean precision and subtle presence — small, centered, or repeated as a subtle all-over pattern. The product is photographed on a clean neutral background with soft diffused lighting. The overall feeling is airy, modern, and understated with plenty of negative space. The logo integration is flawless but understated.',
  },
  {
    id: 'style-streetwear',
    title: '街头潮流风格',
    category: 'style',
    icon: '🔥',
    prompt: 'Create an edgy streetwear aesthetic mockup. The logo is applied as a bold oversized graphic print with slight grunge texture or distressed edges. The product is photographed in an urban-inspired setting with dramatic contrast lighting, perhaps with neon or moody ambient light. The logo has visual impact — large placement with a raw, authentic feel. Street-style photography with attitude.',
  },
  {
    id: 'style-nature',
    title: '自然户外风格',
    category: 'style',
    icon: '🌿',
    prompt: 'Create a nature-inspired outdoor lifestyle mockup. The product is shown in a natural setting with soft golden-hour lighting filtering through trees. The logo integrates subtly with the environment — perhaps as a debossed mark on outdoor gear or a natural print on organic fabric. Warm earthy tones, sun flares, and natural bokeh create an aspirational outdoor lifestyle feel.',
  },
  {
    id: 'style-vintage',
    title: '复古做旧风格',
    category: 'style',
    icon: '📜',
    prompt: 'Create a vintage aesthetic mockup. The logo appears as a weathered or distressed print with slight fading, crackle, or patina effect. The product has a lived-in quality with natural wear patterns. Colors are warm and slightly desaturated with film-grain texture. The lighting mimics natural window light from the 1970s with warm tones. The overall feel is authentic, nostalgic, and handcrafted.',
  },
  {
    id: 'style-tech-modern',
    title: '科技未来风格',
    category: 'style',
    icon: '⚡',
    prompt: 'Create a futuristic tech-aesthetic mockup with clean geometric composition. The logo appears as a holographic, iridescent, or light-emitting mark on a sleek modern product surface. Cool blue/purple lighting with cyan accent highlights creates a sci-fi atmosphere. Clean lines, glass materials, and subtle glow effects around the logo. Cyberpunk-meets-Apple design language.',
  },
  {
    id: 'style-japanese',
    title: '和风极简美学',
    category: 'style',
    icon: '🏯',
    prompt: 'Create a Japanese minimalist aesthetic mockup inspired by wabi-sabi principles. The logo is applied with restraint and precision, perhaps as a subtle blind emboss or rice paper print. Natural materials like washi paper, bamboo, or untreated wood form the product surface. Soft natural lighting with warm neutral tones creates a serene, meditative atmosphere. The composition follows Japanese design principles of asymmetry and negative space.',
  },
];

export const getPromptsByCategory = (category: string): PromptTemplate[] => {
  return promptLibrary.filter(p => p.category === category);
};
