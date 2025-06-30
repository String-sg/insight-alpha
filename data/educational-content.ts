import { PodcastSource } from '@/types/podcast';

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
  sources?: PodcastSource[];
}

export const educationalContent: EducationalContent[] = [
  {
    id: '5',
    title: 'Building Safe School Environments: Anti-Bullying Strategies',
    description: 'Comprehensive approaches to create a positive school culture that prevents bullying and promotes student safety and wellbeing.',
    category: 'Special Educational Needs',
    author: 'Student Development Team',
    duration: 2400000, // 40 minutes
    imageUrl: 'https://picsum.photos/400/400?random=5',
    audioUrl: require('../assets/audio/building-safe-school-environments.mp3'),
    backgroundColor: 'bg-white',
    badgeColor: 'bg-purple-200',
    textColor: 'text-purple-900',
    timeLeft: '40m left',
    progress: 0.2,
    publishedDate: '1 day ago',
    sources: [
      {
        title: '[Understanding Special Educational Needs in Singapore: A Comprehensive Guide]',
        url: 'https://www.moe.gov.sg/education-in-sg/special-educational-needs',
        type: 'article',
        author: 'Smith, J.',
        publishedDate: '2021'
      },
      {
        title: '[Strategies for Supporting Students with SEN in Mainstream Classrooms]',
        url: 'https://www.nie.edu.sg/research/sen-support-strategies',
        type: 'research',
        author: 'Tan, L. & Wong, R.',
        publishedDate: '2020'
      },
      {
        title: 'Framework for Inclusive Education: Policies and Practices',
        url: 'https://www.moe.gov.sg/education-in-sg/inclusive-education-framework',
        type: 'article',
        author: '[Ministry of Education, Singapore.',
        publishedDate: '2019'
      },
      {
        title: '[Collaborative Teaching Approaches for Diverse Learners]',
        url: 'https://www.singteach.nie.edu.sg/collaborative-teaching',
        type: 'article',
        author: 'Lee, A.',
        publishedDate: '2018'
      },
      {
        title: '[The Role of Teachers in Supporting SEN: A Singapore Perspective] Asia-Pacific Journal of Education, 42(1), 89-105.',
        url: 'https://www.tandfonline.com/doi/abs/10.1080/02188791.2022.2031873',
        type: 'research',
        author: 'Chua, M.',
        publishedDate: '2022'
      }
    ]
  },
  {
    id: '6',
    title: "AI's Role in Singapore's Education Transformation",
    description: 'Comprehensive overview of how artificial intelligence is reshaping educational practices, personalized learning, and administrative efficiency in Singapore\'s schools.',
    category: 'Artificial Intelligent',
    author: 'Education Technology Team',
    duration: 2100000, // 35 minutes
    imageUrl: 'https://picsum.photos/400/400?random=6',
    audioUrl: require('../assets/audio/ais-role-in-singapores-education-transformation.wav'),
    backgroundColor: 'bg-white',
    badgeColor: 'bg-yellow-200',
    textColor: 'text-yellow-900',
    timeLeft: '35m left',
    progress: 0,
    publishedDate: 'Today',
    sources: [
      {
        title: '[AI in Education: Singapore\'s National Strategy and Implementation]',
        url: 'https://www.smartnation.gov.sg/initiatives/education/ai-education',
        type: 'article',
        author: 'Smart Nation Singapore',
        publishedDate: '2023'
      },
      {
        title: '[Personalized Learning Through AI: Evidence from Singapore Schools]',
        url: 'https://www.nie.edu.sg/research/ai-personalized-learning',
        type: 'research',
        author: 'Lim, K.Y. & Chen, W.',
        publishedDate: '2022'
      },
      {
        title: 'EdTech Plan: Transforming Education Through Technology',
        url: 'https://www.moe.gov.sg/education-in-sg/educational-technology',
        type: 'article',
        author: '[Ministry of Education, Singapore.',
        publishedDate: '2021'
      },
      {
        title: '[AI-Powered Assessment Tools in Singapore\'s Education System]',
        url: 'https://www.suss.edu.sg/research/ai-assessment-tools',
        type: 'study',
        author: 'Tan, S.C.',
        publishedDate: '2023'
      },
      {
        title: '[Ethical Considerations for AI in Education: A Framework for Singapore] International Journal of Educational Technology, 18(3), 245-262.',
        url: 'https://www.springer.com/journal/41239',
        type: 'research',
        author: 'Wong, L.H. & Looi, C.K.',
        publishedDate: '2022'
      }
    ]
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