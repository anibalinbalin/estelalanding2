'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export type UnicornStudioProps = {
  projectId?: string
  jsonFilePath?: string
  width?: number | string
  height?: number | string
  scale?: number
  dpi?: number
  fps?: number
  altText?: string
  ariaLabel?: string
  className?: string
  lazyLoad?: boolean
  interactivity?: boolean
  pauseWhenOffscreen?: boolean
}

interface UnicornScene {
  element: HTMLElement
  destroy: () => void
  resize: () => void
  paused: boolean
  play: () => void
  pause: () => void
}

interface UnicornStudioGlobal {
  addScene: (config: {
    elementId: string
    projectId?: string
    filePath?: string
    scale?: number
    dpi?: number
    fps?: number
    production?: boolean
    lazyLoad?: boolean
    altText?: string
    ariaLabel?: string
    interactivity?: {
      mouse?: {
        disableMobile?: boolean
      }
    }
  }) => Promise<UnicornScene>
  init: (config?: { scale?: number; dpi?: number }) => Promise<UnicornScene[]>
  destroy?: () => void
}

export function UnicornStudio({
  projectId,
  jsonFilePath,
  width = '100%',
  height = '100%',
  scale = 1,
  dpi = 1.5,
  fps = 60,
  altText = 'Unicorn Scene',
  ariaLabel = altText,
  className = '',
  lazyLoad = false,
  interactivity = false,
  pauseWhenOffscreen = true,
}: UnicornStudioProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<UnicornScene | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Handle resize events
  const handleResize = useCallback(() => {
    if (sceneRef.current?.resize) {
      sceneRef.current.resize()
    }
  }, [])

  // Load Unicorn Studio script
  useEffect(() => {
    if (typeof window === 'undefined') return

    const version = '1.4.21'
    const existingScript = document.querySelector(
      'script[src^="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js"]'
    )

    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (existingScript) {
          if ((window as Window & { UnicornStudio?: UnicornStudioGlobal }).UnicornStudio) {
            resolve()
          } else {
            existingScript.addEventListener('load', () => resolve())
            existingScript.addEventListener('error', () => reject(new Error('Failed to load UnicornStudio')))
          }
          return
        }

        const script = document.createElement('script')
        script.src = `https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v${version}/dist/unicornStudio.umd.js`
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load UnicornStudio script'))
        document.body.appendChild(script)
      })
    }

    loadScript()
      .then(() => setIsLoaded(true))
      .catch((err) => setError(err.message))
  }, [])

  // Initialize scene when script is loaded
  useEffect(() => {
    if (!isLoaded || !elementRef.current) return

    const initializeScene = async () => {
      try {
        const element = elementRef.current
        if (!element) return

        console.log('UnicornStudio init with:', { projectId, jsonFilePath })

        // Clear any existing scene
        if (sceneRef.current?.destroy) {
          sceneRef.current.destroy()
          sceneRef.current = null
        }

        // Set project attributes BEFORE initializing
        if (jsonFilePath) {
          element.setAttribute('data-us-project-src', jsonFilePath)
        } else if (projectId) {
          const [cleanProjectId, query] = projectId.split('?')
          element.setAttribute('data-us-project', cleanProjectId)
          
          if (query?.includes('production')) {
            element.setAttribute('data-us-production', 'true')
          }
          console.log('Set project attributes:', cleanProjectId, 'production:', query?.includes('production'))
        } else {
          throw new Error('No project ID or JSON file path provided')
        }

        // Set additional attributes
        if (lazyLoad) {
          element.setAttribute('data-us-lazyload', 'true')
        }

        const UnicornStudio = (window as Window & { UnicornStudio?: UnicornStudioGlobal }).UnicornStudio
        if (!UnicornStudio) {
          throw new Error('UnicornStudio not found on window')
        }

        // For project ID approach, use addScene with elementId
        if (projectId && UnicornStudio.addScene) {
          // Give the element an ID for addScene
          const elementId = `unicorn-${Math.random().toString(36).slice(2)}`;
          element.id = elementId;
          
          const [cleanProjectId, query] = projectId.split('?');
          const isProduction = query?.includes('production');
          
          const scene = await UnicornStudio.addScene({
            elementId,
            projectId: cleanProjectId,
            scale,
            dpi,
            fps,
            production: isProduction,
            lazyLoad,
            altText,
            ariaLabel,
            interactivity: interactivity ? { mouse: { disableMobile: true } } : undefined,
          })
          sceneRef.current = scene
        } else {
          // Use init() for JSON file approach
          const scenes = await UnicornStudio.init({ scale, dpi })
          const ourScene = scenes.find(
            (scene) =>
              scene.element === element ||
              scene.element.contains(element)
          )
          if (ourScene) {
            sceneRef.current = ourScene
          }
        }

        // Set up viewport observer for pause/resume
        if (pauseWhenOffscreen && sceneRef.current) {
          observerRef.current = new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (sceneRef.current) {
                  if (entry.isIntersecting) {
                    sceneRef.current.paused = false
                    sceneRef.current.play?.()
                  } else {
                    sceneRef.current.paused = true
                    sceneRef.current.pause?.()
                  }
                }
              }
            },
            { threshold: 0.1 }
          )
          observerRef.current.observe(element)
        }

        // Add resize listener
        window.addEventListener('resize', handleResize)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize scene')
      }
    }

    initializeScene()

    // Cleanup
    return () => {
      if (sceneRef.current?.destroy) {
        sceneRef.current.destroy()
        sceneRef.current = null
      }
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [isLoaded, projectId, jsonFilePath, scale, dpi, fps, lazyLoad, interactivity, pauseWhenOffscreen, handleResize, altText, ariaLabel])

  return (
    <div
      ref={elementRef}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: interactivity ? 'auto' : 'none',
      }}
      className={`unicorn-studio-scene ${className}`}
      role="img"
      aria-label={ariaLabel}
      data-us-dpi={dpi}
      data-us-scale={scale}
      data-us-fps={fps}
      data-us-alttext={altText}
      data-us-arialabel={ariaLabel}
    >
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-red-500 bg-background/80 px-4 py-2 rounded">
            Error: {error}
          </div>
        </div>
      )}
    </div>
  )
}