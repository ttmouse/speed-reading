import { useState } from 'react';

interface Features {
  newReadingMode: boolean;
}

interface UseFeatures {
  isEnabled: (feature: keyof Features) => boolean;
  enableFeature: (feature: keyof Features) => void;
  disableFeature: (feature: keyof Features) => void;
}

// 默认特性开关状态
const DEFAULT_FEATURES: Features = {
  newReadingMode: true  // 默认启用新的阅读模式
};

export function useFeatures(): UseFeatures {
  const [features, setFeatures] = useState<Features>(DEFAULT_FEATURES);

  const isEnabled = (feature: keyof Features): boolean => {
    return features[feature];
  };

  const enableFeature = (feature: keyof Features): void => {
    setFeatures(prev => ({ ...prev, [feature]: true }));
  };

  const disableFeature = (feature: keyof Features): void => {
    setFeatures(prev => ({ ...prev, [feature]: false }));
  };

  return {
    isEnabled,
    enableFeature,
    disableFeature
  };
} 