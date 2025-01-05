import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;  // 0 到 1 之间的值
  onProgressChange: (progress: number) => void;
  isPaused: boolean;
}

export function ProgressBar({ progress, onProgressChange, isPaused }: ProgressBarProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const progressBarRef = React.useRef<HTMLDivElement>(null);

  // 确保进度值在有效范围内
  const clampedProgress = Math.min(0.999, Math.max(0, progress));

  const handleDrag = (event: MouseEvent | TouchEvent) => {
    if (!progressBarRef.current || !isDragging || !isPaused) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const relativeX = x - rect.left;
    const newProgress = Math.max(0, Math.min(0.999, relativeX / rect.width));
    onProgressChange(newProgress);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDrag(e);
    const handleTouchMove = (e: TouchEvent) => handleDrag(e);
    const handleEnd = () => setIsDragging(false);

    if (isDragging && isPaused) {
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
  }, [isDragging, isPaused]);

  return (
    <div 
      ref={progressBarRef}
      className="w-full h-8 flex items-center cursor-pointer relative mb-4"
      onMouseDown={(e) => {
        if (!isPaused) return;
        setIsDragging(true);
        handleDrag(e.nativeEvent);
      }}
      onTouchStart={(e) => {
        if (!isPaused) return;
        setIsDragging(true);
        handleDrag(e.nativeEvent);
      }}
    >
      <div className="w-full h-[1px] bg-gray-200 rounded-full">
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 h-[1px] bg-gray-600"
          style={{ width: `${clampedProgress * 100}%` }}
        />
      </div>
      <div 
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
        style={{ 
          left: `${clampedProgress * 100}%`,
          cursor: isPaused ? 'grab' : 'default'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={`w-3.5 h-3.5 rounded-full border ${
            isPaused 
              ? `bg-white border-gray-600 ${isHovered ? 'shadow-md scale-110' : ''}` 
              : 'bg-gray-600 border-gray-600'
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