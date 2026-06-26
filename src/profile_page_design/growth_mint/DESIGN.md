---
name: Growth Mint
colors:
  surface: '#f3fbf6'
  surface-dim: '#d4dcd7'
  surface-bright: '#f3fbf6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf5f1'
  surface-container: '#e8f0eb'
  surface-container-high: '#e2eae5'
  surface-container-highest: '#dce4e0'
  on-surface: '#161d1a'
  on-surface-variant: '#3f4941'
  inverse-surface: '#2a322f'
  inverse-on-surface: '#ebf3ee'
  outline: '#6f7a71'
  outline-variant: '#bec9bf'
  surface-tint: '#066c41'
  primary: '#006038'
  on-primary: '#ffffff'
  primary-container: '#1f7a4d'
  on-primary-container: '#aeffca'
  inverse-primary: '#82d8a3'
  secondary: '#3b6756'
  on-secondary: '#ffffff'
  secondary-container: '#bbead4'
  on-secondary-container: '#406b5a'
  tertiary: '#44584d'
  on-tertiary: '#ffffff'
  tertiary-container: '#5c7065'
  on-tertiary-container: '#ddf3e5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9ef5be'
  primary-fixed-dim: '#82d8a3'
  on-primary-fixed: '#002110'
  on-primary-fixed-variant: '#00522f'
  secondary-fixed: '#beedd7'
  secondary-fixed-dim: '#a2d1bb'
  on-secondary-fixed: '#002116'
  on-secondary-fixed-variant: '#234f3f'
  tertiary-fixed: '#d2e8da'
  tertiary-fixed-dim: '#b6ccbe'
  on-tertiary-fixed: '#0d1f17'
  on-tertiary-fixed-variant: '#384b41'
  background: '#f3fbf6'
  on-background: '#161d1a'
  surface-variant: '#dce4e0'
  background-mint: '#F3FBF6'
  background-warm: '#F7F5EF'
  text-dark: '#10251B'
  text-muted: '#6B7A70'
  success: '#2EAD66'
  warning: '#F5C542'
  white: '#FFFFFF'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  button-text:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  page-padding: 20px
  section-gap-sm: 16px
  section-gap-md: 32px
  section-gap-lg: 48px
  card-padding: 24px
  stack-space: 12px
  inline-space: 8px
---

## Brand & Style

The design system is engineered to bridge the gap between rigorous financial literacy and the high-energy, mobile-first world of high school students. It adopts a **Modern Ed-Tech** style—a fusion of clean Minimalism and welcoming, soft interfaces.

The emotional goal is "Confident Growth." By using an investment-inspired green palette, the UI evokes feelings of prosperity and security, while the soft rounded shapes and generous white space ensure the platform feels accessible rather than intimidating. The aesthetic is professional enough to be taken seriously as a financial tool, yet friendly enough to encourage daily learning habits.

**Design Pillars:**
- **Clarity over Complexity:** Every screen follows a linear, single-column path to prevent cognitive overload.
- **Approachable Professionalism:** Uses high-quality typography and structured grids balanced by playful, rounded corners.
- **Action-Oriented:** Large, tactile touch targets ensure the interface is "thumb-friendly" for mobile-primary users.

## Colors

The color strategy for this design system revolves around a "Monochromatic Green Plus" approach. 

