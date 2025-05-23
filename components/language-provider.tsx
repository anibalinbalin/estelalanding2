'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'es'

type LanguageProviderProps = {
  children: React.ReactNode
  defaultLanguage?: Language
}

type LanguageProviderState = {
  language: Language
  setLanguage: (language: Language) => void
}

const initialState: LanguageProviderState = {
  language: 'es',
  setLanguage: () => null,
}

const LanguageProviderContext = createContext<LanguageProviderState>(initialState)

export function LanguageProvider({
  children,
  defaultLanguage = 'es',
  ...props
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(defaultLanguage)

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language
    if (storedLanguage) {
      setLanguage(storedLanguage)
    }
  }, [])

  const value = {
    language,
    setLanguage: (newLanguage: Language) => {
      localStorage.setItem('language', newLanguage)
      setLanguage(newLanguage)
    },
  }

  return (
    <LanguageProviderContext.Provider {...props} value={value}>
      {children}
    </LanguageProviderContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext)

  if (context === undefined)
    throw new Error('useLanguage must be used within a LanguageProvider')

  return context
}