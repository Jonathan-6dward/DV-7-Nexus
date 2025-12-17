import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { Progress } from './ui/progress';
import { Card } from './ui/card';

interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface ProgressTrackerProps {
  currentStep: 'upload' | 'transcription' | 'dubbing' | 'rendering' | 'complete' | null;
  progress: number;
  onCancel?: () => void;
}

export function ProgressTracker({
  currentStep,
  progress,
  onCancel,
}: ProgressTrackerProps) {
  const steps: ProgressStep[] = [
    {
      id: 'upload',
      label: 'Captura de Vídeo',
      status: getStepStatus('upload', currentStep),
    },
    {
      id: 'transcription',
      label: 'Transcrição',
      status: getStepStatus('transcription', currentStep),
    },
    {
      id: 'dubbing',
      label: 'Dublagem Neural',
      status: getStepStatus('dubbing', currentStep),
    },
    {
      id: 'rendering',
      label: 'Renderização',
      status: getStepStatus('rendering', currentStep),
    },
  ];

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {step.status === 'completed' && (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              )}
              {step.status === 'processing' && (
                <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
              )}
              {step.status === 'pending' && (
                <Circle className="w-6 h-6 text-muted-foreground" />
              )}
              {step.status === 'error' && (
                <Circle className="w-6 h-6 text-red-500" />
              )}
            </div>
            <div className="flex-1">
              <p
                className={`font-medium ${
                  step.status === 'processing'
                    ? 'text-purple-500'
                    : step.status === 'completed'
                    ? 'text-green-500'
                    : step.status === 'error'
                    ? 'text-red-500'
                    : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progresso</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {currentStep && currentStep !== 'complete' && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Tempo estimado restante: {Math.ceil((100 - progress) / 10)} min
          </p>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              Cancelar Processamento
            </button>
          )}
        </div>
      )}
    </Card>
  );
}

function getStepStatus(
  stepId: string,
  currentStep: string | null
): ProgressStep['status'] {
  const stepOrder = ['upload', 'transcription', 'dubbing', 'rendering', 'complete'];
  const currentIndex = currentStep ? stepOrder.indexOf(currentStep) : -1;
  const stepIndex = stepOrder.indexOf(stepId);

  if (currentIndex === -1) return 'pending';
  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'processing';
  return 'pending';
}
