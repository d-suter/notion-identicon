'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AvatarDisplay } from '@/components/ui/avatar-display';
import { generateAvatar } from '@/lib/avatar';
import { Download, RefreshCw, Copy } from 'lucide-react';

export default function Home() {
  const [input, setInput] = useState('');
  const [avatar, setAvatar] = useState(generateAvatar(''));

  // Debounce avatar generation
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAvatar(generateAvatar(input));
    }, 100);

    return () => clearTimeout(timeout);
  }, [input]);

  const generateRandom = () => {
    const randomString = Math.random().toString(36).substring(7);
    setInput(randomString);
  };

  const downloadImage = async () => {
    try {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/api/avatar?text=${encodeURIComponent(input)}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error('Failed to fetch avatar image');

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `avatar-${input || 'default'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
      alert('Image download failed.');
    }
  };

  const handleCopy = useCallback(() => {
    const apiUrl = `${window.location.origin}/api/avatar?text=${encodeURIComponent(input)}`;
    navigator.clipboard.writeText(apiUrl);
  }, [input]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2">Avatar Generator</h1>
          <p className="text-muted-foreground text-center mb-8">
            Generate unique avatars from any text input
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 flex flex-col gap-6">
              <div className="space-y-2">
                <Label htmlFor="input">Input Text</Label>
                <div className="flex gap-2">
                  <Input
                    id="input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text to generate avatar"
                  />
                  <Button variant="outline" size="icon" onClick={generateRandom} title="Generate random input">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {typeof window !== 'undefined' && (
                <div className="text-sm mt-4 space-y-1">
                  <p className="font-medium">API Endpoint:</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded break-all text-xs">
                      {`${window.location.origin}/api/avatar?text=${encodeURIComponent(input)}`}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopy}
                      title="Copy API URL"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Use this endpoint to generate avatars programmatically.
                  </p>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex flex-col gap-4">
                <div className="aspect-square bg-white rounded-lg overflow-hidden flex items-center justify-center p-4">
                  <AvatarDisplay parts={avatar} className="w-full h-full" />
                </div>

                <Button onClick={downloadImage} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download PNG
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
