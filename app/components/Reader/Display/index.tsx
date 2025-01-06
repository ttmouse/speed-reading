'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { ReadingSettings, ReadingState } from '@/app/types';
import { THEME_COLORS } from '@/app/constants/themes';
import { DisplayManager } from './DisplayManager';

interface DisplayProps {
  settings: ReadingSettings;
  state: ReadingState;
  display: string;
  enabled?: boolean;
}

// 处理标点符号隐藏
const processDisplay = (text: string, hideEndPunctuation: boolean): string => {
  if (!hideEndPunctuation) return text;
  return text.replace(/[。，、；：？！,.;:?!]$/, '');
};

// 基础显示组件
const BaseDisplay = ({ text, fontSize }: { text: string; fontSize: number }) => (
  <div className="w-full flex items-center justify-center py-20">
    <div 
      className="text-center px-8 py-4 flex flex-col items-center gap-4"
      style={{ fontSize: `${fontSize}px` }}
    >
      <svg 
        className="w-12 h-12 stroke-current opacity-60" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
      <span className="opacity-80">{text}</span>
    </div>
  </div>
);

function DisplayComponent({ settings, state, display }: DisplayProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 基础容器样式
  const themeColors = THEME_COLORS[settings.theme === 'LIGHT' ? 'light' : 'dark'];
  const containerStyle = {
    color: themeColors.text,
    backgroundColor: themeColors.background
  };

  // 如果还没有挂载，返回一个基础的显示
  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <div 
          className="w-full border rounded-lg overflow-hidden"
          style={containerStyle}
        >
          <BaseDisplay text={display} fontSize={settings.fontSize} />
        </div>
      </div>
    );
  }

  // 如果没有文本，显示提示信息
  if (!state.text.trim()) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <div 
          className="w-full border rounded-lg overflow-hidden"
          style={containerStyle}
        >
          <BaseDisplay text="请在下方输入或粘贴要阅读的文本" fontSize={settings.fontSize} />
        </div>
      </div>
    );
  }

  return (
    <DisplayManager
      settings={settings}
      state={state}
      display={display}
      enabled={true}  // 启用新模式
    />
  );
}

// 使用 dynamic 导入并禁用 SSR
export const Display = dynamic(() => Promise.resolve(DisplayComponent), {
  ssr: false
}); 