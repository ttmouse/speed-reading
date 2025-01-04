'use client'

import * as React from 'react';
import type { ReadingSettings } from '@/app/types';

interface Props {
  settings: ReadingSettings;
  onUpdate: (updates: Partial<ReadingSettings>) => void;
}

export default function Settings({ settings, onUpdate }: Props): JSX.Element {
  const [stopwordsList, setStopwordsList] = React.useState(settings.stopwords.join('\n'));

  const handleStopwordsChange = (value: string): void => {
    setStopwordsList(value);
    onUpdate({
      stopwords: value.split('\n').filter(word => word.trim())
    });
  };

  return (
    <div className="settings-panel space-y-4 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">偏好设置</h2>
      </div>

      <div className="space-y-4">
        <div className="preference-item">
          <label htmlFor="windowSize" className="block mb-1">窗口大小 (宽x高)</label>
          <select
            id="windowSize"
            value={settings.windowSize}
            onChange={(e) => onUpdate({ windowSize: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="800x600">800 x 600</option>
            <option value="900x700">900 x 700</option>
            <option value="1000x800">1000 x 800</option>
          </select>
        </div>

        <div className="preference-item">
          <label htmlFor="fontSize" className="block mb-1">字体大小</label>
          <select
            id="fontSize"
            value={settings.fontSize}
            onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
            className="w-full p-2 border rounded"
          >
            {[24, 32, 40, 48].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="preference-item">
          <label htmlFor="fontColor" className="block mb-1">字体颜色</label>
          <input
            type="color"
            id="fontColor"
            value={settings.fontColor}
            onChange={(e) => onUpdate({ fontColor: e.target.value })}
            className="w-full p-1 border rounded"
          />
        </div>

        <div className="preference-item">
          <label htmlFor="bgColor" className="block mb-1">背景颜色</label>
          <input
            type="color"
            id="bgColor"
            value={settings.bgColor}
            onChange={(e) => onUpdate({ bgColor: e.target.value })}
            className="w-full p-1 border rounded"
          />
        </div>

        <div className="preference-item">
          <label htmlFor="textAlign" className="block mb-1">文本对齐</label>
          <select
            id="textAlign"
            value={settings.textAlign}
            onChange={(e) => onUpdate({ textAlign: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="left">左对齐</option>
            <option value="center">居中</option>
            <option value="right">右对齐</option>
          </select>
        </div>

        <div className="preference-item">
          <h3 className="font-semibold mb-2">高级设置</h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.speedVariability}
              onChange={(e) => onUpdate({ speedVariability: e.target.checked })}
            />
            速度变化：较长词组减速，较短词组加速
          </label>
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={settings.sentenceBreak}
              onChange={(e) => onUpdate({ sentenceBreak: e.target.checked })}
            />
            在句末和段落末尾处开始新的词组
          </label>
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={settings.pauseAtBreaks}
              onChange={(e) => onUpdate({ pauseAtBreaks: e.target.checked })}
            />
            在句末和段落末尾处稍作停顿
          </label>
        </div>

        <div className="preference-item">
          <h3 className="font-semibold mb-2">停用词设置</h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.skipStopwords}
              onChange={(e) => onUpdate({ skipStopwords: e.target.checked })}
            />
            跳过停用词（不影响理解的词，如"的"、"了"等）
          </label>
          <textarea
            value={stopwordsList}
            onChange={(e) => handleStopwordsChange(e.target.value)}
            placeholder="每行一个停用词"
            className="w-full h-32 mt-2 p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
} 