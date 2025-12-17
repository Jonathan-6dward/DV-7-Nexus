import { useState } from 'react';
import { Upload, Link as LinkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { SUPPORTED_PLATFORMS } from '../../types';

interface VideoUploaderProps {
  onUrlSubmit: (url: string) => void;
  isLoading?: boolean;
}

export function VideoUploader({ onUrlSubmit, isLoading }: VideoUploaderProps) {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError('');

    if (!url.trim()) {
      setUrlError('Por favor, insira uma URL');
      return;
    }

    if (!validateUrl(url)) {
      setUrlError('URL inválida');
      return;
    }

    onUrlSubmit(url);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="video-url" className="flex items-center gap-2">
          <LinkIcon className="w-4 h-4" />
          URL do Vídeo
        </Label>
        <Input
          id="video-url"
          placeholder="https://youtube.com/watch?v=..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (urlError) setUrlError('');
          }}
          disabled={isLoading}
          className={urlError ? 'border-red-500' : ''}
        />
        {urlError && (
          <p className="text-sm text-red-500">{urlError}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">
          Plataformas Suportadas
        </Label>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_PLATFORMS.map((platform) => (
            <span
              key={platform}
              className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
            >
              {platform}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg border-muted-foreground/25 bg-muted/10">
          <div className="text-center space-y-2">
            <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Ou arraste um arquivo de vídeo aqui
            </p>
            <p className="text-xs text-muted-foreground">
              MP4, MOV, AVI (máx. 500MB)
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isLoading || !url.trim()}
        className="w-full"
        size="lg"
      >
        {isLoading ? 'Processando...' : '⚡ Iniciar Captura'}
      </Button>
    </Card>
  );
}
