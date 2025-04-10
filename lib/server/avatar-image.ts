import { createCanvas, loadImage } from 'canvas';
import path from 'path';
import { access } from 'fs/promises';
import { generateAvatar } from '../avatar';

/**
 * Combines multiple avatar part layers into a single PNG image
 */
export async function generatePngAvatar(text: string, size: number): Promise<Buffer> {
  const parts = generateAvatar(text);
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  const basePath = path.resolve(process.cwd(), 'public/images');

  for (const [part, index] of Object.entries(parts)) {
    const filePath = path.join(basePath, part, `${index}.png`);
    try {
      await access(filePath);
      const image = await loadImage(filePath);
      ctx.drawImage(image, 0, 0, size, size);
    } catch (err) {
      console.warn(`⚠️ Missing or failed to load part: ${filePath}`);
    }
  }

  return canvas.toBuffer('image/png');
}