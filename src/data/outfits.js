/* ──────────────────────────────────────────────────────────────────────────
 *  Outfit data
 *  Each layer holds an array of items. Easy to extend — drop in new entries
 *  with a unique `id`, a `label`, a tint (for the card background glow),
 *  and an inline `svg` illustration (or swap to an <img> URL if you prefer).
 *  ────────────────────────────────────────────────────────────────────── */

// Tiny helper so the SVGs stay readable below
const wrap = (inner) =>
  `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" preserveAspectRatio="xMidYMid meet">${inner}</svg>`

/* ───────────── HIJAB / HEADWEAR ───────────── */
const hijab = (color, accent = '#4B3621') =>
  wrap(`
    <defs>
      <linearGradient id="g-${color.slice(1)}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0.78"/>
      </linearGradient>
    </defs>
    <!-- face -->
    <ellipse cx="60" cy="78" rx="22" ry="26" fill="#F2D7BE"/>
    <!-- hijab cloth -->
    <path d="M60 22
             C 30 22, 18 50, 22 84
             C 24 100, 36 110, 50 112
             L 50 96
             C 42 92, 38 84, 40 74
             C 42 60, 52 50, 60 50
             C 68 50, 78 60, 80 74
             C 82 84, 78 92, 70 96
             L 70 112
             C 84 110, 96 100, 98 84
             C 102 50, 90 22, 60 22 Z"
          fill="url(#g-${color.slice(1)})"
          stroke="${accent}" stroke-opacity="0.08" stroke-width="1"/>
    <!-- subtle fold -->
    <path d="M40 74 C 48 70, 72 70, 80 74" stroke="${accent}" stroke-opacity="0.18" stroke-width="1.2" fill="none"/>
  `)

/* ───────────── TOPS ───────────── */
const top = (color, variant = 'tee') => {
  const accent = '#4B3621'
  let shape = ''
  if (variant === 'tee') {
    shape = `
      <path d="M30 30 L50 22 L60 32 L70 22 L90 30 L98 50 L82 56 L82 110 L38 110 L38 56 L22 50 Z"
            fill="${color}" stroke="${accent}" stroke-opacity="0.1"/>
    `
  } else if (variant === 'cardigan') {
    shape = `
      <path d="M30 30 L50 22 L70 22 L90 30 L96 50 L80 56 L80 112 L40 112 L40 56 L24 50 Z"
            fill="${color}" stroke="${accent}" stroke-opacity="0.1"/>
      <line x1="60" y1="22" x2="60" y2="112" stroke="${accent}" stroke-opacity="0.2" stroke-width="1.2"/>
      <circle cx="60" cy="46" r="1.6" fill="${accent}" opacity="0.4"/>
      <circle cx="60" cy="64" r="1.6" fill="${accent}" opacity="0.4"/>
      <circle cx="60" cy="82" r="1.6" fill="${accent}" opacity="0.4"/>
    `
  } else if (variant === 'blouse') {
    shape = `
      <path d="M28 32 L50 22 Q60 30 70 22 L92 32 L100 56 L82 62 L82 112 L38 112 L38 62 L20 56 Z"
            fill="${color}" stroke="${accent}" stroke-opacity="0.12"/>
      <path d="M50 22 Q60 34 70 22" stroke="${accent}" stroke-opacity="0.18" fill="none"/>
    `
  } else if (variant === 'knit') {
    shape = `
      <path d="M28 34 L48 24 L60 32 L72 24 L92 34 L96 56 L80 60 L80 114 L40 114 L40 60 L24 56 Z"
            fill="${color}" stroke="${accent}" stroke-opacity="0.1"/>
      <g stroke="${accent}" stroke-opacity="0.12" stroke-width="0.8" fill="none">
        <path d="M44 70 Q50 66 56 70 Q62 74 68 70 Q74 66 80 70"/>
        <path d="M44 84 Q50 80 56 84 Q62 88 68 84 Q74 80 80 84"/>
        <path d="M44 98 Q50 94 56 98 Q62 102 68 98 Q74 94 80 98"/>
      </g>
    `
  }
  return wrap(shape)
}

/* ───────────── BOTTOMS ───────────── */
const bottom = (color, variant = 'jeans') => {
  const accent = '#4B3621'
  let shape = ''
  if (variant === 'jeans') {
    shape = `
      <path d="M34 20 L86 20 L92 50 L78 120 L66 120 L62 60 L58 60 L54 120 L42 120 L28 50 Z"
            fill="${color}" stroke="${accent}" stroke-opacity="0.12"/>
      <line x1="60" y1="20" x2="60" y2="58" stroke="${accent}" stroke-opacity="0.2"/>
    `
  } else if (variant === 'skirt') {
    shape = `
      <path d="M30 22 L90 22 L100 110 L20 110 Z"
            fill="${color}" stroke="${accent}" stroke-opacity="0.12"/>
      <g stroke="${accent}" stroke-opacity="0.12" stroke-width="0.8" fill="none">
        <line x1="40" y1="22" x2="32" y2="108"/>
        <line x1="60" y1="22" x2="60" y2="108"/>
        <line x1="80" y1="22" x2="88" y2="108"/>
      </g>
    `
  } else if (variant === 'wide') {
    shape = `
      <path d="M32 22 L88 22 L96 120 L70 120 L62 64 L58 64 L50 120 L24 120 Z"
            fill="${color}" stroke="${accent}" stroke-opacity="0.12"/>
    `
  } else if (variant === 'pleated') {
    shape = `
      <path d="M30 22 L90 22 L98 114 L22 114 Z"
            fill="${color}" stroke="${accent}" stroke-opacity="0.12"/>
      <g stroke="${accent}" stroke-opacity="0.18" stroke-width="0.8" fill="none">
        <line x1="38" y1="22" x2="34" y2="112"/>
        <line x1="48" y1="22" x2="47" y2="112"/>
        <line x1="60" y1="22" x2="60" y2="112"/>
        <line x1="72" y1="22" x2="73" y2="112"/>
        <line x1="82" y1="22" x2="86" y2="112"/>
      </g>
    `
  }
  return wrap(shape)
}

