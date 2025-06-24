import { Quiz } from '@/types/quiz';

/**
 * Mock quiz data for development and testing
 * Each quiz corresponds to educational content in the educational-content data
 */
export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-5',
    podcastId: '5', // Building Safe School Environments: Anti-Bullying Strategies
    title: 'Building Safe School Environments Quiz',
    description: 'Test your understanding of anti-bullying strategies and creating positive school cultures that promote student safety and wellbeing.',
    durationThreshold: 0.8, // 80% listening required
    estimatedTime: 7,
    questions: [
      {
        id: 'q5-1',
        question: 'What is the most effective approach to preventing bullying in schools?',
        difficulty: 'medium',
        options: [
          { id: 'opt1-1', text: 'Reactive disciplinary measures only', isCorrect: false },
          { id: 'opt1-2', text: 'Creating a comprehensive whole-school approach with prevention, intervention, and support', isCorrect: true },
          { id: 'opt1-3', text: 'Ignoring minor bullying incidents', isCorrect: false },
          { id: 'opt1-4', text: 'Separating potential victims from their peers', isCorrect: false }
        ],
        explanation: 'Effective anti-bullying strategies require a comprehensive approach that includes prevention education, clear policies, intervention protocols, and ongoing support for all students.'
      },
      {
        id: 'q5-2',
        question: 'Which characteristic defines a positive school climate that prevents bullying?',
        difficulty: 'easy',
        options: [
          { id: 'opt2-1', text: 'Strong relationships, clear expectations, and inclusive practices', isCorrect: true },
          { id: 'opt2-2', text: 'Strict punishment-only policies', isCorrect: false },
          { id: 'opt2-3', text: 'Competitive environments that promote hierarchy', isCorrect: false },
          { id: 'opt2-4', text: 'Minimal supervision and intervention', isCorrect: false }
        ],
        explanation: 'Positive school climates foster belonging, mutual respect, and clear behavioral expectations that naturally discourage bullying behaviors.'
      },
      {
        id: 'q5-3',
        question: 'What role should bystanders play in anti-bullying efforts?',
        difficulty: 'medium',
        options: [
          { id: 'opt3-1', text: 'Stay uninvolved to avoid becoming targets', isCorrect: false },
          { id: 'opt3-2', text: 'Become active upstanders who safely intervene and report incidents', isCorrect: true },
          { id: 'opt3-3', text: 'Only watch and report after the incident is over', isCorrect: false },
          { id: 'opt3-4', text: 'Join in to avoid being excluded', isCorrect: false }
        ],
        explanation: 'Training students to be upstanders who safely intervene, support victims, and report incidents is crucial for creating a protective school environment.'
      },
      {
        id: 'q5-4',
        question: 'How should schools address cyberbullying?',
        difficulty: 'hard',
        options: [
          { id: 'opt4-1', text: 'Ignore it since it happens outside school hours', isCorrect: false },
          { id: 'opt4-2', text: 'Integrate digital citizenship education and extend anti-bullying policies to online behaviors', isCorrect: true },
          { id: 'opt4-3', text: 'Ban all technology use at school', isCorrect: false },
          { id: 'opt4-4', text: 'Only address it if it involves school devices', isCorrect: false }
        ],
        explanation: 'Effective cyberbullying prevention requires comprehensive digital citizenship education and policies that address online behaviors affecting the school community.'
      },
      {
        id: 'q5-5',
        question: 'What is essential when supporting students who have experienced bullying?',
        difficulty: 'medium',
        options: [
          { id: 'opt5-1', text: 'Tell them to ignore it and it will stop', isCorrect: false },
          { id: 'opt5-2', text: 'Provide immediate safety, emotional support, and follow-up monitoring', isCorrect: true },
          { id: 'opt5-3', text: 'Move them to a different school', isCorrect: false },
          { id: 'opt5-4', text: 'Suggest they become more assertive', isCorrect: false }
        ],
        explanation: 'Students who experience bullying need immediate safety measures, emotional support, and ongoing monitoring to ensure their wellbeing and academic success.'
      }
    ]
  }
];