import { Podcast } from '@/types/podcast';

/**
 * Mock podcast data for development and testing
 */
export const mockPodcasts: Podcast[] = [
  {
    id: '1',
    title: 'Tech Talk Daily',
    description: 'Your daily dose of the latest technology trends, startup news, and innovation stories. Join us as we explore the cutting edge of tech with industry leaders and visionaries.',
    imageUrl: 'https://picsum.photos/400/400?random=1',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 2700000, // 45 minutes in milliseconds
    author: 'Sarah Chen'
  },
  {
    id: '2',
    title: 'Business Beyond Borders',
    description: 'Exploring global business strategies, entrepreneurship, and the future of work. Learn from successful entrepreneurs and business leaders who are reshaping industries worldwide.',
    imageUrl: 'https://picsum.photos/400/400?random=2',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 3600000, // 60 minutes in milliseconds
    author: 'Marcus Rodriguez'
  },
  {
    id: '3',
    title: 'Mindful Health Journey',
    description: 'Wellness, mental health, and mindfulness practices for a balanced life. Discover practical tips for improving your physical and mental wellbeing with expert guidance.',
    imageUrl: 'https://picsum.photos/400/400?random=3',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 1800000, // 30 minutes in milliseconds
    author: 'Dr. Emma Thompson'
  },
  {
    id: '4',
    title: 'Comedy Central Nights',
    description: 'Laugh out loud with the best stand-up comedians and hilarious stories. A weekly dose of humor to brighten your day and keep you entertained.',
    imageUrl: 'https://picsum.photos/400/400?random=4',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 5400000, // 90 minutes in milliseconds
    author: 'Jake Miller & Friends'
  },
  {
    id: '5',
    title: 'History Uncovered',
    description: 'Dive deep into fascinating historical events, forgotten stories, and the people who shaped our world. Each episode brings history to life with engaging storytelling.',
    imageUrl: 'https://picsum.photos/400/400?random=5',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 3000000, // 50 minutes in milliseconds
    author: 'Professor David Clarke'
  },
  {
    id: '6',
    title: 'Creative Minds Collective',
    description: 'Inspiring conversations with artists, designers, writers, and creative professionals. Explore the creative process and learn how to unlock your own artistic potential.',
    imageUrl: 'https://picsum.photos/400/400?random=6',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 2400000, // 40 minutes in milliseconds
    author: 'Luna Vasquez'
  },
  {
    id: '7',
    title: 'Science Simplified',
    description: 'Making complex scientific concepts accessible to everyone. From quantum physics to climate science, we break down the latest research and discoveries.',
    imageUrl: 'https://picsum.photos/400/400?random=7',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 2100000, // 35 minutes in milliseconds
    author: 'Dr. Alex Kumar'
  },
  {
    id: '8',
    title: 'True Crime Chronicles',
    description: 'Investigative journalism meets storytelling in this gripping true crime series. Explore unsolved mysteries, criminal psychology, and the pursuit of justice.',
    imageUrl: 'https://picsum.photos/400/400?random=8',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 4200000, // 70 minutes in milliseconds
    author: 'Detective Maria Santos'
  }
];

/**
 * Helper function to format duration from milliseconds to readable string
 */
export const formatDuration = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
  
  return `${minutes}m`;
};