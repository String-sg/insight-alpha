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
    author: 'Student Development Team',
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
    imageUrl: 'https://picsum.photos/400/400?random=6',
    audioUrl: require('../assets/audio/ais-role-in-singapores-education-transformation.wav'),
    duration: 2100000, // 35 minutes in milliseconds
    author: 'Education Technology Team',
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