- **Primary Green (#1F7A4D):** Used for the most critical actions (CTAs), active progress bars, and primary icons. It represents the "growth" of an investment.
- **Dark Green (#0F3D2E):** Reserved for high-level headings and navigation elements to provide a grounded, professional anchor.
- **Soft Green (#DFF5E7):** Acts as a container color for secondary information, badges, and card backgrounds, reducing visual harshness.
- **Light Mint Background (#F3FBF6):** The global canvas color, chosen to feel fresher and more modern than pure white, reducing eye strain during reading.

Functional colors like **Success Green** and **Warning Yellow** are used sparingly for feedback during quizzes to maintain a focused environment.

## Typography

This design system utilizes **Plus Jakarta Sans** for its friendly, geometric, and modern characteristics. It strikes the perfect balance between the technicality of a fintech app and the warmth of an educational platform.

**Hierarchy Rules:**
- **Headings:** Bold and expressive. Large headings (Display) use tighter letter-spacing to feel more impactful and cohesive on mobile screens.
- **Body:** Prioritizes legibility. We use a 16px base size for module content to ensure students can read comfortably without squinting.
- **Labels:** Small labels use semi-bold weights and slight tracking (letter-spacing) to ensure they remain readable at 12px.
- **Line Height:** Generous line heights are applied to body text (1.5x) to create a relaxed, breathable reading experience.

## Layout & Spacing

The layout philosophy is **Mobile-First Single Column**. This ensures a focused, linear experience that guides students through modules without distraction.

**Grid & Alignment:**
- **Mobile:** A fluid single-column layout with 20px side margins. Elements span the full width of the safe area.
- **Desktop/Tablet:** Content is constrained to a maximum width of 768px (tablet width) and centered. This prevents line lengths from becoming too long, which would hurt reading comprehension.
- **The 8px Rhythm:** All spacing increments are based on an 8px scale (8, 16, 24, 32, 48) to maintain vertical rhythm.

**Reflow Rules:**
- On tablet/desktop, module cards may transition from a vertical stack to a 2-column grid.
- Hero sections on landing pages use center-alignment for mobile, shifting to left-alignment if desktop space permits.

## Elevation & Depth

This design system uses **Tonal Layers** rather than heavy shadows to convey depth. This keeps the interface feeling "light" and modern.

- **Level 0 (Surface):** The `background-mint` color (#F3FBF6) serves as the base layer.
- **Level 1 (Cards):** Primary containers use a white background with a very subtle, 1px border in `soft-green` or a low-opacity neutral. Shadows, if used, are extremely diffused: `0px 4px 20px rgba(16, 37, 27, 0.05)`.
- **Level 2 (Interactive):** Tappable elements like quiz options or active module cards may use a slightly more pronounced "lift" effect on hover (if on desktop) or a subtle 2px solid border in `primary-green` when selected.
- **The "Key Takeaway" Card:** To make specific content stand out, these cards use the `soft-green` (#DFF5E7) background to visually "pop" against the white surface.

## Shapes

The shape language is defined by **High Roundedness**, reinforcing the "friendly" and "approachable" brand personality.

- **Standard Cards:** Use a 24px radius (`rounded-2xl`). This is the default for module previews, quiz questions, and progress summaries.
- **Large Hero Containers:** Use a 32px radius (`rounded-3xl`) to create a soft, inviting entrance to the app.
- **Buttons:** Use the "Pill" shape (full rounding) to maximize the perception of being a safe, tappable action.
- **Input Fields/Quiz Options:** Use 16px radius to distinguish them slightly from the larger content containers.

## Components

### Buttons
- **Primary:** Full-width on mobile, pill-shaped, `primary-green` background with white text. High-contrast and bold.
- **Secondary:** Transparent/White background with a 2px `primary-green` border and green text. Used for "Back" or "Demo" actions.

### Cards
- **Module Card:** Rounded (24px), white background, subtle border. Includes a small header icon, a `title-lg` heading, and a footer section for "Time to Read" and "Status" (using `label-md`).
- **Progress Card:** High visual priority. Uses a `primary-green` or `soft-green` background. Must include a clear percentage and a horizontal progress bar with a rounded track.

### Quiz Components
- **Question Card:** Elevated white card containing the prompt in `headline-sm`.
- **Option Card:** A selectable card for multiple-choice answers. 
    - *Default:* White background, thin gray border.
    - *Selected:* `soft-green` background, 2px `primary-green` border.
- **Progress Indicator:** Small "step" indicators (e.g., "1/5") placed at the top of the screen to minimize anxiety.

### Input Fields
- Rounded (16px), minimum height of 56px for easy mobile tapping. 
- Focus state should use a 2px `primary-green` ring.

### Badges
- Small, pill-shaped indicators for status (e.g., "Selesai" or "Baru"). Use `soft-green` for positive states and `warm-neutral` for pending states.