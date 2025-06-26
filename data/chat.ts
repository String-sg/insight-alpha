import { ChatUser, ChatMessage, ChatSession } from '@/types/chat';

export const aiUser: ChatUser = {
  id: 'ai-assistant',
  name: 'AI Assistant',
  isAI: true,
};

export const humanUser: ChatUser = {
  id: 'user',
  name: 'You',
  isAI: false,
};

const sampleMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Hello! I\'m your AI assistant. I can help you with questions about podcasts, education, or anything else you\'d like to discuss.',
    userId: 'ai-assistant',
    timestamp: new Date(Date.now() - 60000), // 1 minute ago
    type: 'text',
    status: 'delivered',
  },
  {
    id: '2',
    content: 'Hi there! Can you tell me more about the educational content available in this app?',
    userId: 'user',
    timestamp: new Date(Date.now() - 30000), // 30 seconds ago
    type: 'text',
    status: 'delivered',
  },
  {
    id: '3',
    content: 'Absolutely! This app features a wide variety of educational podcasts covering topics like technology, science, business, and personal development. Each podcast also comes with interactive quizzes that unlock after you\'ve listened to 80% of the episode. Would you like me to recommend some specific podcasts based on your interests?',
    userId: 'ai-assistant',
    timestamp: new Date(Date.now() - 10000), // 10 seconds ago
    type: 'text',
    status: 'delivered',
  },
];

export const defaultSession: ChatSession = {
  id: 'default-session',
  title: 'Chat with AI Assistant',
  messages: sampleMessages,
  lastActivity: new Date(),
  participants: [humanUser, aiUser],
};

// AI response templates for realistic conversations
export const aiResponses: string[] = [
  "That's a great question! Let me help you with that.",
  "I understand what you're looking for. Here's what I can tell you:",
  "Interesting point! From my perspective, I'd say:",
  "That's something I can definitely help with. Let me explain:",
  "Good thinking! Here's how I would approach that:",
  "I see what you mean. Let me provide some insights:",
  "That's a common question, and here's what I've learned:",
  "Absolutely! I'd be happy to share my thoughts on that:",
  "That's a topic I find fascinating. Here's what I think:",
  "Great question! Let me break that down for you:",
];

export const topicSpecificResponses: Record<string, string[]> = {
  podcast: [
    "Podcasts are a fantastic way to learn! I'd recommend starting with shorter episodes and gradually working up to longer content.",
    "The quiz feature in this app is really valuable - it helps reinforce what you've learned from each podcast episode.",
    "For podcast listening, I suggest using the playback speed controls to find your optimal learning pace.",
  ],
  education: [
    "Education is most effective when it's interactive and engaging. That's why the quiz system here works so well!",
    "Different learning styles work for different people. Audio learning through podcasts can be particularly effective for auditory learners.",
    "The key to educational growth is consistency. Even 15-20 minutes of daily learning can compound over time.",
  ],
  technology: [
    "Technology in education is evolving rapidly. AI-powered learning tools like this chat feature can provide personalized support.",
    "The intersection of audio content and interactive quizzes represents a modern approach to digital learning.",
    "Technology should enhance, not replace, the fundamental learning process. It's about finding the right balance.",
  ],
  general: [
    "That's an interesting perspective! What made you think about that?",
    "I appreciate you sharing that with me. How can I help you explore this further?",
    "Thanks for the question! Is there a particular aspect you'd like to focus on?",
  ],
};

export function getRandomAIResponse(userMessage?: string): string {
  if (!userMessage) {
    return aiResponses[Math.floor(Math.random() * aiResponses.length)];
  }

  const message = userMessage.toLowerCase();
  
  if (message.includes('podcast') || message.includes('audio') || message.includes('listen')) {
    const responses = topicSpecificResponses.podcast;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (message.includes('learn') || message.includes('education') || message.includes('study') || message.includes('quiz')) {
    const responses = topicSpecificResponses.education;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (message.includes('tech') || message.includes('ai') || message.includes('digital') || message.includes('app')) {
    const responses = topicSpecificResponses.technology;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  const responses = topicSpecificResponses.general;
  return responses[Math.floor(Math.random() * responses.length)];
}