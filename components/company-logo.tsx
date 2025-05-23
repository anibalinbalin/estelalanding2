'use client'

import { useTheme } from '@/components/theme-provider'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export function CompanyLogo() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

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

  if (!mounted) {
    return (
      <Image
        src="/logo_original.png"
        alt="Company Logo"
        width={200}
        height={60}
        className="mb-6 w-[100px] h-auto sm:w-[200px]"
        priority
      />
    )
  }

  const logoSrc = resolvedTheme === 'dark' ? '/logo_blanco.png' : '/logo_original.png'

  return (
    <Image
      src={logoSrc}
      alt="Company Logo"
      width={200}
      height={60}
      className="mb-6 w-[100px] h-auto sm:w-[200px]"
      priority
    />
  )
}