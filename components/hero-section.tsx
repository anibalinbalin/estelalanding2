'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { HermesBackground } from '@/components/hermes-background'
import { CompanyLogo } from '@/components/company-logo'
import { useLanguage } from '@/components/language-provider'
import { InteractiveEffectPositioner } from '@/components/interactive-effect-positioner'

export default function HeroSection() {
    const { language } = useLanguage()
    const [jsonPath, setJsonPath] = useState('/unicorn-effect.json')
    
    // Handle responsive JSON loading
    React.useEffect(() => {
        const updateJsonPath = () => {
            const width = window.innerWidth
            if (width < 640) {
                setJsonPath('/Polaris (Remix)_mobile.json')
            } else if (width < 1024) {
                setJsonPath('/Polaris (Remix)_tablet.json')
            } else {
                setJsonPath('/unicorn-effect.json')
            }
        }
        
        updateJsonPath()
        window.addEventListener('resize', updateJsonPath)
        
        return () => window.removeEventListener('resize', updateJsonPath)
    }, [])
    
    const content = {
        en: {
            title: "When technology meets wisdom",
            subtitle: "Guiding businesses through technological transformations with the perfect balance of trusted expertise and innovative insight.",
            startBuilding: "Start Building",
            requestDemo: "Request a demo",
            powering: "Powering the best teams"
        },
        es: {
            title: "Cuando la tecnología y el conocimiento convergen",
            subtitle: "Guiando a las empresas a través de transformaciones tecnológicas con soluciones y claridad que solo un equipo ágil y especializado puede brindar.",
            startBuilding: "Comenzar",
            requestDemo: "Solicitar demo",
            powering: "Impulsando a los mejores equipos"
        }
    }

    const t = content[language]

    return (
        <>
            <main className="overflow-x-hidden">
                <section className="relative min-h-screen">
                    <div className="absolute inset-0 -z-10">
                        <HermesBackground />
                    </div>
                    <div className="absolute inset-0 z-20" style={{ mixBlendMode: 'screen' }}>
                        <InteractiveEffectPositioner 
                            jsonPath={jsonPath}
                            onPositionsSaved={(positions) => {
                                console.log('Positions saved:', positions)
                            }}
                        />
                    </div>
                    <div className="relative z-10 flex min-h-screen items-center py-12 sm:py-16 lg:py-24">
                        <div className="max-w-6xl px-4 sm:px-6 lg:px-8 w-full sm:mx-auto">
                            <div className="max-w-[50%] text-left">
                                <CompanyLogo />
                                <h1 className="text-balance text-[#2f2f31] dark:text-[#f7f8f8]"> 
                                    <span className="block text-[32px] leading-[36px] tracking-[-0.704px] min-[640px]:text-[64px] min-[640px]:leading-[67.84px] min-[640px]:tracking-[-1.408px] font-[510]" 
                                        style={{
                                            fontFamily: 'var(--font-inter), "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
                                        }}
                                    >
                                        {t.title}
                                    </span>
                                </h1>
                                <p className="mt-6 sm:mt-8 text-pretty text-[#5b5c5d] dark:text-[#ffffffb3]">  
                                    <span className="block text-[16px] leading-[22px] tracking-normal sm:text-[18px] sm:leading-[24px] sm:tracking-[-0.18px] lg:text-[21px] lg:leading-[28px] lg:tracking-[-0.21px]"
                                        style={{
                                            fontFamily: 'var(--font-inter), "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
                                        }}
                                    >
                                        {t.subtitle}
                                    </span>
                                </p>

                                <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col items-start justify-start gap-2 sm:flex-row">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="px-5 text-base">
                                        <Link href="#link">
                                            <span className="text-nowrap">{t.startBuilding}</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="px-5 text-base">
                                        <Link href="#link">
                                            <span className="text-nowrap">{t.requestDemo}</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-background pb-16 sm:pb-20 lg:pb-32">
                    <div className="group relative m-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center md:flex-row">
                            <div className="md:max-w-44 md:border-r md:pr-6">
                                <p className="text-left text-sm">{t.powering}</p>
                            </div>
                            <div className="relative py-6 md:w-[calc(100%-11rem)]">
                                <InfiniteSlider
                                    speedOnHover={20}
                                    speed={40}
                                    gap={112}>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                            alt="Nvidia Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>

                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/column.svg"
                                            alt="Column Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/github.svg"
                                            alt="GitHub Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/nike.svg"
                                            alt="Nike Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                            alt="Lemon Squeezy Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/laravel.svg"
                                            alt="Laravel Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-7 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/lilly.svg"
                                            alt="Lilly Logo"
                                            height="28"
                                            width="auto"
                                        />
                                    </div>

                                    <div className="flex">
                                        <img
                                            className="mx-auto h-6 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/openai.svg"
                                            alt="OpenAI Logo"
                                            height="24"
                                            width="auto"
                                        />
                                    </div>
                                </InfiniteSlider>

                                {/* Enhanced blur effects with proper iOS support */}
                                <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20" style={{zIndex: 2}} />
                                <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20" style={{zIndex: 2}} />
                                
                                <ProgressiveBlur
                                    className="pointer-events-none absolute left-0 top-0 h-full w-20"
                                    direction="left"
                                    blurIntensity={1.5}
                                    style={{zIndex: 3}}
                                />
                                <ProgressiveBlur
                                    className="pointer-events-none absolute right-0 top-0 h-full w-20"
                                    direction="right"
                                    blurIntensity={1.5}
                                    style={{zIndex: 3}}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}