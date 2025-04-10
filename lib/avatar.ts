import { createHash } from 'crypto';

export interface AvatarPart {
  type: 'nose' | 'skintone' | 'mouth' | 'hair' | 'eyewear' | 'eyes' | 'brows' | 'accessory';
  count: number;
}

const PARTS: AvatarPart[] = [
  { type: 'nose', count: 68 },
  { type: 'skintone', count: 6 },
  { type: 'mouth', count: 105 },
  { type: 'hair', count: 349 },
  { type: 'eyewear', count: 26 },
  { type: 'eyes', count: 60 },
  { type: 'brows', count: 47 },
  { type: 'accessory', count: 15 },
];

function getNumberFromHash(hash: string, start: number, max: number): number {
  const slice = hash.slice(start * 2, (start * 2) + 4);
  const number = parseInt(slice, 16);
  return (number % max) + 1;
}

function shouldIncludePart(hash: string, index: number): boolean {
  const slice = hash.slice(index * 2, (index * 2) + 2);
  const number = parseInt(slice, 16);
  return number % 2 === 0; // 50% chance
}

export function generateAvatar(input: string) {
  const hash = createHash('sha256').update(input).digest('hex');
  const selectedParts: Record<string, number> = {};

  // Always include skintone and eyes
  selectedParts['skintone'] = getNumberFromHash(hash, 0, PARTS.find(p => p.type === 'skintone')!.count);
  selectedParts['eyes'] = getNumberFromHash(hash, 1, PARTS.find(p => p.type === 'eyes')!.count);

  PARTS.forEach((part, index) => {
    if (part.type !== 'skintone' && part.type !== 'eyes' && shouldIncludePart(hash, index + 8)) {
      selectedParts[part.type] = getNumberFromHash(hash, index + 2, part.count);
    }
  });

  return selectedParts;
}
