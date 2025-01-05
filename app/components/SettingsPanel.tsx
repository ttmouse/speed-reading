import { ReadingSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants/readerSettings';

interface SettingsPanelProps {
  settings: ReadingSettings;
  onUpdate: (updates: Partial<ReadingSettings>) => void;
}

const SettingsPanel = ({ settings, onUpdate }: SettingsPanelProps) => {
  const handleStopwordsChange = (value: string) => {
    onUpdate({ stopwords: value.split('\n').filter(word => word.trim()) });
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[320px] bg-white border-l shadow-lg flex flex-col">
      <div className="flex justify-between items-center p-4 border-b bg-white">
        <h2 className="text-xl font-bold">偏好设置</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="preference-item">
          <label className="block text-sm font-medium mb-1">
            阅读速度 ({settings.speed} 字/分钟)
          </label>
          <input
            type="range"
            min="60"
            max="1000"
            step="30"
            value={settings.speed}
            onChange={e => onUpdate({ speed: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <div className="preference-item">
          <label className="block text-sm font-medium mb-1">
            每次显示字数 ({settings.chunkSize})
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={settings.chunkSize}
            onChange={e => onUpdate({ chunkSize: Number(e.target.value) })}
            className="w-full"
          />
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
                <input
                  type="range"
                  min={settings.highlightStyle === 'scroll' ? 0 : 3}
                  max={settings.highlightStyle === 'scroll' ? 5 : 10}
                  value={settings.highlightStyle === 'scroll' ? settings.contextLines : settings.pageSize}
                  onChange={e => onUpdate({ 
                    [settings.highlightStyle === 'scroll' ? 'contextLines' : 'pageSize']: Number(e.target.value) 
                  })}
                  className="w-full"
                />
              </div>

              {settings.highlightStyle === 'page' && (
                <>
                  <div>
                    <label className="block text-sm mb-1">文本区域宽度 ({settings.textAreaWidth}px)</label>
                    <input
                      type="range"
                      value={settings.textAreaWidth}
                      onChange={(e) => onUpdate({ textAreaWidth: parseInt(e.target.value) })}
                      min={400}
                      max={1200}
                      step={100}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      控制文本显示区域的宽度，文本会自动换行
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">行间距 ({settings.lineSpacing}px)</label>
                    <input
                      type="range"
                      value={settings.lineSpacing}
                      onChange={(e) => onUpdate({ lineSpacing: parseInt(e.target.value) })}
                      min={8}
                      max={32}
                      step={4}
                      className="w-full"
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