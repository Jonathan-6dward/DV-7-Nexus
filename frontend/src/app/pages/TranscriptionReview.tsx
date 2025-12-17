import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Edit2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { LanguageSelector } from '../components/LanguageSelector';
import { VoiceProfileSelector } from '../components/VoiceProfileSelector';
import { useVideoStore } from '../../store/useVideoStore';
// Removido mockUtils - não existe mais
import { toast } from 'sonner';

export function TranscriptionReview() {
  const navigate = useNavigate();
  const {
    currentVideo,
    setCurrentTranscript,
    setProcessingStep,
    setProgress,
  } = useVideoStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en-US');
  const [voiceProfile, setVoiceProfile] = useState('professional-male');
  const [transcript, setTranscript] = useState('');
  const [segments, setSegments] = useState([
    { start: 0, end: 5, text: 'Olá, bem-vindo ao nosso vídeo' },
    { start: 5, end: 10, text: 'Hoje vamos falar sobre tecnologia' },
    { start: 10, end: 15, text: 'E suas aplicações no dia a dia' },
  ]);

  useEffect(() => {
    if (!currentVideo) {
      navigate('/');
      return;
    }

    // Carregar transcrição mock (implementação direta)
    const mockTranscript = {
      id: currentVideo.id,
      videoId: currentVideo.id,
      language: 'pt-BR',
      content: 'Esta é uma transcrição de exemplo do vídeo...',
      segments: [
        { start: 0, end: 5, text: 'Olá, bem-vindo ao nosso vídeo' },
        { start: 5, end: 10, text: 'Hoje vamos falar sobre tecnologia' },
        { start: 10, end: 15, text: 'E suas aplicações no dia a dia' },
      ],
      status: 'completed',
      processingTime: 45,
      createdAt: new Date(),
    };

    setCurrentTranscript(mockTranscript);
    setTranscript(mockTranscript.content);
  }, [currentVideo, navigate, setCurrentTranscript]);

  const handleSegmentEdit = (index: number, newText: string) => {
    const newSegments = [...segments];
    newSegments[index].text = newText;
    setSegments(newSegments);
  };

  const handleProcessDubbing = async () => {
    setProcessingStep('dubbing');
    setProgress(50);
    toast.success('Iniciando processo de dublagem...');

    setTimeout(() => {
      navigate('/processing');
    }, 1000);
  };

  if (!currentVideo) {
    return null;
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl">Revisão de Transcrição</h1>
          <p className="text-muted-foreground">
            Revise e edite a transcrição antes de processar a dublagem
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Player */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl">Player de Vídeo</h2>

            <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
              <img
                src={currentVideo.thumbnailUrl || 'https://picsum.photos/800/450'}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full w-16 h-16"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm">
                <strong>Título:</strong> {currentVideo.title}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Plataforma:</strong> {currentVideo.sourcePlatform}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Duração:</strong> {currentVideo.duration}s
              </p>
            </div>
          </Card>

          {/* Transcript Editor */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl">Transcrição</h2>
              <Edit2 className="w-5 h-5 text-muted-foreground" />
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {segments.map((segment, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg space-y-2 hover:border-purple-500 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{segment.start}s</span>
                    <span>-</span>
                    <span>{segment.end}s</span>
                  </div>
                  <Textarea
                    value={segment.text}
                    onChange={(e) => handleSegmentEdit(index, e.target.value)}
                    className="min-h-[60px] resize-none"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl">Configurações de Dublagem</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LanguageSelector
              value={targetLanguage}
              onChange={setTargetLanguage}
              label="Idioma de Destino da Dublagem"
            />

            <VoiceProfileSelector
              value={voiceProfile}
              onChange={setVoiceProfile}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              Voltar
            </Button>
            <Button onClick={handleProcessDubbing} size="lg">
              Processar Dublagem →
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
