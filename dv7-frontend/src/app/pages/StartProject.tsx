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

  // Use tRPC mutation for video submission
  const submitVideoMutation = trpc.videos.submit.useMutation({
    onSuccess: (data) => {
      // @ts-ignore - data structure from backend
      setCurrentVideo(data);
      setProcessingStep('upload');
      setIsProcessing(true);
      setProgress(10);

      toast.success('Vídeo capturado com sucesso!');

      // Simular progresso
      setTimeout(() => {
        setProcessingStep('transcription');
        setProgress(25);
        navigate('/transcription-review');
      }, 2000);
    },
    onError: (error) => {
      toast.error('Erro ao capturar vídeo: ' + error.message);
      console.error(error);
    },
  });

  const handleUrlSubmit = (url: string) => {
    setVideoUrl(url);
  };

  const handleSubmit = async () => {
    if (!videoUrl) {
      toast.error('Por favor, insira uma URL de vídeo');
      return;
    }

    submitVideoMutation.mutate({
      url: videoUrl,
      targetLanguage,
      voiceProfile,
    });
  };

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

        <VideoUploader onUrlSubmit={handleUrlSubmit} isLoading={submitVideoMutation.isPending} />

        <Card className="p-6 space-y-4">
          <h2 className="text-xl">Configurações de Processamento</h2>

          <LanguageSelector
            value={targetLanguage}
            onChange={setTargetLanguage}
            disabled={submitVideoMutation.isPending}
          />

          <VoiceProfileSelector
            value={voiceProfile}
            onChange={setVoiceProfile}
            disabled={submitVideoMutation.isPending}
          />

          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={submitVideoMutation.isPending || !videoUrl}
              className="w-full"
              size="lg"
            >
              {submitVideoMutation.isPending ? 'Processando...' : '⚡ Iniciar Processamento'}
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
