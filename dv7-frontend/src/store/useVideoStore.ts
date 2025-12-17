import { create } from 'zustand';
import type { Video, Transcript, Dubbing, RenderedVideo } from '../types';

interface VideoStore {
  // Current video being processed
  currentVideo: Video | null;
  currentTranscript: Transcript | null;
  currentDubbing: Dubbing | null;
  currentRendered: RenderedVideo | null;
  
  // Processing state
  isProcessing: boolean;
  processingStep: 'upload' | 'transcription' | 'dubbing' | 'rendering' | 'complete' | null;
  progress: number;
  
  // Actions
  setCurrentVideo: (video: Video | null) => void;
  setCurrentTranscript: (transcript: Transcript | null) => void;
  setCurrentDubbing: (dubbing: Dubbing | null) => void;
  setCurrentRendered: (rendered: RenderedVideo | null) => void;
  setProcessingStep: (step: VideoStore['processingStep']) => void;
  setProgress: (progress: number) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  resetStore: () => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  currentVideo: null,
  currentTranscript: null,
  currentDubbing: null,
  currentRendered: null,
  isProcessing: false,
  processingStep: null,
  progress: 0,
  
  setCurrentVideo: (video) => set({ currentVideo: video }),
  setCurrentTranscript: (transcript) => set({ currentTranscript: transcript }),
  setCurrentDubbing: (dubbing) => set({ currentDubbing: dubbing }),
  setCurrentRendered: (rendered) => set({ currentRendered: rendered }),
  setProcessingStep: (step) => set({ processingStep: step }),
  setProgress: (progress) => set({ progress }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  
  resetStore: () => set({
    currentVideo: null,
    currentTranscript: null,
    currentDubbing: null,
    currentRendered: null,
    isProcessing: false,
    processingStep: null,
    progress: 0,
  }),
}));
