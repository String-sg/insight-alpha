export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  isAI: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  timestamp: Date;
  type: 'text' | 'typing';
  status: 'sending' | 'sent' | 'delivered' | 'failed';
}

export interface ChatSession {
  id: string;
  title?: string;
  messages: ChatMessage[];
  lastActivity: Date;
  participants: ChatUser[];
}

export interface ChatContextState {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isTyping: boolean;
  isConnected: boolean;
  isChatVisible: boolean;
}

export interface ChatContextActions {
  sendMessage: (content: string) => Promise<void>;
  createNewSession: () => void;
  loadSession: (sessionId: string) => void;
  clearCurrentSession: () => void;
  showChat: () => void;
  hideChat: () => void;
}

export type ChatContextType = ChatContextState & ChatContextActions;

export interface ChatConfig {
  aiResponseDelay: number;
  maxMessageLength: number;
  autoSaveInterval: number;
}