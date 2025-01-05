import React from 'react';
import type { ReadingSettings, ReadingState } from '@/app/types';
import { HighlightMode } from './HighlightMode';

interface DisplayProps {
  settings: ReadingSettings;
  state: ReadingState;
  display: string;
}

export function Display({ settings, state, display }: DisplayProps) {
  const lineHeight = 40;
  const totalLines = settings.highlightStyle === 'page' 
    ? settings.pageSize || 5
    : 1 + (settings.contextLines * 2);
  const containerHeight = lineHeight * totalLines;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div 
        className="text-display w-full flex flex-col border rounded-lg mb-8 overflow-hidden"
        style={{
          minHeight: `${containerHeight}px`,
          fontSize: `${settings.fontSize}px`,
          color: settings.fontColor,
          backgroundColor: settings.bgColor
        }}
      >
        {settings.readingMode === 'highlight' ? (
          <HighlightMode
            chunks={state.chunks}
            currentPosition={state.currentPosition}
            contextLines={settings.contextLines}
            dimmedTextColor={settings.dimmedTextColor}
            highlightColor={settings.fontColor}
            highlightStyle={settings.highlightStyle}
            pageSize={settings.pageSize}
            settings={settings}
          />
        ) : (
          display
        )}
      </div>
    </div>
  );
} 