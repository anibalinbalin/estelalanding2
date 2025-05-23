// Design tokens matching Linear's exact design system
export const typography = {
  // Hero/H1 typography - Linear's exact values
  hero: {
    mobile: { 
      size: '32px', 
      lineHeight: '36px', 
      letterSpacing: '-0.704px', // -0.022em
      weight: 510 
    },
    desktop: { 
      size: '64px', 
      lineHeight: '67.84px', 
      letterSpacing: '-1.408px', // -0.022em
      weight: 510 
    }
  },
  
  // Text sizes following Linear's scale
  text: {
    micro: { size: '11px', lineHeight: '16px', letterSpacing: '0.025em' },
    mini: { size: '12px', lineHeight: '16px', letterSpacing: '0.01em' },
    small: { size: '14px', lineHeight: '20px', letterSpacing: '0em' },
    regular: { size: '16px', lineHeight: '24px', letterSpacing: '-0.003em' },
    large: { size: '18px', lineHeight: '28px', letterSpacing: '-0.006em' },
  },
  
  // Font weights used by Linear
  weight: {
    normal: 400,
    medium: 500,
    linearHero: 510, // Linear's specific weight
    semibold: 600,
  },
}

export const breakpoints = {
  // Linear uses a single breakpoint at 640px
  linear: '640px',
  // Additional breakpoints for flexibility
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
}

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
}

export const colors = {
  text: {
    primary: 'var(--foreground)',
    secondary: 'var(--muted-foreground)',
    tertiary: 'oklch(0.552 0.016 285.938)',
    quaternary: 'oklch(0.705 0.015 286.067)',
  },
}

// Helper function to generate CSS variables for typography
export function generateTypographyCSS() {
  const css: string[] = [];
  
  // Generate text size variables
  for (const [key, value] of Object.entries(typography.text)) {
    css.push(`--text-${key}-size: ${value.size};`);
    css.push(`--text-${key}-line-height: ${value.lineHeight};`);
    css.push(`--text-${key}-letter-spacing: ${value.letterSpacing};`);
  }
  
  // Generate hero/h1 variables (desktop by default)
  css.push(`--text-h1-size: ${typography.hero.desktop.size};`);
  css.push(`--text-h1-line-height: ${typography.hero.desktop.lineHeight};`);
  css.push(`--text-h1-letter-spacing: ${typography.hero.desktop.letterSpacing};`);
  css.push(`--text-h1-weight: ${typography.hero.desktop.weight};`);
  
  return css.join('\n  ');
}

// Helper function to generate responsive CSS for Linear's single breakpoint
export function generateLinearResponsiveCSS() {
  const css: string[] = [];
  
  // Mobile styles - Linear's single breakpoint at 640px
  css.push(`@media (max-width: ${breakpoints.linear}) {`);
  css.push(`  --text-h1-size: ${typography.hero.mobile.size};`);
  css.push(`  --text-h1-line-height: ${typography.hero.mobile.lineHeight};`);
  css.push(`  --text-h1-letter-spacing: ${typography.hero.mobile.letterSpacing};`);
  css.push(`  --text-h1-weight: ${typography.hero.mobile.weight};`);
  css.push('}');
  
  return css.join('\n');
}