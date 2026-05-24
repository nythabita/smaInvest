---
name: Atelier Digital
colors:
  surface: '#f9f9f7'
  surface-dim: '#dadad8'
  surface-bright: '#f9f9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f2'
  surface-container: '#eeeeec'
  surface-container-high: '#e8e8e6'
  surface-container-highest: '#e2e3e1'
  on-surface: '#1a1c1b'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c9c6c5'
  secondary: '#b61729'
  on-secondary: '#ffffff'
  secondary-container: '#d9343e'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#400009'
  on-tertiary-container: '#cf6266'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c9c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#ffdad8'
  secondary-fixed-dim: '#ffb3b0'
  on-secondary-fixed: '#410006'
  on-secondary-fixed-variant: '#93001a'
  tertiary-fixed: '#ffdad9'
  tertiary-fixed-dim: '#ffb3b3'
  on-tertiary-fixed: '#400009'
  on-tertiary-fixed-variant: '#80272e'
  background: '#f9f9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e2e3e1'
typography:
  display-lg:
    fontFamily: Bodoni Moda
    fontSize: 64px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.1'
  headline-md:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Bodoni Moda
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter-mobile: 16px
  gutter-desktop: 32px
  margin-mobile: 20px
  margin-desktop: 80px
  section-gap: 120px
---

## Brand & Style
The design system is rooted in the "New Editorial" movement—a fusion of high-fashion print aesthetics and modern digital utility. The target audience includes luxury fashion enthusiasts and digital archivists who value curation over clutter. 

The UI must evoke the feeling of a high-end physical boutique: quiet, spacious, and intentional. We employ **Minimalism** with a focus on negative space to allow garment photography to breathe, punctuated by **Glassmorphism** to provide a sense of layered depth and contemporary sophistication. The emotional response should be one of "effortless elegance" and "curated calm."

## Colors
The palette is dominated by a trio of off-whites—Editorial White, Soft Ivory, and Porcelain Gray—which serve as the canvas. This prevents the "clinical" feel of pure white and adds a tactile, paper-like quality. 

**Ink Black** is reserved for high-contrast typography and primary actions. **Stiletto Red** and **Deep Burgundy** are used with extreme restraint; they are reserved for notifications, seasonal highlights, or critical CTAs. The hierarchy relies on tonal shifts between the ivory and porcelain shades rather than heavy use of borders.

## Typography
Typography is the primary driver of the brand's luxury status. **Bodoni Moda** provides the high-contrast serif look characteristic of *Vogue* or *Harper’s Bazaar*. Use it for page titles, collection headers, and large quotes.

**Hanken Grotesk** offers a sharp, contemporary counterpoint for functional UI elements and long-form body text. It ensures legibility in the closet interface while maintaining a modern "tech-forward" feel. Use `label-caps` for navigation items, categories, and tags to instill a sense of architectural structure.

## Layout & Spacing
The layout uses a **fixed grid** approach for desktop (12 columns) and a **fluid grid** for mobile (4 columns). To mimic magazine layouts, we use asymmetrical spacing; for instance, staggering garment cards in a masonry-style grid rather than a rigid table.

Whitespace is treated as a functional element. Large "Section Gaps" (120px+) separate different collections or editorial stories. On mobile, margins remain generous (20px) to ensure the interface feels airy and premium, never cramped.

## Elevation & Depth
Depth is achieved through **Glassmorphism** and **Tonal Layers** rather than heavy shadows. 

1.  **Base Layer:** Soft Ivory (#F4EFE8) for the main canvas.
2.  **Mid Layer:** Porcelain Gray (#E5E2DD) for secondary containers or inactive sidebars.
3.  **Top Layer:** Frosted Glass (White with 70% opacity and 20px backdrop blur) for floating navigation bars and modal overlays.
4.  **Shadows:** Use only "Ambient Shadows"—extremely soft, dispersed (30px-50px blur), and low-opacity (5-8%) to make cards appear to hover gently above the ivory surface.

## Shapes
This design system uses a **Rounded** (Level 2) logic. The 8px (0.5rem) base radius provides a soft, organic feel that contrasts with the sharp, high-contrast serif typography. 

- **Garment Cards:** 8px radius.
- **Action Buttons:** 12px (rounded-lg) to make them feel more "clickable" and tactile.
- **Search Bars & Tags:** Pill-shaped (3) for a modern, digital-first touch within the editorial layout.
- **Imagery:** Strictly rectangular or 8px rounded corners; avoid circles for fashion photography to maintain the editorial crop.

## Components
- **Buttons:** 
  - *Primary:* Ink Black background, White text, 12px radius, bold weight.
  - *Secondary:* Outlined (1px Ink Black), 12px radius, no fill.
  - *Accent:* Stiletto Red for "Delete" or "Limited Edition" actions only.
- **Garment Cards:** Soft Ivory background, 8px radius, 1px Porcelain Gray border. Imagery should have a subtle inner glow to feel "set into" the card.
- **Inputs:** Underlined-only style (1px Charcoal) for search and forms to maintain the minimalist aesthetic, transitioning to a 2px underline on focus.
- **Chips/Tags:** Pill-shaped with a Porcelain Gray background and `label-caps` typography.
- **Lists:** High-density, separated by hairline-thin (0.5px) Porcelain Gray dividers.
- **Editorial Sliders:** Large-scale horizontal scroll components with "snap-to-center" behavior and minimal progress indicators (thin lines rather than dots).