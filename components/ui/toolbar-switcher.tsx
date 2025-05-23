'use client';

import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';
import { useLanguage } from '@/components/language-provider';
import { Monitor, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const themes = [
  {
    key: 'system',
    icon: Monitor,
    label: 'System theme',
  },
  {
    key: 'light',
    icon: Sun,
    label: 'Light theme',
  },
  {
    key: 'dark',
    icon: Moon,
    label: 'Dark theme',
  },
];

export type ToolbarSwitcherProps = {
  className?: string;
};

export const ToolbarSwitcher = ({
  className,
}: ToolbarSwitcherProps) => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <div
      className={cn(
        'relative isolate flex h-8 rounded-full bg-background p-1 ring-1 ring-border',
        className
      )}
    >
      {/* Language Toggle */}
      <button
        type="button"
        className="relative h-6 w-6 rounded-full mr-1"
        onClick={toggleLanguage}
        aria-label={language === 'en' ? 'Switch to Spanish' : 'Switch to English'}
      >
        {language === 'es' && (
          <motion.div
            layoutId="activeLanguage"
            className="absolute inset-0 rounded-full bg-secondary"
            transition={{ type: 'spring', duration: 0.5 }}
          />
        )}
        <span
          className={cn(
            'relative z-10 block text-sm font-medium',
            language === 'es' ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          文
        </span>
      </button>

      {/* Divider */}
      <div className="w-px bg-border mx-1" />

      {/* Theme Toggles */}
      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;

        return (
          <button
            type="button"
            key={key}
            className="relative h-6 w-6 rounded-full"
            onClick={() => setTheme(key as 'light' | 'dark' | 'system')}
            aria-label={label}
          >
            {isActive && (
              <motion.div
                layoutId="activeTheme"
                className="absolute inset-0 rounded-full bg-secondary"
                transition={{ type: 'spring', duration: 0.5 }}
              />
            )}
            <Icon
              className={cn(
                'relative z-10 m-auto h-4 w-4',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}
            />
          </button>
        );
      })}
    </div>
  );
};