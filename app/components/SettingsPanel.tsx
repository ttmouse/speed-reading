import React, { useEffect } from 'react';
import { ReadingSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants/readerSettings';
import { RangeSlider } from './common/RangeSlider';

interface SettingsPanelProps {
  settings: ReadingSettings;
  onUpdate: (updates: Partial<ReadingSettings>) => void;
}

const SettingsPanel = ({ settings, onUpdate }: SettingsPanelProps) => {
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
    // 初始化所有 range input 的进度
    const rangeInputs = document.querySelectorAll('input[type="range"]');
    rangeInputs.forEach(input => {
      updateRangeProgress(input as HTMLInputElement);
    });
  }, [settings]);

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
            value={settings.speed}
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
            value={settings.chunkSize}
            onChange={value => onUpdate({ chunkSize: value })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            字数浮动范围（{settings.flexibleRange}字）
          </label>
          <input
            type="range"
            min="1"
            max="3"
            step="1"
            value={settings.flexibleRange}
            onChange={(e) => onUpdate({ flexibleRange: parseInt(e.target.value) })}
            className="custom-range"
          />
          <div className="text-xs text-gray-500 mt-1">
            允许每组字数在目标字数±{settings.flexibleRange}字范围内浮动
          </div>
        </div>

        <div className="preference-item">
          <label className="block text-sm font-medium mb-1">字体大小</label>
          <select 
            value={settings.fontSize}
            onChange={e => onUpdate({ fontSize: Number(e.target.value) })}
            className="w-full p-2 border rounded"
          >
            <option value="24">24px</option>
            <option value="32">32px</option>
            <option value="40">40px</option>
            <option value="48">48px</option>
          </select>
        </div>

        <div className="preference-item">
          <label className="block text-sm font-medium mb-1">字体颜色</label>
          <input 
            type="color"
            value={settings.fontColor}
            onChange={e => onUpdate({ fontColor: e.target.value })}
            className="w-full p-1 border rounded"
          />
        </div>

        <div className="preference-item">
          <label className="block text-sm font-medium mb-1">背景颜色</label>
          <input 
            type="color"
            value={settings.bgColor}
            onChange={e => onUpdate({ bgColor: e.target.value })}
            className="w-full p-1 border rounded"
          />
        </div>

        <div className="preference-item border-t pt-4">
          <h3 className="font-bold mb-3">阅读模式</h3>
          <select 
            value={settings.readingMode}
            onChange={e => onUpdate({ readingMode: e.target.value as 'serial' | 'highlight' })}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="serial">串行模式</option>
            <option value="highlight">高亮模式</option>
          </select>

          {settings.readingMode === 'highlight' && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">显示方式</label>
                <select
                  value={settings.highlightStyle}
                  onChange={e => onUpdate({ highlightStyle: e.target.value as 'scroll' | 'page' })}
                  className="w-full p-2 border rounded mb-2"
                >
                  <option value="scroll">滚动式</option>
                  <option value="page">分页式</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {settings.highlightStyle === 'scroll' ? '上下文行数' : '每页行数'} 
                  ({settings.highlightStyle === 'scroll' ? settings.contextLines : settings.pageSize})
                </label>
                <RangeSlider
                  min={settings.highlightStyle === 'scroll' ? 0 : 3}
                  max={settings.highlightStyle === 'scroll' ? 5 : 10}
                  value={settings.highlightStyle === 'scroll' ? settings.contextLines : settings.pageSize}
                  onChange={value => onUpdate({ 
                    [settings.highlightStyle === 'scroll' ? 'contextLines' : 'pageSize']: value 
                  })}
                />
              </div>

              {settings.highlightStyle === 'page' && (
                <>
                  <div>
                    <label className="block text-sm mb-1">文本区域宽度 ({settings.textAreaWidth}px)</label>
                    <RangeSlider
                      min={400}
                      max={1200}
                      step={100}
                      value={settings.textAreaWidth}
                      onChange={value => onUpdate({ textAreaWidth: value })}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      控制文本显示区域的宽度，文本会自动换行
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">行间距 ({settings.lineSpacing}px)</label>
                    <RangeSlider
                      min={8}
                      max={32}
                      step={4}
                      value={settings.lineSpacing}
                      onChange={value => onUpdate({ lineSpacing: value })}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  背景文本颜色
                </label>
                <input
                  type="color"
                  value={settings.dimmedTextColor}
                  onChange={e => onUpdate({ dimmedTextColor: e.target.value })}
                  className="w-full h-8"
                />
              </div>
            </div>
          )}
        </div>

        <div className="preference-item border-t pt-4">
          <h3 className="font-bold mb-3">高级设置</h3>
          <div className="space-y-2">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel; 