export default [
  {
    key: 'headwear',
    label: 'Headwear',
    items: [
      { id: 'h-1', label: 'Soft Cream',    meta: 'silky',     tint: 'rgba(245,245,220,0.55)', svg: hijab('#F5F5DC') },
      { id: 'h-2', label: 'Warm Tan',      meta: 'satin',     tint: 'rgba(193,154,107,0.45)', svg: hijab('#C19A6B') },
      { id: 'h-3', label: 'Dusty Rose',    meta: 'chiffon',   tint: 'rgba(217,178,170,0.5)',  svg: hijab('#D9B2AA') },
      { id: 'h-4', label: 'Sage',          meta: 'cotton',    tint: 'rgba(168,181,160,0.5)',  svg: hijab('#A8B5A0') },
      { id: 'h-5', label: 'Espresso',      meta: 'matte',     tint: 'rgba(75,54,33,0.35)',    svg: hijab('#6B4F35', '#FDF7ED') },
      { id: 'h-6', label: 'Toasted Almond',meta: 'velvet',    tint: 'rgba(214,184,144,0.5)',  svg: hijab('#D6B890') },
      { id: 'h-7', label: 'Mocha',         meta: 'crinkle',   tint: 'rgba(143,107,77,0.45)',  svg: hijab('#8F6B4D') }
    ]
  },
  {
    key: 'tops',
    label: 'Tops',
    items: [
      { id: 't-1', label: 'Cream Tee',      meta: 'cotton',   tint: 'rgba(253,247,237,0.6)',  svg: top('#FDF7ED', 'tee') },
      { id: 't-2', label: 'Tan Cardigan',   meta: 'knit',     tint: 'rgba(193,154,107,0.5)',  svg: top('#C19A6B', 'cardigan') },
      { id: 't-3', label: 'Sage Blouse',    meta: 'linen',    tint: 'rgba(168,181,160,0.5)',  svg: top('#A8B5A0', 'blouse') },
      { id: 't-4', label: 'Almond Knit',    meta: 'soft',     tint: 'rgba(214,184,144,0.55)', svg: top('#D6B890', 'knit') },
      { id: 't-5', label: 'Espresso Top',   meta: 'fitted',   tint: 'rgba(75,54,33,0.35)',    svg: top('#6B4F35', 'tee') },
      { id: 't-6', label: 'Rose Cardigan',  meta: 'oversized',tint: 'rgba(217,178,170,0.55)', svg: top('#D9B2AA', 'cardigan') },
      { id: 't-7', label: 'Beige Knit',     meta: 'chunky',   tint: 'rgba(245,245,220,0.6)',  svg: top('#EFE6CC', 'knit') }
    ]
  },
  {
    key: 'bottoms',
    label: 'Bottoms',
    items: [
      { id: 'b-1', label: 'Tan Wide Pants',  meta: 'tailored', tint: 'rgba(193,154,107,0.5)',  svg: bottom('#C19A6B', 'wide') },
      { id: 'b-2', label: 'Cream Skirt',     meta: 'midi',     tint: 'rgba(245,245,220,0.6)',  svg: bottom('#EFE6CC', 'skirt') },
      { id: 'b-3', label: 'Sage Pleated',    meta: 'a-line',   tint: 'rgba(168,181,160,0.5)',  svg: bottom('#A8B5A0', 'pleated') },
      { id: 'b-4', label: 'Espresso Jeans',  meta: 'straight', tint: 'rgba(75,54,33,0.35)',    svg: bottom('#5C4326', 'jeans') },
      { id: 'b-5', label: 'Almond Wide',     meta: 'flowy',    tint: 'rgba(214,184,144,0.55)', svg: bottom('#D6B890', 'wide') },
      { id: 'b-6', label: 'Mocha Skirt',     meta: 'pencil',   tint: 'rgba(143,107,77,0.45)',  svg: bottom('#8F6B4D', 'skirt') },
      { id: 'b-7', label: 'Rose Pleated',    meta: 'flared',   tint: 'rgba(217,178,170,0.55)', svg: bottom('#D9B2AA', 'pleated') }
    ]
  }
]
