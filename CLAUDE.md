# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Estela is a Next.js application using the App Router and TypeScript. It incorporates Tailwind CSS for styling and utilizes shadcn/ui components (based on Radix UI) for UI elements.

## Common Commands

### Development

```bash
# Start the development server using Turbopack
pnpm dev
```

### Building

```bash
# Build the application for production
pnpm build

# Start the production server
pnpm start
```

### Code Quality

```bash
# Run ESLint to check code quality
pnpm lint
```

### Package Management

```bash
# Install new dependencies
pnpm add [package-name]

# Install new dev dependencies
pnpm add -D [package-name]
```

## Project Architecture

### Directory Structure

- `/app`: Next.js App Router files (layouts, pages, etc.)
- `/components`: React components
  - `/ui`: Reusable UI components (buttons, sliders, etc.)
- `/lib`: Utility functions and shared code
- `/public`: Static assets (images, fonts, etc.)

### Key Technologies

1. **Next.js 15**: Using the App Router for server components, layouts, and routing
2. **TypeScript**: For type safety throughout the codebase
3. **Tailwind CSS v4**: For styling with utility classes
4. **shadcn/ui**: Component system built on Radix UI
5. **Motion**: For animations (used in components like the infinite slider)

### Component Architecture

The project uses a combination of:
- Server components (default in Next.js App Router)
- Client components (marked with 'use client' directive)
- shadcn/ui components for common UI elements

### Styling Approach

1. **Tailwind CSS**: Primary styling method through utility classes
2. **CSS Variables**: Used for theming (light/dark mode)
3. **class-variance-authority (cva)**: For component variants and dynamic styling
4. **clsx/twMerge**: For conditional class combinations via the `cn()` utility

### Important Utilities

- `cn()`: A utility function in `/lib/utils.ts` that combines Tailwind classes efficiently using clsx and tailwind-merge

## Best Practices

1. Follow the existing component patterns when creating new components
2. Use TypeScript for all new code
3. Client-side code should be explicitly marked with 'use client' directive
4. Follow the shadcn/ui conventions for new UI components
5. Use the existing button variants when adding new buttons
6. Do not use npm but pnpm. Do not start a new server instance, I have already localhost:3000 running.
7. Always do a .md file to start noting the changes we are doing. So we can have track.
8. If you have a doubt about something, ask me first. Do not go alone if you not at certain of what I mean in the promnt.
9. You have mcp servers at your disposal. If the case is that we are stuck after two iterations please consider using the mcp servers to aid you.
10. always check documentation if you no are 100% confident on how to approach a problem. You have context7 mcp server for that.