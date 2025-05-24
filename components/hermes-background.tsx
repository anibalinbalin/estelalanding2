'use client'

import { useTheme } from '@/components/theme-provider'
import Image from 'next/image'
import { useEffect, useState, useRef, memo } from 'react'

export const HermesBackground = memo(function HermesBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setResolvedTheme(systemTheme)
    } else {
      setResolvedTheme(theme as 'light' | 'dark')
    }
  }, [theme, mounted])

  // Use a single container that doesn't re-render on language change
  const containerStyle = {
    position: 'absolute' as const,
    inset: 0,
    width: '100%',
    height: '100%',
  }

  if (!mounted) {
    return (
      <div style={containerStyle}>
        <Image
          className="h-full w-full object-cover"
          src="/hermes/light/hermes_desktop_hd.png"
          alt="Hermes Background"
          fill
          priority
          sizes="100vw"
          style={{ objectPosition: 'center' }}
        />
      </div>
    )
  }

  const themeFolder = resolvedTheme === 'dark' ? 'night' : 'light'

  // Determine image based on viewport
  const getImageSrc = () => {
    if (typeof window === 'undefined') return `/hermes/${themeFolder}/hermes_desktop_hd${resolvedTheme === 'dark' ? '_night' : ''}.png`
    
    const width = window.innerWidth
    const suffix = resolvedTheme === 'dark' ? '_night' : ''
    
    if (width >= 1024) {
      return `/hermes/${themeFolder}/hermes_desktop_hd${suffix}.png`
    } else if (width >= 768) {
      return `/hermes/${themeFolder}/hermes_tablet${suffix}.png`
    } else {
      return `/hermes/${themeFolder}/hermes_mobile${suffix}.png`
    }
  }

  return (
    <div ref={imageRef} style={containerStyle}>
      <picture className="h-full w-full block">
        {/* Desktop images */}
        <source 
          media="(min-width: 1024px)" 
          srcSet={`/hermes/${themeFolder}/hermes_desktop_hd${resolvedTheme === 'dark' ? '_night' : ''}.png`}
        />
        {/* Tablet images */}
        <source 
          media="(min-width: 768px)" 
          srcSet={`/hermes/${themeFolder}/hermes_tablet${resolvedTheme === 'dark' ? '_night' : ''}.png`}
        />
        {/* Mobile images */}
        <source 
          media="(max-width: 767px)" 
          srcSet={`/hermes/${themeFolder}/hermes_mobile${resolvedTheme === 'dark' ? '_night' : ''}.png`}
        />
        
        {/* Fallback with Next.js Image */}
        <Image
          className="h-full w-full object-cover"
          src={getImageSrc()}
          alt="Hermes Background"
          fill
          priority
          sizes="100vw"
          style={{ 
            objectPosition: 'center',
            // Prevent layout shift by keeping dimensions stable
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
          // Prevent re-loading on prop changes
          unoptimized={false}
        />
      </picture>
    </div>
  )
})