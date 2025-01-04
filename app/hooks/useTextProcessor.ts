import { useCallback } from 'react';
import type { ReadingSettings } from '@/app/types';
import { splitTextIntoChunks } from '@/app/utils/textProcessing';

export function useTextProcessor(settings: ReadingSettings) {
  const splitIntoChunks = useCallback((text: string, size: number) => {
    return splitTextIntoChunks(text, size, {
      skipStopwords: settings.skipStopwords,
      stopwords: settings.stopwords
    });
  }, [settings.skipStopwords, settings.stopwords]);

  return { splitIntoChunks };
} 