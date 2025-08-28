import { PodcastSource } from '@/types/podcast';

export interface EducationalContent {
  id: string;
  title: string;
  description: string;
  summary: string;
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
    id: '1',
    title: 'Supporting Students with Dyslexia: What Every Teacher Needs to Know',
    description: '**Overview**\nThis episode dives deep into how educators can better understand and support students with dyslexia in mainstream classrooms. Backed by current brain research and real classroom experiences, the conversation unpacks what dyslexia really is (and isn’t), why some common myths persist, and how teachers can implement practical, research-based strategies that empower struggling readers. By embracing neurodiversity and applying structured support, educators can help students with dyslexia thrive both academically and emotionally.',
    summary: '1. Teach Reading Through Explicit, Systematic Phonics\n 2. Support Students Holistically in the Classroom (paired reading, visual support, leverage strengths; reframing lack of motivation as perhaps due to working twice as hard to decode text and hence appear disengaged)\n3. Build confidence by leveraging their strengths (oral expression, problem-solving, visual-spatial skills) and validating their effort)',
    category: 'Special Educational Needs',
    author: 'DXD Product Team',
    duration: 435000, // 7.15 minutes
    imageUrl: 'https://picsum.photos/400/400?random=5',
    audioUrl: require('../assets/audio/The_Hidden_Truth_about_Dyslexia-What_Every_Teacher_Needs_to_Know.wav'),
    backgroundColor: 'bg-white',
    badgeColor: 'bg-purple-200',
    textColor: 'text-purple-900',
    timeLeft: '13m left',
    progress: 0.2,
    publishedDate: '1 day ago',
    sources: [
      {
        title: 'Literacy and Language Needs',
        url: 'https://intranet.moe.gov.sg/Send/Resources/Pages/LiteracyandLanguageNeeds.aspx',
        type: 'intranet',
        author: 'MOE SEND',
        publishedDate: '2025'
      },
      {
        title: 'Strategies for Supporting Students with SEN in Mainstream Classrooms',
        url: 'https://uldforparents.com/contents/identifying-and-diagnosing-specific-learning-disabilities/diagnostic-criteria-for-specific-learning-disorder-diagnosis/',
        type: 'article',
        author: 'Auspeld Team',
        publishedDate: '2025'
      },
    ]
  },
  {
    id: '2',
    title: "ADHD in Classrooms: Strategies That Work",
    description: '**Overview**\nThis episode unpacks how teachers can understand and support students with Attention Deficit Hyperactivity Disorder (ADHD) in mainstream classrooms. We break down common myths, explore how ADHD presents in different students, and share practical, low-prep strategies to help learners focus, stay organized, and succeed. Learn how to work effectively with parents, use classroom adjustments, and create inclusive learning environments where all students can thrive.',
    summary: '1. Understanding ADHD Is Essential for Effective Support \n Simple, Low-Prep Strategies Make a Big Impact (structured routines, visual aids, and clear instructions—can greatly improve focus, organization, and participation) \n 3. Collaboration and Inclusivity Enhance Outcomes (parents, the entire class community)',
    category: 'Special Educational Needs',
    author: 'DXD Product Team',
    duration: 540000, // 9 minutes
    imageUrl: 'https://picsum.photos/400/400?random=6',
    audioUrl: require('../assets/audio/ADHD_in_Classrooms_Strategies_That_Work.wav'),
    backgroundColor: 'bg-white',
    badgeColor: 'bg-purple-200',
    textColor: 'text-purple-900',
    timeLeft: '6m left',
    progress: 0,
    publishedDate: 'Today',
    sources: [
      {
        title: 'Remembering an Extraordinary ADHD Educator and Advocate',
        url: 'https://www.additudemag.com/chris-zeigler-dendy-adhd-iceberg-educator/',
        type: 'article',
        author: 'ADDitude Editors',
        publishedDate: '2024'
      },
      {
        title: 'Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition (DSM-5)',
        url: 'https://www.nie.edu.sg/research/ai-personalized-learning',
        type: 'book',
        author: 'American Psychiatric Association',
        publishedDate: '2013'
      },
      {
        title: 'EdTech Plan: Transforming Education Through Technology',
        url: 'https://www.moe.gov.sg/education-in-sg/educational-technology',
        type: 'article',
        author: 'Ministry of Education, Singapore',
        publishedDate: '2021'
      },
      {
        title: 'MOE SEND Intranet Resources',
        url: 'https://intranet.moe.gov.sg/Send/Pages/Resources.aspx',
        type: 'study',
        author: 'MOE SEND Team',
        publishedDate: 'Unknown'
      }    ]
  },
  {
    id: '3',
    title: "AI's Role in Singapore's Education Transformation",
    description: '**Overview**\nThis episode explores how artificial intelligence is reshaping education in Singapore, from personalized learning experiences to administrative efficiency. We examine real-world implementations, discuss the balance between innovation and human connection, and look at how AI can support both teachers and students in creating more effective learning environments.',
    summary: '1. AI Enhances Personalized Learning Experiences \n 2. Technology Supports Teacher Effectiveness and Administrative Efficiency \n 3. Balanced Implementation Ensures Human Connection Remains Central',
    category: 'Artificial Intelligence',
    author: 'DXD Product Team',
    duration: 480000, // 8 minutes
    imageUrl: 'https://picsum.photos/400/400?random=7',
    audioUrl: require('../assets/audio/ais-role-in-singapores-education-transformation.wav'),
    backgroundColor: 'bg-white',
    badgeColor: 'bg-yellow-200',
    textColor: 'text-yellow-900',
    timeLeft: '8m',
    progress: 0,
    publishedDate: 'Today',
    sources: [
      {
        title: 'EdTech Plan: Transforming Education Through Technology',
        url: 'https://www.moe.gov.sg/education-in-sg/educational-technology',
        type: 'article',
        author: 'Ministry of Education, Singapore',
        publishedDate: '2021'
      },
      {
        title: 'AI in Education: Personalized Learning',
        url: 'https://www.nie.edu.sg/research/ai-personalized-learning',
        type: 'research',
        author: 'National Institute of Education',
        publishedDate: '2024'
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