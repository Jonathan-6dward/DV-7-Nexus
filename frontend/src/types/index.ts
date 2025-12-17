// Status Types
export type VideoStatus = 'pending' | 'processing' | 'completed' | 'error' | 'cancelled';
export type TranscriptStatus = 'pending' | 'processing' | 'completed' | 'error';
export type DubbingStatus = 'pending' | 'processing' | 'completed' | 'error' | 'cancelled';
export type RenderStatus = 'pending' | 'processing' | 'completed' | 'error' | 'cancelled';
export type RenderType = 'dubbing' | 'subtitles' | 'both';

// Video Types
export interface Video {
  id: number;
  userId: number;
  url: string;
  title?: string;
  duration?: number;
  filePath: string;
  status: VideoStatus;
  sourcePlatform?: string;
  language?: string;
  fileSize?: number;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Transcript Types
export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
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

// Dubbing Types
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

// Rendered Video Types
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

// Task Types
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Comment Types
export interface Comment {
  id: number;
  taskId: number;
  content: string;
  createdAt: Date;
}

// User Types
export interface User {
  id: number;
  openId: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

// Form Input Types
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

// Supported Platforms
export const SUPPORTED_PLATFORMS = [
  'YouTube',
  'TikTok',
  'Instagram',
  'Twitter',
  'Facebook',
  'Vimeo',
] as const;

// Languages
export const LANGUAGES = [
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'en-US', name: 'English (US)' },
  { code: 'es-ES', name: 'Español' },
  { code: 'fr-FR', name: 'Français' },
  { code: 'de-DE', name: 'Deutsch' },
  { code: 'it-IT', name: 'Italiano' },
  { code: 'ja-JP', name: '日本語' },
  { code: 'ko-KR', name: '한국어' },
  { code: 'zh-CN', name: '中文 (简体)' },
] as const;

// Voice Profiles
export const VOICE_PROFILES = [
  { id: 'professional-male', name: 'Profissional Masculino' },
  { id: 'professional-female', name: 'Profissional Feminino' },
  { id: 'casual-male', name: 'Casual Masculino' },
  { id: 'casual-female', name: 'Casual Feminino' },
  { id: 'energetic', name: 'Energético' },
  { id: 'calm', name: 'Calmo' },
  { id: 'narrative', name: 'Narrativo' },
] as const;
