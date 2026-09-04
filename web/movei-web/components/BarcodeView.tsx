'use client';

import React, { useMemo } from 'react';

interface BarcodeViewProps {
  value: string;
  className?: string;
  showText?: boolean;
}

export default function BarcodeView({ value, className = '', showText = true }: BarcodeViewProps) {
  // Generate deterministic bar widths based on value string hash to mimic Code 128 pattern
  const bars = useMemo(() => {
    const clean = value.replace(/[^A-Za-z0-9-]/g, '');
    const pattern: number[] = [];
    
    // Guard pattern start
    pattern.push(2, 1, 1, 2, 3, 2);

    for (let i = 0; i < clean.length; i++) {
      const code = clean.charCodeAt(i);
      pattern.push((code % 3) + 1);
      pattern.push(((code * 3) % 2) + 1);
      pattern.push(((code * 7) % 4) + 1);
      pattern.push(((code * 2) % 3) + 1);
    }

    // Guard pattern end
    pattern.push(3, 1, 1, 1, 2, 3, 1);
    return pattern;
  }, [value]);

  const totalWidth = bars.reduce((acc, w) => acc + w, 0);

  let currentX = 0;

  return (
    <div className={`flex flex-col items-center bg-white p-3 rounded-lg ${className}`}>
      <svg
        viewBox={`0 0 ${totalWidth} 48`}
        className="w-full h-14"
        preserveAspectRatio="none"
      >
        {bars.map((width, idx) => {
          const isBar = idx % 2 === 0;
          const x = currentX;
          currentX += width;

          if (!isBar) return null;

          return (
            <rect
              key={idx}
              x={x}
              y={0}
              width={width}
              height={48}
              fill="#111827"
            />
          );
        })}
      </svg>
      
      {showText && (
        <span className="text-[11px] font-mono tracking-widest text-gray-700 font-bold mt-1">
          {value}
        </span>
      )}
    </div>
  );
}
