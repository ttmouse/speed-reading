'use client';

import React from 'react';
import type { ReadingSettings, ReadingState } from '@/app/types';
import dynamic from 'next/dynamic';
import { PageView } from './PageView';
import { ScrollView } from './ScrollView';
import { THEME_COLORS, THEME_MODES } from '@/app/constants/themes';

interface DisplayProps {
  settings: ReadingSettings;
  state: ReadingState;
  display: string;
}

// 处理标点符号隐藏
const processDisplay = (text: string, hideEndPunctuation: boolean): string => {
  if (!hideEndPunctuation) return text;
  return text.replace(/[。，、；：？！,.;:?!]$/, '');
};

// 创建一个基础显示组件
const BaseDisplay = ({ text, fontSize }: { text: string; fontSize: number }) => (
  <div className="w-full flex items-center justify-center py-20">
    <div 
      className="text-center px-8 py-4"
      style={{ fontSize: `${fontSize}px` }}
    >
      <span>{text}</span>
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

  return (
    <div className="flex-1 flex items-center justify-center min-h-[300px]">
      <div 
        className="w-full border rounded-lg overflow-hidden"
        style={containerStyle}
      >
        {settings.readingMode === 'highlight' ? (
          settings.highlightStyle === 'page' ? (
            <PageView
              text={state.text}
              chunks={state.chunks}
              settings={{
                chunkSize: settings.chunkSize,
                textAreaWidth: settings.textAreaWidth,
                fontSize: settings.fontSize,
                lineSpacing: settings.lineSpacing,
                pageSize: settings.pageSize,
                dimmedTextColor: themeColors.dimmed,
                fontColor: themeColors.text,
                hideEndPunctuation: settings.hideEndPunctuation
              }}
              currentPosition={state.currentPosition}
            />
          ) : (
            <ScrollView
              text={state.text}
              chunks={state.chunks}
              settings={{
                chunkSize: settings.chunkSize,
                fontSize: settings.fontSize,
                lineSpacing: settings.lineSpacing,
                contextLines: settings.contextLines,
                dimmedTextColor: themeColors.dimmed,
                fontColor: themeColors.text,
                hideEndPunctuation: settings.hideEndPunctuation
              }}
              currentPosition={state.currentPosition}
            />
          )
        ) : (
          <BaseDisplay 
            text={processDisplay(display, settings.hideEndPunctuation)}
            fontSize={settings.fontSize}
          />
        )}
      </div>
    </div>
  );
}

// 使用 dynamic 导入并禁用 SSR
export const Display = dynamic(() => Promise.resolve(DisplayComponent), {
  ssr: false
}); 