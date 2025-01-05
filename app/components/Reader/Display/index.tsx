'use client';

import React from 'react';
import type { ReadingSettings, ReadingState } from '@/app/types';
import dynamic from 'next/dynamic';
import { PageView } from './PageView';
import { ScrollView } from './ScrollView';

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
  const containerStyle = {
    color: settings.fontColor,
    backgroundColor: settings.bgColor
  };

  // 如果还没有挂载，返回一个基础的显示
  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <div 
          className="w-full border rounded-lg overflow-hidden bg-white"
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
        className="w-full border rounded-lg overflow-hidden bg-white"
        style={containerStyle}
      >
        {settings.readingMode === 'highlight' ? (
          settings.highlightStyle === 'page' ? (
            <PageView
              text={state.text}
              chunks={state.chunks}
              settings={settings}
              currentPosition={state.currentPosition}
            />
          ) : (
            <ScrollView
              text={state.text}
              chunks={state.chunks}
              settings={settings}
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