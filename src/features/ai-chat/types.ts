// =====================================================
// PCMS - AI Chat feature types
// =====================================================

export interface AIMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
  followUp?: string[];
}

export interface AIChatRequest {
  message: string;
  history?: AIMessage[];
}

export interface AIChatResponse {
  response: string;
  followUp: string[];
}
