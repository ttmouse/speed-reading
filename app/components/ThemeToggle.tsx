'use client';

import React from 'react';
import { ThemeMode } from '../constants/themes';

interface ThemeToggleProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const isDark = currentTheme === 'DARK';

  return (
    <button
      onClick={() => onThemeChange(isDark ? 'LIGHT' : 'DARK')}
      className={`p-2 rounded-lg transition-all transform active:scale-95 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-200 dark:bg-gray-700'
      }`}
      title={isDark ? '切换到浅色模式' : '切换到深色模式'}
    >
      <div className="transition-transform duration-200 transform">
        {isDark ? (
          <svg className="w-5 h-5 stroke-white" fill="none" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v2m0 14v2M5.636 5.636l1.414 1.414m10.607 10.607l1.414 1.414M3 12h2m14 0h2M5.636 18.364l1.414-1.414m10.607-10.607l1.414-1.414M12 7a5 5 0 110 10 5 5 0 010-10z"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5 stroke-gray-700 dark:stroke-gray-300" fill="none" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646"
            />
          </svg>
        )}
      </div>
    </button>
  );
}; 