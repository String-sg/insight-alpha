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
    id: '1',
    title: 'School Bullying: Prevention and Intervention',
    description: 'Essential strategies and practical approaches for educators to prevent, identify, and effectively intervene in school bullying situations.',
    category: 'Student Wellbeing',
    author: 'Guidance Branch',
    duration: 1800000, // 30 minutes (estimated)
    imageUrl: 'https://picsum.photos/400/400?random=1',
    audioUrl: require('../assets/audio/school-bullying-prevention-and-intervention.wav'),
    backgroundColor: 'bg-purple-100',
    badgeColor: 'bg-purple-200',
    textColor: 'text-purple-900',
    timeLeft: '30m left',
    progress: 0.0,
    publishedDate: '2 days ago'
  },
  {
    id: '2',
    title: 'Reflective Practice in Education: Building Better Teaching Strategies',
    description: 'Learn how to implement effective reflective practices to enhance your teaching methods and student outcomes.',
    category: 'Reflective Practice',
    author: 'Guidance Branch',
    duration: 1380000, // 23 minutes
    imageUrl: 'https://picsum.photos/400/400?random=2',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    backgroundColor: 'bg-green-100',
    badgeColor: 'bg-green-200',
    textColor: 'text-green-900',
    timeLeft: '23m left',
    progress: 0.6,
    publishedDate: '2 days ago'
  },
  {
    id: '3',
    title: 'Creating Inclusive Classrooms: Practical Strategies for Every Teacher',
    description: 'Discover evidence-based approaches to create inclusive learning environments that support all students.',
    category: 'Inclusive Education',
    author: 'Ministry of Education',
    duration: 1800000, // 30 minutes
    imageUrl: 'https://picsum.photos/400/400?random=3',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    backgroundColor: 'bg-blue-100',
    badgeColor: 'bg-blue-200',
    textColor: 'text-blue-900',
    timeLeft: '30m left',
    progress: 0.3,
    publishedDate: '3 days ago'
  },
  {
    id: '4',
    title: 'Understanding Autism Spectrum Disorders in the Classroom',
    description: 'Essential knowledge for educators working with students on the autism spectrum.',
    category: 'Special Educational Needs',
    author: 'Special Needs Department',
    duration: 2100000, // 35 minutes
    imageUrl: 'https://picsum.photos/400/400?random=4',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    backgroundColor: 'bg-purple-100',
    badgeColor: 'bg-purple-200',
    textColor: 'text-purple-900',
    timeLeft: '35m left',
    progress: 0.9,
    isCompleted: true,
    publishedDate: '1 week ago'
  },
  {
    id: '5',
    title: 'Building Safe School Environments: Anti-Bullying Strategies',
    description: 'Comprehensive approaches to create a positive school culture that prevents bullying and promotes student safety and wellbeing.',
    category: 'School Safety',
    author: 'Student Development Team',
    duration: 2400000, // 40 minutes
    imageUrl: 'https://picsum.photos/400/400?random=5',
    audioUrl: require('../assets/audio/school-bullying-prevention-and-intervention.wav'),
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