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
    color: settings.fontColor,
    backgroundColor: settings.bgColor
  };

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
              chunks={state.chunks}
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
          <div className="w-full flex items-center justify-center py-20">
            <div 
              className="text-center px-8 py-4"
              style={{ fontSize: `${settings.fontSize}px` }}
            >
              <span>{display}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 