import { Podcast } from '@/types/podcast';

/**
 * Mock podcast data for development and testing
 */
export const mockPodcasts: Podcast[] = [
  {
    id: '8',
    title: '8 Prompt Injection',
    description: '[PLACEHOLDER: Add description about prompt injection in AI systems]',
    imageUrl: 'https://picsum.photos/400/400?random=8',
    audioUrl: require('../assets/audio/8 Prompt Injection.mp3'),
    duration: 201000, 
    author: 'Kahhow',
    category: 'Artificial Intelligence',
    sources: [
      {
        title: '[PLACEHOLDER: Add source title]',
        url: 'https://www.latent.space/p/reverse-prompt-eng',
        type: 'website',
        author: 'Latent.space',
        publishedDate: '2022',
      },
      {
        title: 'Play a game to learn about prompt injection',
        url: 'https://gandalf.lakera.ai/baseline,
        type: 'website',
        author: 'Lakera.ai',
        publishedDate: '2024',
      },
      // [PLACEHOLDER: Add more sources as needed]
    ]
  },
  {
    id: '15',
    title: 'Learn to use AI: creating songs to help students’ remember, inspired by Eugene Teo (SJI)',
    description: 'Discover how you can use AI to turn subject content into songs, harness audio for memory, and explore sleep-based learning strategies inspired by Eugene Teo\'s (SJI) edutech experiments to support student learning outcomes.\n\nYou\'ll be able to:\n1. Use AI tools like ChatGPT, Suno, or Udio to convert subject concepts into lyrics and music, even if you\'re not musically inclined.\n2. Integrate audio-based study aids into your teaching — from playlists to paired video summaries — to reinforce learning beyond the classroom.\n3. Apply sleep research such as Targeted Memory Reactivation (TMR) by pairing summaries and lofi tracks with bedtime routines to strengthen student recall.',
    imageUrl: 'https://picsum.photos/400/400?random=7',
    audioUrl: require('../assets/audio/15 ai audio - eugene - isolated.mp3'),
    duration: 306000,
    author: 'DXD Product Team',
    category: 'Artificial Intelligence',
    sources: [
      {
        title: 'Prompts for Suno to generate songs for your subject',
        url: 'https://medium.com/string/suno-ready-prompts-for-learning-via-audio-first-35e87af221e4',
        type: 'website',
        author: 'Kahhow',
        publishedDate: '2025',
      },
      {
        title: 'O Level Chemistry Lofi Study Music (Vol 1 - v1)',
        url: 'https://www.youtube.com/watch?v=sWRqbqHKa_s',
        type: 'video',
        author: 'Eugene Teo, SJI',
        publishedDate: '2025'
      },
      {
        title: 'Chemistry NotebookLM summaries in a YouTube playlist by Eugene Teo, SJI',
        url: 'https://www.youtube.com/playlist?list=PLRyjE27lCUbxefJzi6Ys7Fka_ZrN1EIPt',
        type: 'video',
        author: 'Eugene Teo, SJI',
        publishedDate: '2025'
      },
      {
        title: 'Eugene\'s Original Linkedin Post, reposted with consent',
        url: 'https://www.linkedin.com/feed/update/urn:li:activity:7357597913297932289/',
        type: 'article',
        author: 'Eugene Teo, SJI',
        publishedDate: '2025'
      },
    ]
  },
  {
    id: '3',
    title: 'Supporting Students with Dyslexia: What Every Teacher Needs to Know',
    description: 'Comprehensive approaches to create a positive school culture that prevents bullying and promotes student safety and wellbeing.',
    imageUrl: 'https://picsum.photos/400/400?random=5',
    audioUrl: require('../assets/audio/The_Hidden_Truth_about_Dyslexia-What_Every_Teacher_Needs_to_Know.wav'),
    duration: 435000, // 40 minutes in milliseconds
    author: 'DXD Product Team',
    category: 'Special Educational Needs',
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
    imageUrl: 'https://picsum.photos/400/400?random=6',
    audioUrl: require('../assets/audio/ais-role-in-singapores-education-transformation.wav'),
    duration: 540000, // 9 minutes
    author: 'Education Technology Team',
    category: 'Artificial Intelligence',
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
        publishedDate: 'Unknown'},
    ]
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