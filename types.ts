export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
  lastSeen?: string;
  hasStory?: boolean;
}

export interface Message {
  id: string;
  senderId: string; // 'me' or contactId
  text: string;
  timestamp: Date;
  isAi?: boolean;
  status: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'voice';
}

export interface ChatSession {
  contactId: string;
  messages: Message[];
  draft?: string;
  typing?: boolean;
}

export enum AppView {
  CHATS = 'CHATS',
  STORIES = 'STORIES',
  MAP = 'MAP',
  SETTINGS = 'SETTINGS'
}
