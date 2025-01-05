'use client';

import React from 'react';
import type { ReadingSettings, ReadingState } from '@/app/types';
import { PageView } from './PageView';
import { ScrollView } from './ScrollView';

interface DisplayProps {
  settings: ReadingSettings;
  state: ReadingState;
  display: string;
}

export function Display({ settings, state, display }: DisplayProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 基础容器样式
  const containerStyle = {
    minHeight: '60vh',
    color: settings.fontColor,
    backgroundColor: settings.bgColor
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div 
        className="text-display w-full border rounded-lg mb-8 overflow-hidden bg-white"
        style={containerStyle}
      >
        {settings.readingMode === 'highlight' ? (
          settings.highlightStyle === 'page' ? (
            <PageView
              text={state.text}
              settings={{
                chunkSize: settings.chunkSize,
                textAreaWidth: settings.textAreaWidth,
                fontSize: settings.fontSize,
                lineSpacing: settings.lineSpacing,
                pageSize: settings.pageSize,
                dimmedTextColor: settings.dimmedTextColor,
                fontColor: settings.fontColor
              }}
              currentPosition={state.currentPosition}
            />
          ) : (
            <ScrollView
              text={state.text}
              settings={{
                chunkSize: settings.chunkSize,
                fontSize: settings.fontSize,
                lineSpacing: settings.lineSpacing,
                contextLines: settings.contextLines,
                dimmedTextColor: settings.dimmedTextColor,
                fontColor: settings.fontColor
              }}
              currentPosition={state.currentPosition}
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span>{display}</span>
          </div>
        )}
      </div>
    </div>
  );
} 