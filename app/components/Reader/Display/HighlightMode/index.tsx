import React from 'react';
import type { ReadingSettings } from '@/app/types';
import { ScrollView } from './ScrollView';
import { PageView } from './PageView';

interface HighlightModeProps {
  chunks: string[];
  currentPosition: number;
  contextLines: number;
  dimmedTextColor: string;
  highlightColor: string;
  highlightStyle: 'scroll' | 'page';
  pageSize?: number;
  settings?: ReadingSettings;
}

export function HighlightMode(props: HighlightModeProps) {
  const { highlightStyle } = props;

  if (highlightStyle === 'page') {
    return <PageView {...props} />;
  }

  return <ScrollView {...props} />;
} 