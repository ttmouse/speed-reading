'use client';

import React, { useEffect, useState } from 'react';
import { ReadingSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants/readerSettings';
import { RangeSlider } from './common/RangeSlider';

interface SettingsPanelProps {
  settings: ReadingSettings;
  onUpdate: (updates: Partial<ReadingSettings>) => void;
}

const SettingsPanel = ({ settings, onUpdate }: SettingsPanelProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStopwordsChange = (value: string) => {
    onUpdate({ stopwords: value.split('\n').filter(word => word.trim()) });
  };

  const updateRangeProgress = (input: HTMLInputElement) => {
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    const value = parseFloat(input.value);
    const progress = ((value - min) / (max - min)) * 100;
    input.style.setProperty('--range-progress', `${progress}%`);
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof ReadingSettings) => {
    const value = Number(e.target.value);
    onUpdate({ [key]: value });
    updateRangeProgress(e.target);
  };

  React.useEffect(() => {
    if (mounted) {
      const rangeInputs = document.querySelectorAll('input[type="range"]');
      rangeInputs.forEach(input => {
        updateRangeProgress(input as HTMLInputElement);
      });
    }
  }, [settings, mounted]);

  if (!mounted) {
    return (
      <div className="fixed right-0 top-0 bottom-0 w-[320px] bg-white border-l shadow-lg">
        <div className="flex justify-between items-center p-4 border-b bg-white">
          <h2 className="text-xl font-bold">偏好设置</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[320px] bg-white border-l shadow-lg flex flex-col">
      <div className="flex justify-between items-center p-4 border-b bg-white">
        <h2 className="text-xl font-bold">偏好设置</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <div className="preference-item">
          <label className="block text-sm font-medium mb-1">
            阅读速度 ({settings.speed} 字/分钟)
          </label>
          <RangeSlider
            min={60}
            max={1000}
            step={30}
            value={Number(settings.speed)}
            onChange={value => onUpdate({ speed: value })}
          />
        </div>

        <div className="preference-item">
          <label className="block text-sm font-medium mb-1">
            每次显示字数 ({settings.chunkSize})
          </label>
          <RangeSlider
            min={1}
            max={10}
            value={Number(settings.chunkSize)}
            onChange={value => onUpdate({ chunkSize: value })}
          />
        </div>

        <div className="preference-item">
          <label className="block text-sm font-medium mb-1">
            字数浮动范围 ({settings.flexibleRange}字)
          </label>
          <RangeSlider
            min={1}
            max={3}
            step={1}
            value={Number(settings.flexibleRange)}
            onChange={value => onUpdate({ flexibleRange: value })}
          />
          <div className="text-xs text-gray-500 mt-1">
            允许每组字数在目标字数±{settings.flexibleRange}字范围内浮动
          </div>
        </div>

        <div className="preference-item">
          <label className="block text-sm font-medium mb-1">
            字体大小 ({settings.fontSize}px)
          </label>
          <RangeSlider
            min={16}
            max={56}
            step={4}
            value={Number(settings.fontSize)}
            onChange={value => onUpdate({ fontSize: value })}
          />
        </div>

        <div className="preference-item">
          <label className="block text-sm font-medium mb-1">
            文本区域宽度 ({settings.textAreaWidth}px)
          </label>
          <RangeSlider
            min={400}
            max={1200}
            step={50}
            value={settings.textAreaWidth}
            onChange={value => onUpdate({ textAreaWidth: value })}
          />
          <div className="text-xs text-gray-500 mt-1">
            控制文本显示区域的宽度，文本会自动换行
          </div>
        </div>

        <div className="preference-item">
          <label className="block text-sm font-medium mb-1">
            行间距 ({settings.lineSpacing}px)
          </label>
          <RangeSlider
            min={8}
            max={32}
            step={4}
            value={settings.lineSpacing}
            onChange={value => onUpdate({ lineSpacing: value })}
          />
        </div>

        <div className="preference-item border-t pt-4">
          <h3 className="font-bold mb-3">高级设置</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.skipStopwords}
                onChange={e => onUpdate({ skipStopwords: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">跳过停用词（如"的"、"了"等虚词）</span>
            </label>
            
            {settings.skipStopwords && (
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">
                  停用词列表（每行一个词）
                </label>
                <textarea
                  value={settings.stopwords.join('\n')}
                  onChange={e => handleStopwordsChange(e.target.value)}
                  className="w-full h-32 p-2 border rounded text-sm font-mono"
                  placeholder="在此输入停用词，每行一个"
                />
                <div className="text-xs text-gray-500 mt-1">
                  这些词在阅读时会被跳过，可以帮助你更快地理解主要内容
                </div>
              </div>
            )}

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.speedVariability}
                onChange={e => onUpdate({ speedVariability: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">速度变化：较长词组减速，较短词组加速</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.sentenceBreak}
                onChange={e => onUpdate({ sentenceBreak: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">在句末和段落末尾处开始新的词组</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.pauseAtBreaks}
                onChange={e => onUpdate({ pauseAtBreaks: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">在句末和段落末尾处稍作停顿</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.hideEndPunctuation}
                onChange={e => onUpdate({ hideEndPunctuation: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">隐藏末尾标点符号（如句号、逗号等）</span>
            </label>
          </div>
        </div>

        <div className="preference-item border-t pt-4">
          <h3 className="font-bold mb-3">显示</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.showProgress}
                onChange={(e) => onUpdate({ showProgress: e.target.checked })}
                className="toggle mr-2"
              />
              <label className="text-sm text-gray-600">显示进度</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.showChunkPreview}
                onChange={(e) => onUpdate({ showChunkPreview: e.target.checked })}
                className="toggle mr-2"
              />
              <label className="text-sm text-gray-600">显示分词预览</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={Boolean(settings.highlightSingleChunk)}
                onChange={(e) => {
                  const value = e.target.checked;
                  console.log('Checkbox changed:', value);
                  onUpdate({ highlightSingleChunk: value });
                }}
                className="toggle mr-2"
              />
              <label className="text-sm text-gray-600">仅高亮当前分组文字</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel; 