import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { ProgressTracker } from '../components/ProgressTracker';
import { Card } from '../components/ui/card';
import { useVideoStore } from '../../store/useVideoStore';
import { toast } from 'sonner';

export function Processing() {
  const navigate = useNavigate();
  const {
    currentVideo,
    processingStep,
    progress,
    setProcessingStep,
    setProgress,
    setCurrentDubbing,
    setCurrentRendered,
  } = useVideoStore();

  useEffect(() => {
    if (!currentVideo) {
      navigate('/');
      return;
    }

    // Simular progresso automático
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 1000);

    // Simular mudanças de etapa
    const stepsInterval = setInterval(() => {
      setProcessingStep((current) => {
        if (current === 'dubbing') {
          setProgress(75);
          return 'rendering';
        }
        if (current === 'rendering') {
          setProgress(95);
          return 'complete';
        }
        return current;
      });
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepsInterval);
    };
  }, [currentVideo, navigate, setProcessingStep, setProgress]);

  useEffect(() => {
    if (processingStep === 'complete' && progress >= 100) {
      // Gerar dados mock para dublagem e renderização (temporário)
      if (currentVideo) {
        const mockDubbing = {
          id: currentVideo.id,
          videoId: currentVideo.id,
          transcriptId: currentVideo.id,
          targetLanguage: 'en-US',
          voiceProfile: 'professional-male',
          outputUrl: `/output/dubbed-${currentVideo.id}.mp3`,
          outputFilePath: `/dubbed/video-${currentVideo.id}.mp3`,
          status: 'completed' as const,
          processingTime: 120,
          voiceParams: { pitch: 1.0, speed: 1.0 },
          createdAt: new Date(),
        };
        setCurrentDubbing(mockDubbing);

        setCurrentRendered({
          id: currentVideo.id,
          videoId: currentVideo.id,
          dubbingId: mockDubbing.id,
          targetLanguage: 'en-US',
          outputUrl: `/output/final-${currentVideo.id}.mp4`,
          outputFilePath: `/final/video-${currentVideo.id}.mp4`,
          renderType: 'dubbing',
          status: 'completed',
          processingTime: 180,
          fileSize: 25000000,
          duration: currentVideo.duration,
          createdAt: new Date(),
        });
      }

      toast.success('Processamento concluído!');
      setTimeout(() => {
        navigate('/result');
      }, 1500);
    }
  }, [processingStep, progress, currentVideo, navigate, setCurrentDubbing, setCurrentRendered]);

  const handleCancel = () => {
    toast.error('Processamento cancelado');
    navigate('/');
  };

  if (!currentVideo) {
    return null;
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Sparkles className="w-12 h-12 text-purple-500 animate-pulse" />
          </div>
          <h1 className="text-3xl">Processando Vídeo</h1>
          <p className="text-muted-foreground">
            DV-7 Nexus está trabalhando na sua dublagem neural
          </p>
        </div>

        <ProgressTracker
          currentStep={processingStep}
          progress={progress}
          onCancel={handleCancel}
        />

        <Card className="p-6 space-y-4">
          <h2 className="text-lg">Informações do Vídeo</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Título</p>
              <p>{currentVideo.title}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Plataforma</p>
              <p>{currentVideo.sourcePlatform}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Duração</p>
              <p>{currentVideo.duration}s</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="text-purple-500">Processando</p>
            </div>
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>⚙️ Usando modelos de IA de última geração</p>
          <p>🎙️ Dublagem neural de alta qualidade</p>
          <p>🎬 Sincronização labial automatizada</p>
        </div>
      </div>
    </div>
  );
}
