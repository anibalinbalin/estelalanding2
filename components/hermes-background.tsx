'use client'

import { useTheme } from '@/components/theme-provider'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export function HermesBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [currentImage, setCurrentImage] = useState<string>('')

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

  useEffect(() => {
    if (!mounted) return
    
    const updateCurrentImage = () => {
      const width = window.innerWidth
      const themeFolder = resolvedTheme === 'dark' ? 'night' : 'light'
      const suffix = resolvedTheme === 'dark' ? '_night' : ''
      
      if (width >= 1024) {
        setCurrentImage(`hermes_desktop_hd${suffix}.png`)
      } else if (width >= 768) {
        setCurrentImage(`hermes_tablet${suffix}.png`)
      } else {
        setCurrentImage(`hermes_mobile${suffix}.png`)
      }
    }
    
    updateCurrentImage()
    window.addEventListener('resize', updateCurrentImage)
    
    return () => window.removeEventListener('resize', updateCurrentImage)
  }, [mounted, resolvedTheme])

  if (!mounted) {
    return (
      <>
        <Image
          className="h-full w-full object-cover"
          src="/hermes/light/hermes_desktop_hd.png"
          alt="Hermes Background"
          fill
          priority
        />
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-md text-sm font-mono z-50">
          Loading: hermes_desktop_hd.png
        </div>
      </>
    )
  }

  const themeFolder = resolvedTheme === 'dark' ? 'night' : 'light'
  const suffix = resolvedTheme === 'dark' ? '_night' : ''

  return (
    <>
      <picture className="h-full w-full">
        {/* Desktop images */}
        <source 
          media="(min-width: 1024px)" 
          srcSet={`/hermes/${themeFolder}/hermes_desktop_hd${suffix}.png 1920w, /hermes/${themeFolder}/hermes_desktop_retina${suffix}.png 2880w`}
        />
        {/* Tablet images */}
        <source 
          media="(min-width: 768px)" 
          srcSet={`/hermes/${themeFolder}/hermes_tablet${suffix}.png`}
        />
        {/* Mobile images */}
        <source 
          media="(max-width: 767px)" 
          srcSet={`/hermes/${themeFolder}/hermes_mobile${suffix}.png 375w, /hermes/${themeFolder}/hermes_mobile_low${suffix}.png 320w`}
        />
        
        {/* Fallback */}
        <Image
          className="h-full w-full object-cover object-right"
          src={`/hermes/${themeFolder}/hermes_desktop_hd${suffix}.png`}
          alt="Hermes Background"
          fill
          priority
        />
      </picture>
      {/* Temporary overlay showing current image */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-md text-sm font-mono z-50">
        Current: {currentImage || 'Detecting...'}
      </div>
    </>
  )
}