import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoUploader } from '../components/VideoUploader';
import { LanguageSelector } from '../components/LanguageSelector';
import { VoiceProfileSelector } from '../components/VoiceProfileSelector';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useVideoStore } from '../../store/useVideoStore';
import { trpc } from '../../lib/trpc';
import { toast } from 'sonner';

export function StartProject() {
  const navigate = useNavigate();
  const {
    setCurrentVideo,
    setProcessingStep,
    setIsProcessing,
    setProgress,
  } = useVideoStore();

  const [videoUrl, setVideoUrl] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('en-US');
  const [voiceProfile, setVoiceProfile] = useState('professional-male');

  // tRPC mutation para submeter vídeo
  const submitVideoMutation = trpc.videos.submit.useMutation({
    onSuccess: (video) => {
      setCurrentVideo(video);
      setProcessingStep('upload');
      setIsProcessing(true);
      setProgress(10);

      toast.success('Vídeo enviado para processamento com sucesso!');

      // Continuar para próxima etapa após confirmação do backend
      setTimeout(() => {
        setProcessingStep('transcription');
        setProgress(25);
        navigate('/transcription-review');
      }, 2000);
    },
    onError: (error) => {
      toast.error(`Erro ao enviar vídeo: ${error.message}`);
      console.error('Erro de envio:', error);
    }
  });

  const handleUrlSubmit = (url: string) => {
    setVideoUrl(url);
  };

  const handleSubmit = async () => {
    if (!videoUrl) {
      toast.error('Por favor, insira uma URL de vídeo');
      return;
    }

    // Validar formato de idioma
    if (!targetLanguage.match(/^[a-z]{2}(-[A-Z]{2})?$/)) {
      toast.error('Formato de idioma inválido');
      return;
    }

    // Enviar para o backend via tRPC
    submitVideoMutation.mutate({
      url: videoUrl,
      targetLanguage,
      voiceProfile
    });
  };

  // Determinar estado de carregamento
  const isLoading = submitVideoMutation.isPending;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl tracking-tight">
            DV-7 Nexus
          </h1>
          <p className="text-xl text-muted-foreground">
            Droide de Dublagem e Vocalização
          </p>
        </div>

        <VideoUploader
          onUrlSubmit={handleUrlSubmit}
          isLoading={isLoading}
          currentValue={videoUrl}
        />

        <Card className="p-6 space-y-4">
          <h2 className="text-xl">Configurações de Processamento</h2>

          <LanguageSelector
            value={targetLanguage}
            onChange={setTargetLanguage}
            disabled={isLoading}
          />

          <VoiceProfileSelector
            value={voiceProfile}
            onChange={setVoiceProfile}
            disabled={isLoading}
          />

          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !videoUrl}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Processando...
                </span>
              ) : (
                '⚡ Iniciar Processamento'
              )}
            </Button>
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>✓ Captura de múltiplas plataformas</p>
          <p>✓ Transcrição automática com IA</p>
          <p>✓ Dublagem neural em 9+ idiomas</p>
        </div>
      </div>
    </div>
  );
}
