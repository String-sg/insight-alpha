export interface EducationalContent {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  duration: number; // in milliseconds
  imageUrl: string;
  audioUrl: string | number;
  backgroundColor: string;
  badgeColor: string;
  textColor: string;
  timeLeft?: string;
  progress?: number; // 0-1
  isCompleted?: boolean;
  publishedDate: string;
}

export const educationalContent: EducationalContent[] = [
  {
    id: '5',
    title: 'Building Safe School Environments: Anti-Bullying Strategies',
    description: 'Comprehensive approaches to create a positive school culture that prevents bullying and promotes student safety and wellbeing.',
    category: 'Special Education Needs',
    author: 'Student Development Team',
    duration: 2400000, // 40 minutes
    imageUrl: 'https://picsum.photos/400/400?random=5',
    audioUrl: require('../assets/audio/building-safe-school-environments.mp3'),
    backgroundColor: 'bg-green-100',
    badgeColor: 'bg-green-200',
    textColor: 'text-green-900',
    timeLeft: '40m left',
    progress: 0.2,
    publishedDate: '1 day ago'
  }
];

export const weeklyProgress = [
  { day: 'Mon', date: 13, isCompleted: false, isToday: false },
  { day: 'Tue', date: 14, isCompleted: true, isToday: false },
  { day: 'Wed', date: 15, isCompleted: true, isToday: true },
  { day: 'Thu', date: 16, isCompleted: false, isToday: false },
  { day: 'Fri', date: 17, isCompleted: false, isToday: false },
  { day: 'Sat', date: 18, isCompleted: false, isToday: false },
  { day: 'Sun', date: 19, isCompleted: false, isToday: false }
];

export const formatDuration = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
  
  return `${minutes}m`;
};