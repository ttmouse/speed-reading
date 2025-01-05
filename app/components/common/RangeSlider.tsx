'use client';

import React from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}

export function RangeSlider({ min, max, step = 1, value, onChange }: RangeSliderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  // 计算进度百分比
  const progress = ((value - min) / (max - min)) * 100;

  const handleDrag = (event: MouseEvent | TouchEvent) => {
    if (!sliderRef.current || !isDragging) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const relativeX = Math.max(0, Math.min(x - rect.left, rect.width));
    const percentage = relativeX / rect.width;
    const newValue = Math.round((min + (max - min) * percentage) / step) * step;
    onChange(Math.max(min, Math.min(max, newValue)));
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDrag(e);
    const handleTouchMove = (e: TouchEvent) => handleDrag(e);
    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div 
      ref={sliderRef}
      className="w-full h-8 flex items-center cursor-pointer relative"
      onMouseDown={(e) => {
        setIsDragging(true);
        handleDrag(e.nativeEvent);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleDrag(e.nativeEvent);
      }}
    >
      <div className="w-full h-[1px] bg-gray-200 rounded-full">
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 h-[1px] bg-gray-600"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div 
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
        style={{ left: `${progress}%` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={`w-3.5 h-3.5 rounded-full border bg-white border-gray-600 ${
            isHovered ? 'shadow-md scale-110' : ''
          }`}
          style={{
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.2s'
          }}
        />
      </div>
    </div>
  );
} 