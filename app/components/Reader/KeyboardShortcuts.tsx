import React from 'react';

export function KeyboardShortcuts() {
  return (
    <div className="keyboard-shortcuts mt-8 p-4 bg-gray-50 rounded text-sm text-center">
      快捷键：
      <kbd className="mx-1 px-2 py-1 bg-white border rounded shadow-sm">N</kbd> 新文本
      <kbd className="mx-1 px-2 py-1 bg-white border rounded shadow-sm">空格</kbd> 播放/暂停
      <kbd className="mx-1 px-2 py-1 bg-white border rounded shadow-sm">R</kbd> 重新开始
      <kbd className="mx-1 px-2 py-1 bg-white border rounded shadow-sm">↑</kbd> 加速
      <kbd className="mx-1 px-2 py-1 bg-white border rounded shadow-sm">↓</kbd> 减速
      <kbd className="mx-1 px-2 py-1 bg-white border rounded shadow-sm">←</kbd> 减少字数
      <kbd className="mx-1 px-2 py-1 bg-white border rounded shadow-sm">→</kbd> 增加字数
      <kbd className="mx-1 px-2 py-1 bg-white border rounded shadow-sm">S</kbd> 设置
    </div>
  );
} 