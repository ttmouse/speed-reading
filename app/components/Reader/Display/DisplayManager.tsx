'use client';

import React from 'react';
import { DisplayMode, ReadingSettings, ReadingState } from '@/app/types';
import { PageView } from './PageView';
import { ScrollView } from './ScrollView';
import { THEME_COLORS } from '@/app/constants/themes';

interface DisplayManagerProps {
  settings: ReadingSettings;
  state: ReadingState;
  display: string;
  enabled?: boolean;  // 是否启用新模式
}

// 基础显示组件
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

export function DisplayManager({ 
  settings, 
  state, 
  display,
  enabled = false 
}: DisplayManagerProps) {
  const themeColors = THEME_COLORS[settings.theme === 'LIGHT' ? 'light' : 'dark'];
  
  const containerStyle = {
    color: themeColors.text,
    backgroundColor: themeColors.background
  };

  // 如果未启用新模式或没有设置显示模式，使用基础显示
  if (!enabled || !settings.displayMode) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <div 
          className="w-full border rounded-lg overflow-hidden"
          style={containerStyle}
        >
          <BaseDisplay 
            text={display}
            fontSize={settings.fontSize}
          />
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
        {settings.displayMode === 'serial' ? (
          <BaseDisplay 
            text={display}
            fontSize={settings.fontSize}
          />
        ) : settings.displayMode === 'scroll' ? (
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
        ) : (
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
        )}
      </div>
    </div>
  );
} 