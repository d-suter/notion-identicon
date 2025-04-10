'use client';

import { useEffect, useMemo } from 'react';
import { generateHash, generateMatrix, generateSvgPath, generateColor, type IdenticonOptions } from '@/lib/identicon';

interface IdenticonProps extends IdenticonOptions {
  input: string;
  className?: string;
}

export function Identicon({
  input,
  size = 420,
  hashFunction = 'md5',
  style = 'geometric',
  backgroundColor = 'transparent',
  className,
}: IdenticonProps) {
  const hash = useMemo(() => generateHash(input, hashFunction), [input, hashFunction]);
  const matrix = useMemo(() => generateMatrix(hash), [hash]);
  const color = useMemo(() => generateColor(hash), [hash]);
  const cellSize = size / 5;
  const path = useMemo(() => generateSvgPath(matrix, cellSize, style), [matrix, cellSize, style]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{
        backgroundColor,
      }}
    >
      <path d={path} fill={color} />
    </svg>
  );
}