import React from 'react';

interface TextInputProps {
  text: string;
  onTextChange: (text: string) => void;
}

export function TextInput({ text, onTextChange }: TextInputProps) {
  return (
    <div className="mt-8">
      <textarea
        id="text-input"
        value={text}
        onChange={(e): void => onTextChange(e.target.value)}
        placeholder="在此粘贴要阅读的文本..."
        className="w-full h-32 p-4 border rounded"
      />
    </div>
  );
} 