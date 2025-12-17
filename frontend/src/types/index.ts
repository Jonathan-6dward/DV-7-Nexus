// frontend/src/types/index.ts - Tipos utilizados na aplicação DV-7 Nexus

// Estados de processamento de vídeo
export type VideoStatus = 'pending' | 'processing' | 'completed' | 'error' | 'cancelled';
export type TranscriptStatus = 'pending' | 'processing' | 'completed' | 'error';
export type DubbingStatus = 'pending' | 'processing' | 'completed' | 'error' | 'cancelled';
export type RenderStatus = 'pending' | 'processing' | 'completed' | 'error' | 'cancelled';
export type RenderType = 'dubbing' | 'subtitles' | 'both';

// Plataformas suportadas
export const SUPPORTED_PLATFORMS = [
  'youtube',
  'tiktok',
  'instagram',
  'facebook',
  'twitter',
  'x',
  'vimeo',
  'reddit',
  'twitch',
  'dailymotion'
] as const;

export type SupportedPlatform = typeof SUPPORTED_PLATFORMS[number];

// Tipos de entidade principais
export interface Video {
  id: number;
  userId: number;
  url: string;
  title?: string;
  duration?: number;
  filePath: string;
  status: VideoStatus;
  sourcePlatform?: SupportedPlatform;
  language?: string;
  fileSize?: number;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transcript {
  id: number;
  videoId: number;
  language: string;
  content: string;
  segments?: TranscriptSegment[];
  status: TranscriptStatus;
  processingTime?: number;
  createdAt: Date;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface Dubbing {
  id: number;
  videoId: number;
  transcriptId: number;
  targetLanguage: string;
  voiceProfile?: string;
  outputUrl?: string;
  outputFilePath?: string;
  status: DubbingStatus;
  processingTime?: number;
  voiceParams?: Record<string, unknown>;
  createdAt: Date;
}

export interface RenderedVideo {
  id: number;
  videoId: number;
  dubbingId?: number;
  targetLanguage?: string;
  outputUrl?: string;
  outputFilePath?: string;
  renderType: RenderType;
  status: RenderStatus;
  processingTime?: number;
  fileSize?: number;
  duration?: number;
  createdAt: Date;
}

// Tipos de usuário e autenticação
export interface User {
  id: number;
  openId: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt: Date;
  lastSignedIn: Date;
}

// Tipos de entrada para mutações
export interface VideoSubmitInput {
  url: string;
  targetLanguage: string;
  voiceProfile?: string;
}

export interface TranscriptCreateInput {
  videoId: number;
  language: string;
}

export interface DubbingCreateInput {
  videoId: number;
  targetLanguage: string;
  voiceProfile: string;
}

// Tipos de entrada para formulários
export interface VideoCaptureInput {
  url: string;
  targetLanguage: string;
  voiceProfile: string;
}

// Tipos de tarefas e comentários
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: number;
  taskId: number;
  content: string;
  createdAt: Date;
}