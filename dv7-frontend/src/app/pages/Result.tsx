import { useNavigate } from 'react-router-dom';
import { Download, FileAudio, FileText, Subtitles, Play, Pause, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useVideoStore } from '../../store/useVideoStore';
import { toast } from 'sonner';

export function Result() {
  const navigate = useNavigate();
  const {
    currentVideo,
    currentRendered,
    resetStore,
  } = useVideoStore();

  const [isPlaying, setIsPlaying] = useState(false);

  const handleDownload = (type: string) => {
    toast.success(`Baixando ${type}...`);
    // Em produção, isso iniciaria um download real
  };

  const handleNewMission = () => {
    resetStore();
    navigate('/');
    toast.success('Pronto para nova missão!');
  };

  if (!currentVideo || !currentRendered) {
    navigate('/');
    return null;
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <span className="text-3xl">✓</span>
            </div>
          </div>
          <h1 className="text-3xl">Missão Concluída!</h1>
          <p className="text-muted-foreground">
            Seu vídeo foi dublado com sucesso
          </p>
        </div>

        <Card className="p-6 space-y-6">
          <h2 className="text-2xl">Resultado Final</h2>

          {/* Video Player */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            <img
              src={currentVideo.thumbnailUrl || 'https://picsum.photos/800/450'}
              alt="Video result"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full w-20 h-20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-10 h-10" />
                ) : (
                  <Play className="w-10 h-10 ml-1" />
                )}
              </Button>
            </div>
            <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-full text-white text-sm">
              {currentRendered.targetLanguage}
            </div>
          </div>

          {/* Main Download Button */}
          <Button
            size="lg"
            className="w-full"
            onClick={() => handleDownload('Vídeo Dublado')}
          >
            <Download className="w-5 h-5 mr-2" />
            ⬇ Exportar Vídeo Dublado
          </Button>
        </Card>

        {/* Additional Exports */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg">Exportações Adicionais</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleDownload('Áudio Isolado')}
            >
              <FileAudio className="w-4 h-4 mr-2" />
              Áudio isolado
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleDownload('Transcrição (TXT)')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Transcrição (TXT)
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleDownload('Legendas (SRT)')}
            >
              <Subtitles className="w-4 h-4 mr-2" />
              Legendas (SRT)
            </Button>
          </div>
        </Card>

        {/* Statistics */}
        <Card className="p-6">
          <h3 className="text-lg mb-4">Estatísticas do Processamento</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Tempo Total</p>
              <p>{currentRendered.processingTime}s</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tamanho Final</p>
              <p>{(currentRendered.fileSize! / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div>
              <p className="text-muted-foreground">Idioma Original</p>
              <p>{currentVideo.language || 'pt-BR'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Idioma Final</p>
              <p>{currentRendered.targetLanguage}</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/transcription-review')}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Gerar Versão Alternativa
          </Button>

          <Button
            size="lg"
            variant="default"
            onClick={handleNewMission}
          >
            Nova Missão
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>✨ Processado com DV-7 Nexus</p>
          <p>Tecnologia de dublagem neural de última geração</p>
        </div>
      </div>
    </div>
  );
}
