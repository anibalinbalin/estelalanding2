# Changes Log

## 2025-01-22

### Background Position Fix
- Fixed Hermes background shift when changing languages
- Added `object-right` positioning to maintain consistent position
- Updated hero section layout to use flexible max-width

### Light Mode Text Colors
- Updated h1 color to #2f2f31 in light mode
- Updated subtitle color to #5b5c5d in light mode
- Maintained dark mode colors (h1: #f7f8f8, subtitle: #ffffffb3)

### Responsive Typography System (Based on Linear.app)
- Implemented exact typography values matching Linear's design system:
  - Mobile (<640px): 32px heading, 36px line-height, -0.704px letter-spacing
  - Tablet (640-1024px): 40px heading, 44px line-height, -0.8px letter-spacing  
  - Desktop (>1024px): 56px heading, 61.6px line-height, -1.12px letter-spacing
- Updated font configuration:
  - Added Inter variable font with weights 400, 500, 600
  - Applied font-weight 500 (medium) to headings matching Linear
  - Used proper CSS variable references for font-family
- Subtitle responsive sizing:
  - Mobile: 16px, 22px line-height
  - Tablet: 18px, 24px line-height, -0.18px letter-spacing
  - Desktop: 21px, 28px line-height, -0.21px letter-spacing
- Fixed JSX self-closing tag syntax for better code standards

### Linear Design System Analysis
- Created scripts to analyze Linear.app's design system:
  - `/scripts/analyze-linear.js` - Browser console script to extract CSS variables
  - `/scripts/generate-linear-css.js` - Generate CSS from design tokens
- Updated `/lib/design-tokens.ts` with comprehensive Linear-inspired typography system:
  - Text sizes: micro (11px) through large (18px) with line heights and letter spacing
  - Title sizes: 8 levels with responsive behavior (desktop/tablet/mobile)
  - Each title level has specific size, line height, and letter spacing per breakpoint
  - Added helper functions to generate CSS variables and responsive styles
- Extracted Linear's exact typography values from live analysis:
  - Mobile (<640px): 32px size, 36px line-height, -0.704px letter-spacing
  - Desktop (≥640px): 64px size, 67.84px line-height, -1.408px letter-spacing
  - Font-weight: 510 (custom Inter Variable weight)
  - Font stack: "Inter Variable", "SF Pro Display", -apple-system, system-ui, etc.
  - Breakpoints: 640px (primary), 768px, 1024px, 1280px, 1536px
  - Discovered they use 700px for some components and 600px for others

### Linear Design System Implementation
- Updated `/components/hero-section.tsx` with Linear's exact values:
  - Changed breakpoint from `sm:` to `min-[640px]:` for precise control
  - Maintained font-[510] to match Linear's exact weight
  - Typography now transitions at exactly 640px matching Linear's behavior
- Comprehensive design token system created in `/lib/design-tokens.ts`
- Analysis scripts available for further exploration
  - Added exact pixel values with em equivalents
  - Updated helper functions for single breakpoint system