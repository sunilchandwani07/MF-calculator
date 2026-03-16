import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({ min, max, step = 1, value, onChange, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate percentage for initial value
  const getPercentage = (val: number) => {
    const p = ((val - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, p));
  };
  
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    if (!isDragging) {
      setLocalValue(value);
    }
  }, [value, isDragging]);

  const updateValueFromPos = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const x = Math.max(0, Math.min(clientX - rect.left, width));
    
    const percentage = x / width;
    let newValue = min + percentage * (max - min);
    
    if (step) {
      newValue = Math.round(newValue / step) * step;
    }
    
    newValue = Math.max(min, Math.min(max, newValue));
    setLocalValue(newValue);
    onChange(newValue);
  };

  const percentage = getPercentage(localValue);

  return (
    <div 
      ref={containerRef}
      className={`relative h-6 flex items-center touch-none ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Track Background */}
      <div className="absolute w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
      
      {/* Active Track */}
      <div 
        className="absolute h-1.5 bg-brand-blue rounded-full transition-all duration-75" 
        style={{ width: `${percentage}%` }}
      />
      
      {/* Thumb */}
      <motion.div
        onPanStart={() => setIsDragging(true)}
        onPanEnd={() => setIsDragging(false)}
        onPan={(e, info) => updateValueFromPos(info.point.x)}
        className="absolute w-5 h-5 bg-white border-2 border-brand-blue rounded-full shadow-md z-10 cursor-grab active:cursor-grabbing"
        style={{ 
          left: `${percentage}%`,
          x: "-50%",
          top: "50%",
          y: "-50%"
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      />
    </div>
  );
};
