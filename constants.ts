import { User, Message } from './types';

export const ME_USER_ID = 'me';

export const USERS: User[] = [
  {
    id: 'ai-itsup',
    name: 'ITSUP AI',
    avatar: 'https://picsum.photos/seed/itsup/200/200',
    isOnline: true,
    hasStory: true,
  },
  {
    id: 'user-1',
    name: 'Sarah Connor',
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    isOnline: true,
    hasStory: true,
  },
  {
    id: 'user-2',
    name: 'John Wick',
    avatar: 'https://picsum.photos/seed/john/200/200',
    isOnline: false,
    lastSeen: '2m ago',
    hasStory: false,
  },
  {
    id: 'user-3',
    name: 'Neo Anderson',
    avatar: 'https://picsum.photos/seed/neo/200/200',
    isOnline: true,
    hasStory: true,
  },
  {
    id: 'user-4',
    name: 'Ellen Ripley',
    avatar: 'https://picsum.photos/seed/ripley/200/200',
    isOnline: false,
    lastSeen: '1h ago',
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  'ai-itsup': [
    {
      id: 'msg-0',
      senderId: 'ai-itsup',
      text: 'Greetings. I am ITSUP AI, your personal interface to the network. How can I assist you today?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      isAi: true,
      status: 'read'
    }
  ],
  'user-1': [
    {
      id: 'msg-1',
      senderId: 'user-1',
      text: 'Have you seen the new quantum drive specs?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'read'
    }
  ]
};