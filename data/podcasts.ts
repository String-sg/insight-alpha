import { Podcast } from '@/types/podcast';

/**
 * Mock podcast data for development and testing
 */
export const mockPodcasts: Podcast[] = [
  {
    id: '5',
    title: 'Building Safe School Environments: Anti-Bullying Strategies',
    description: 'Comprehensive approaches to create a positive school culture that prevents bullying and promotes student safety and wellbeing.',
    imageUrl: 'https://picsum.photos/400/400?random=5',
    audioUrl: require('../assets/audio/building-safe-school-environments.mp3'),
    duration: 2400000, // 40 minutes in milliseconds
    author: 'Student Development Team'
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