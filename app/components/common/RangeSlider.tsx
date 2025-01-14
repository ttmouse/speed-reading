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
      className="relative w-full h-6 flex items-center"
      onMouseDown={(e: React.MouseEvent) => {
        if (e.button === 0) {
          setIsDragging(true);
          handleDrag(e.nativeEvent);
        }
      }}
      onTouchStart={(e: React.TouchEvent) => {
        setIsDragging(true);
        handleDrag(e.nativeEvent);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="absolute w-full h-1 bg-gray-200 rounded-full overflow-hidden"
        style={{ 
          cursor: 'pointer',
          opacity: isDragging || isHovered ? 1 : 0.7,
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        <div
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div
        className={`absolute w-4 h-4 rounded-full bg-blue-500 shadow transform -translate-x-1/2 hover:scale-110 transition-transform ${
          isDragging ? 'scale-110' : ''
        }`}
        style={{
          left: `${progress}%`,
          cursor: 'pointer',
          opacity: isDragging || isHovered ? 1 : 0.7,
          transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out'
        }}
      />
    </div>
  );
} 