import { ReadingSettings } from '@/app/types';
import { DEFAULT_SETTINGS } from '@/app/hooks/useReader';

interface SettingsPanelProps {
  settings: ReadingSettings;
  onUpdate: (updates: Partial<ReadingSettings>) => void;
  onClose: () => void;
  visible: boolean;
}

export function SettingsPanel({ settings, onUpdate, onClose, visible }: SettingsPanelProps) {
  if (!visible) return null;

  const handleStopwordsChange = (value: string) => {
    onUpdate({ stopwords: value.split('\n').filter(word => word.trim()) });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg w-[500px] max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-lg z-10">
          <h2 className="text-xl font-bold">偏好设置</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
            <label className="block text-sm font-medium mb-1">窗口大小</label>
            <select 
              value={settings.windowSize}
              onChange={e => onUpdate({ windowSize: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="800x600">800 x 600</option>
              <option value="900x700">900 x 700</option>
              <option value="1000x800">1000 x 800</option>
            </select>
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

          <div className="preference-item">
            <label className="block text-sm font-medium mb-1">文本对齐</label>
            <select 
              value={settings.textAlign}
              onChange={e => onUpdate({ textAlign: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="left">左对齐</option>
              <option value="center">居中</option>
              <option value="right">右对齐</option>
            </select>
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

          <div className="preference-item border-t pt-4">
            <h3 className="font-bold mb-3">停用词设置</h3>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={settings.skipStopwords}
                onChange={e => onUpdate({ skipStopwords: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">跳过停用词（不影响理解的词，如"的"、"了"等）</span>
            </label>
            <textarea
              value={settings.stopwords.join('\n')}
              onChange={e => handleStopwordsChange(e.target.value)}
              placeholder="每行一个停用词"
              className="w-full h-32 p-2 border rounded text-sm"
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
            <h3 className="font-bold mb-3">视觉辅助</h3>
            <div className="space-y-2">
              <select 
                value={settings.focusPoint}
                onChange={e => onUpdate({ focusPoint: e.target.value as any })}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="left">左侧注视点</option>
                <option value="center">中心注视点</option>
                <option value="right">右侧注视点</option>
              </select>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.highlightFocus}
                  onChange={e => onUpdate({ highlightFocus: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">高亮焦点词</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.showProgress}
                  onChange={e => onUpdate({ showProgress: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">显示进度条</span>
              </label>
            </div>
          </div>

          <div className="preference-item border-t pt-4">
            <h3 className="font-bold mb-3">阅读训练</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.subvocalizationReminder}
                  onChange={e => onUpdate({ subvocalizationReminder: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">提醒避免默读</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.regressionControl}
                  onChange={e => onUpdate({ regressionControl: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">控制回视</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.eyeMovementGuide}
                  onChange={e => onUpdate({ eyeMovementGuide: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">眼动引导</span>
              </label>
            </div>
          </div>

          <div className="preference-item border-t pt-4">
            <h3 className="font-bold mb-3">字体设置</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">字体</label>
                <select 
                  value={settings.fontFamily}
                  onChange={e => onUpdate({ fontFamily: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="system-ui">系统默认</option>
                  <option value="Microsoft YaHei">微软雅黑</option>
                  <option value="SimSun">宋体</option>
                  <option value="KaiTi">楷体</option>
                  <option value="SimHei">黑体</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  字体粗细 ({settings.fontWeight})
                </label>
                <input
                  type="range"
                  min="300"
                  max="700"
                  step="100"
                  value={settings.fontWeight}
                  onChange={e => onUpdate({ fontWeight: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  字间距 ({settings.letterSpacing}px)
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={settings.letterSpacing}
                  onChange={e => onUpdate({ letterSpacing: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="preference-item border-t pt-4">
            <h3 className="font-bold mb-3">显示设置</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.showFocusPoint}
                  onChange={e => onUpdate({ showFocusPoint: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">显示注视点</span>
              </label>
              
              {settings.showFocusPoint && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">注视点颜色</label>
                    <input 
                      type="color"
                      value={settings.focusPointColor}
                      onChange={e => onUpdate({ focusPointColor: e.target.value })}
                      className="w-full p-1 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      注视点大小 ({settings.focusPointSize}px)
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      value={settings.focusPointSize}
                      onChange={e => onUpdate({ focusPointSize: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="preference-item border-t pt-4">
            <h3 className="font-bold mb-3">阅读辅助</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.previewNextWord}
                  onChange={e => onUpdate({ previewNextWord: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">预览下一个词</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.showContext}
                  onChange={e => onUpdate({ showContext: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">显示上下文</span>
              </label>
              
              {settings.showContext && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    上下文行数 ({settings.contextLines})
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={settings.contextLines}
                    onChange={e => onUpdate({ contextLines: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="preference-item border-t pt-4">
            <h3 className="font-bold mb-3">声音设置</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={e => onUpdate({ soundEnabled: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">启用声音</span>
              </label>
              
              {settings.soundEnabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      音量 ({settings.soundVolume}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.soundVolume}
                      onChange={e => onUpdate({ soundVolume: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">声音类型</label>
                    <select 
                      value={settings.soundType}
                      onChange={e => onUpdate({ soundType: e.target.value as any })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="click">点击声</option>
                      <option value="beep">提示音</option>
                      <option value="none">无声音</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="preference-item border-t pt-4">
            <h3 className="font-bold mb-3">统计设置</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.trackStats}
                  onChange={e => onUpdate({ trackStats: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">记录统计数据</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.showInstantWPM}
                  onChange={e => onUpdate({ showInstantWPM: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">显示实时速度</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.showAccuracy}
                  onChange={e => onUpdate({ showAccuracy: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">显示准确度</span>
              </label>
            </div>
          </div>
        </div>

        <div className="border-t p-4 sticky bottom-0 bg-white rounded-b-lg z-10 flex justify-end space-x-4">
          <button 
            onClick={() => onUpdate(DEFAULT_SETTINGS)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded"
          >
            恢复默认
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
} 