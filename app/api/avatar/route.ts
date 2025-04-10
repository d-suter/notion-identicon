import { NextRequest } from 'next/server';
import { generatePngAvatar } from '@/lib/server/avatar-image';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text') || 'default';

  try {
    const pngBuffer = await generatePngAvatar(text, 420); // Fixed size

    return new Response(pngBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="avatar-${text}.png"`,
      },
    });
  } catch (error) {
    console.error('Error generating avatar:', error);
    return new Response('Failed to generate avatar', { status: 500 });
  }
}