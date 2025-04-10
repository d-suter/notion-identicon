'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface AvatarDisplayProps {
  parts: Record<string, number>;
  size?: number;
  className?: string;
}

export function AvatarDisplay({ parts, size = 420, className }: AvatarDisplayProps) {
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  // Sort parts to ensure correct layering
  const layerOrder = ['skintone', 'nose', 'mouth', 'eyes', 'brows', 'eyewear', 'hair', 'accessory'];
  const sortedParts = Object.entries(parts)
    .sort(([a], [b]) => layerOrder.indexOf(a) - layerOrder.indexOf(b));

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {sortedParts.map(([type, number]) => (
        <Image
          key={type}
          src={`/images/${type}/${number}.png`}
          alt={type}
          width={size}
          height={size}
          className={`absolute top-0 left-0 transition-opacity duration-200 ${
            loaded[type] ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setLoaded(prev => ({ ...prev, [type]: true }))}
          style={{ objectFit: 'contain' }}
        />
      ))}
    </div>
  );
}