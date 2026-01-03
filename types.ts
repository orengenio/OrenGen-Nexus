export interface ServiceItem {
  id: string;
  name: string;
  version: string;
  port: number;
  description: string;
  status: 'Running' | 'Stopped' | 'Deploying' | 'Error';
  icon: string; // URL or Lucide icon name placeholder
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  status: 'Active' | 'Lead' | 'Churned' | 'Risk';
  lastInteraction: string;
  history: { date: string; type: string; note: string }[];
  value: string;
  leadScore?: number; // 0-100
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  FOSS_REGISTRY = 'FOSS_REGISTRY',
  TERMINAL = 'TERMINAL',
  AGENT_STUDIO = 'AGENT_STUDIO',
  VEO_STUDIO = 'VEO_STUDIO',
  SETTINGS = 'SETTINGS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
}

export enum AIModel {
  GEMINI_PRO = 'gemini-3-pro-preview',
  GEMINI_FLASH = 'gemini-3-flash-preview',
  IMAGE_PRO = 'gemini-3-pro-image-preview',
  VEO_FAST = 'veo-3.1-fast-generate-preview',
  TTS = 'gemini-2.5-flash-preview-tts'
}