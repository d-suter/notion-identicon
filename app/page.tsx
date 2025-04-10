'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AvatarDisplay } from '@/components/ui/avatar-display';
import { generateAvatar } from '@/lib/avatar';
import { Download, RefreshCw, Copy, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const [input, setInput] = useState('');
  const [hasMounted, setHasMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  const avatar = generateAvatar(input);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
      link.download = `avatar-${input}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopy = () => {
    if (!hasMounted) return;
    const url = `${window.location.origin}/api/avatar?text=${encodeURIComponent(input)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const avatarUrl = hasMounted
    ? `${window.location.origin}/api/avatar?text=${encodeURIComponent(input)}`
    : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-extrabold text-center mb-3 tracking-tight">Notion Avatar Generator</h1>
          <p className="text-muted-foreground text-center mb-10 text-lg">
            Generate unique avatars from any text input instantly.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Panel */}
            <Card className="p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="input" className="font-semibold">Input Text</Label>
                  <div className="flex gap-2">
                    <Input
                      id="input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter any text..."
                      className="text-sm"
                    />
                    <Button variant="outline" size="icon" onClick={generateRandom}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {hasMounted && (
                  <div className="space-y-4 text-sm">
                    <p className="font-semibold">Open API in Browser</p>
                    <code className="block bg-muted px-3 py-2 rounded text-sm break-all">
                      {avatarUrl}
                    </code>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => window.open(avatarUrl, '_blank')}
                        variant="secondary"
                        className="flex-1"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open URL
                      </Button>

                      <Button
                        onClick={handleCopy}
                        variant="secondary"
                        className={cn(
                          'flex-1 transition-all duration-200',
                          copied && 'bg-black text-white'
                        )}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        {copied ? 'Copied!' : 'Copy Link'}
                      </Button>
                    </div>

                    {/* Code Examples */}
                    <div className="pt-6 space-y-4">
                      <div>
                        <p className="font-semibold mb-1">Python:</p>
                        <pre className="bg-muted px-3 py-2 rounded text-xs overflow-auto">
<span className="text-pink-600">import</span> requests{'\n'}
r = requests.get("<span className='text-blue-600'>{avatarUrl}</span>") {'\n'}
<span className="text-pink-600">with</span> open("avatar.png", <span className="text-green-600">"wb"</span>) <span className="text-pink-600">as</span> f:{'\n'}
&nbsp;&nbsp;&nbsp;&nbsp;f.write(r.content)
                        </pre>
                      </div>

                      <div>
                        <p className="font-semibold mb-1">JavaScript:</p>
                        <pre className="bg-muted px-3 py-2 rounded text-xs overflow-auto">
<span className="text-purple-600">fetch</span>(<span className="text-green-600">"{avatarUrl}"</span>)
  .then(res =&gt; res.blob())
  .then(blob =&gt; {'{'}
    <span className="text-blue-600">const</span> url = URL.createObjectURL(blob);{'\n'}
    <span className="text-blue-600">const</span> a = document.createElement(<span className="text-green-600">"a"</span>);{'\n'}
    a.href = url;{'\n'}
    a.download = <span className="text-green-600">"avatar.png"</span>;{'\n'}
    a.click();{'\n'}
  {'}'});
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Right Panel */}
            <Card className="p-6">
              <div className="flex flex-col gap-4">
                <div className="aspect-square bg-white rounded-lg overflow-hidden flex items-center justify-center p-4">
                  <AvatarDisplay
                    parts={avatar}
                    className="w-full h-full"
                  />
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