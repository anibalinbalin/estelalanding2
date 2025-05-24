# Unicorn Studio Optimization - January 2025

## Overview
Updated the Unicorn Studio component to use the latest SDK features for improved performance and efficiency.

## Changes Made

### 1. **Updated to Modern API**
- Switched from `UnicornStudio.init()` to `UnicornStudio.addScene()` for better scene control
- Added proper TypeScript interfaces for the SDK
- Implemented fallback to legacy API for compatibility

### 2. **Performance Optimizations**
- Added **viewport-based pause/resume**: Animation automatically pauses when off-screen using IntersectionObserver
- Implemented **lazy loading**: Effects only load when needed
- Added **resize handling**: Proper response to viewport changes

### 3. **New Features Added**
- `pauseWhenOffscreen` prop (default: true) - Saves CPU/GPU when effect is not visible
- `interactivity` prop - Control whether effects respond to user interaction
- `lazyLoad` prop - Defer loading until needed
- Better error handling with user-friendly messages

### 4. **Code Quality Improvements**
- Fixed TypeScript `any` warnings
- Removed unused imports and variables
- Improved cleanup on component unmount
- Added proper scene reference management

### 5. **Hero Section Updates**
- Enabled `pauseWhenOffscreen` for background effect
- Enabled `lazyLoad` for better initial page load
- Set `interactivity={false}` since it's a background element

### 6. **Removed Components**
- Deleted the complex `InteractiveEffectPositioner` component
- Removed the `save-positions` API route
- Removed the `effect-positions.json` file
- Simplified implementation to use UnicornStudio directly

## Performance Impact
- **Reduced CPU usage**: Effects pause when not visible
- **Faster initial load**: Lazy loading defers effect initialization
- **Better memory management**: Proper cleanup and scene destruction
- **Smoother experience**: Resize handling prevents layout issues

## SDK Version
Using Unicorn Studio SDK v1.4.21 (latest as of January 2025)

## Troubleshooting

### Error: "Unexpected token '<', "<?xml vers"... is not valid JSON"
This error occurs when trying to use a project ID directly without the proper JSON export. The solution is to:

1. Export your Unicorn Studio project as JSON from the Unicorn Studio dashboard
2. Save the JSON file in the `/public` directory
3. Use the `jsonFilePath` prop instead of `projectId` prop

The component now uses the restored JSON file (`/public/unicorn-effect.json`) which contains the complete effect definition.

### Error: "Failed to load resource: /embeds/null"
This error occurs when the Unicorn Studio SDK can't properly read the project ID. Common causes and solutions:

1. **Default JSON path override**: Remove any default value for `jsonFilePath` in the component props
2. **Incorrect API usage**: Use `addScene()` with proper config object for project IDs, not element-based approach
3. **Production flag format**: Pass `production` as a boolean in the config, not as a query string
4. **Published project required**: Ensure your project is published in Unicorn Studio dashboard

## Implementation Details

### Using Project ID (Recommended for Production)
```typescript
<UnicornStudio 
  projectId="YOUR_PROJECT_ID?production"  // Add ?production for production mode
  pauseWhenOffscreen={true}
  lazyLoad={true}
  interactivity={false}
/>
```

### Using JSON File (For Development/Offline)
```typescript
<UnicornStudio 
  jsonFilePath="/unicorn-effect.json"
  pauseWhenOffscreen={true}
  lazyLoad={true}
  interactivity={false}
/>
```

### Key Learnings

1. **API Differences**: The `addScene()` method expects a config object with `elementId`, not an HTMLElement
2. **Production Mode**: Use `production: true` in the config, not `data-us-production="1"`
3. **Element ID Required**: When using `addScene()`, assign a unique ID to the container element
4. **Script Loading**: The SDK must be fully loaded before initialization
5. **Proper Cleanup**: Always destroy scenes on unmount to prevent memory leaks

### Updated Component Features

The optimized UnicornStudio component now includes:
- Automatic detection of project ID vs JSON file approach
- Proper use of `addScene()` API for project IDs
- Fallback to `init()` API for JSON files
- Viewport-based pause/resume for performance
- Lazy loading support
- Resize handling
- TypeScript interfaces matching the actual SDK API
- Better error messages for debugging

## Background Stability Fix

### Problem
The background images and Unicorn Studio effects were shifting when switching languages, causing alignment issues.

### Solution
1. **Memoized Components**: Used React.memo() to prevent unnecessary re-renders of background layers
2. **Fixed Positioning**: Changed from `absolute` to `fixed` positioning with CSS transforms
3. **CSS Optimization**: Added `will-change`, `backface-visibility`, and `transform: translateZ(0)` to force GPU acceleration
4. **Separated Concerns**: Isolated background layers from language-dependent content

### Implementation
```typescript
// Memoized background component
const BackgroundLayers = memo(function BackgroundLayers() {
    return (
        <>
            <div className="fixed-background-layer -z-10">
                <HermesBackground />
            </div>
            <div className="fixed-background-layer z-0 pointer-events-none" style={{ mixBlendMode: 'screen' }}>
                <UnicornStudio {...props} />
            </div>
        </>
    )
})
```

This ensures that language changes only affect text content, not the visual background layers.