import { Quiz } from '@/types/quiz';

/**
 * Mock quiz data for development and testing
 * Each quiz corresponds to educational content in the educational-content data
 */
export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    podcastId: '1', // Special Educational Needs
    title: 'Special Educational Needs Quiz',
    description: 'Test your understanding of supporting students with special educational needs and creating inclusive learning environments.',
    durationThreshold: 0.8, // 80% listening required
    estimatedTime: 6,
    questions: [
      {
        id: 'q1-1',
        question: 'What is the most important principle when supporting students with special educational needs?',
        difficulty: 'medium',
        options: [
          { id: 'opt1-1', text: 'Treating all students exactly the same', isCorrect: false },
          { id: 'opt1-2', text: 'Individualized support based on each student\'s unique needs', isCorrect: true },
          { id: 'opt1-3', text: 'Separating students with SEN from mainstream classes', isCorrect: false },
          { id: 'opt1-4', text: 'Focusing only on academic achievements', isCorrect: false }
        ],
        explanation: 'Each student with SEN has unique needs and requires individualized support strategies to reach their full potential.'
      },
      {
        id: 'q1-2',
        question: 'What does "inclusion" mean in the context of special educational needs?',
        difficulty: 'easy',
        options: [
          { id: 'opt2-1', text: 'All students learning together with appropriate support', isCorrect: true },
          { id: 'opt2-2', text: 'Separate classes for students with different needs', isCorrect: false },
          { id: 'opt2-3', text: 'Lowering expectations for all students', isCorrect: false },
          { id: 'opt2-4', text: 'Only accepting students without disabilities', isCorrect: false }
        ],
        explanation: 'Inclusion means all students, regardless of their abilities or disabilities, learn together in the same classroom with appropriate support.'
      },
      {
        id: 'q1-3',
        question: 'Which strategy is most effective for supporting students with learning difficulties?',
        difficulty: 'medium',
        options: [
          { id: 'opt3-1', text: 'Using only one teaching method for all students', isCorrect: false },
          { id: 'opt3-2', text: 'Differentiated instruction and multiple learning modalities', isCorrect: true },
          { id: 'opt3-3', text: 'Excluding them from group activities', isCorrect: false },
          { id: 'opt3-4', text: 'Giving them easier work than other students', isCorrect: false }
        ],
        explanation: 'Differentiated instruction using visual, auditory, and kinesthetic approaches helps accommodate different learning styles and needs.'
      },
      {
        id: 'q1-4',
        question: 'What is the primary goal of an Individualized Education Plan (IEP)?',
        difficulty: 'hard',
        options: [
          { id: 'opt4-1', text: 'To create personalized learning goals and support strategies', isCorrect: true },
          { id: 'opt4-2', text: 'To label students with their disabilities', isCorrect: false },
          { id: 'opt4-3', text: 'To determine which students cannot learn', isCorrect: false },
          { id: 'opt4-4', text: 'To separate students from their peers', isCorrect: false }
        ],
        explanation: 'An IEP provides a roadmap for each student\'s education, outlining specific goals, accommodations, and services needed for success.'
      }
    ]
  },
  {
    id: 'quiz-2',
    podcastId: '2', // Reflective Practice
    title: 'Reflective Practice in Education Quiz',
    description: 'Test your understanding of reflective teaching practices and professional development strategies.',
    durationThreshold: 0.8,
    estimatedTime: 5,
    questions: [
      {
        id: 'q2-1',
        question: 'What is the primary purpose of reflective practice in teaching?',
        difficulty: 'medium',
        options: [
          { id: 'opt1-1', text: 'To critique and blame teachers for poor performance', isCorrect: false },
          { id: 'opt1-2', text: 'To continuously improve teaching methods and student outcomes', isCorrect: true },
          { id: 'opt1-3', text: 'To document lessons for administration only', isCorrect: false },
          { id: 'opt1-4', text: 'To compare teachers against each other', isCorrect: false }
        ],
        explanation: 'Reflective practice helps teachers analyze their teaching methods and make improvements to better serve their students.'
      },
      {
        id: 'q2-2',
        question: 'Which stage comes first in the reflective practice cycle?',
        difficulty: 'easy',
        options: [
          { id: 'opt2-1', text: 'Action - implementing changes', isCorrect: false },
          { id: 'opt2-2', text: 'Description - what happened in the lesson', isCorrect: true },
          { id: 'opt2-3', text: 'Analysis - evaluating effectiveness', isCorrect: false },
          { id: 'opt2-4', text: 'Planning - designing next steps', isCorrect: false }
        ],
        explanation: 'Reflective practice begins with describing what actually happened before analyzing and planning improvements.'
      },
      {
        id: 'q2-3',
        question: 'What is the most effective way to gather evidence for reflection?',
        difficulty: 'medium',
        options: [
          { id: 'opt3-1', text: 'Relying solely on memory and assumptions', isCorrect: false },
          { id: 'opt3-2', text: 'Using multiple sources: student feedback, observations, and assessment data', isCorrect: true },
          { id: 'opt3-3', text: 'Only looking at test scores', isCorrect: false },
          { id: 'opt3-4', text: 'Asking administrators for their opinions only', isCorrect: false }
        ],
        explanation: 'Multiple data sources provide a comprehensive view of teaching effectiveness and student learning.'
      },
      {
        id: 'q2-4',
        question: 'How should teachers approach challenging reflective insights about their practice?',
        difficulty: 'hard',
        options: [
          { id: 'opt4-1', text: 'View them as opportunities for professional growth and learning', isCorrect: true },
          { id: 'opt4-2', text: 'Ignore them and continue with current methods', isCorrect: false },
          { id: 'opt4-3', text: 'Blame external factors like students or resources', isCorrect: false },
          { id: 'opt4-4', text: 'Only share positive reflections with colleagues', isCorrect: false }
        ],
        explanation: 'Challenging insights are valuable learning opportunities that lead to professional growth and improved teaching.'
      }
    ]
  },
  {
    id: 'quiz-3',
    podcastId: '3', // Inclusive Education
    title: 'Inclusive Classroom Strategies Quiz',
    description: 'Test your knowledge of creating inclusive learning environments and practical classroom strategies.',
    durationThreshold: 0.8,
    estimatedTime: 5,
    questions: [
      {
        id: 'q3-1',
        question: 'What is the foundation of Universal Design for Learning (UDL)?',
        difficulty: 'easy',
        options: [
          { id: 'opt1-1', text: 'Providing multiple ways to engage, represent, and express learning', isCorrect: true },
          { id: 'opt1-2', text: 'Using the same teaching method for all students', isCorrect: false },
          { id: 'opt1-3', text: 'Focusing only on students with disabilities', isCorrect: false },
          { id: 'opt1-4', text: 'Creating separate lessons for different ability levels', isCorrect: false }
        ],
        explanation: 'UDL provides flexible learning environments that accommodate different learning styles and abilities from the start.'
      },
      {
        id: 'q3-2',
        question: 'Which strategy best promotes classroom inclusion?',
        difficulty: 'medium',
        options: [
          { id: 'opt2-1', text: 'Grouping students only by ability level', isCorrect: false },
          { id: 'opt2-2', text: 'Collaborative learning with diverse groupings', isCorrect: true },
          { id: 'opt2-3', text: 'Individual work exclusively', isCorrect: false },
          { id: 'opt2-4', text: 'Teacher-centered instruction only', isCorrect: false }
        ],
        explanation: 'Mixed-ability collaborative learning helps all students learn from each other and builds inclusive classroom communities.'
      },
      {
        id: 'q3-3',
        question: 'How should teachers address different learning paces in an inclusive classroom?',
        difficulty: 'medium',
        options: [
          { id: 'opt3-1', text: 'Hold all students to the same timeline', isCorrect: false },
          { id: 'opt3-2', text: 'Provide flexible timelines and multiple pathways to learning goals', isCorrect: true },
          { id: 'opt3-3', text: 'Give slower learners easier content', isCorrect: false },
          { id: 'opt3-4', text: 'Separate fast and slow learners completely', isCorrect: false }
        ],
        explanation: 'Flexible pacing allows all students to achieve the same learning goals through different timelines and approaches.'
      },
      {
        id: 'q3-4',
        question: 'What is the most important element of inclusive assessment?',
        difficulty: 'hard',
        options: [
          { id: 'opt4-1', text: 'Offering multiple ways for students to demonstrate their knowledge', isCorrect: true },
          { id: 'opt4-2', text: 'Using only standardized tests', isCorrect: false },
          { id: 'opt4-3', text: 'Lowering standards for some students', isCorrect: false },
          { id: 'opt4-4', text: 'Excluding some students from assessments', isCorrect: false }
        ],
        explanation: 'Inclusive assessment allows students to show what they know through various formats while maintaining high expectations for all.'
      }
    ]
  },
  {
    id: 'quiz-4',
    podcastId: '4', // Autism Spectrum Disorders
    title: 'Understanding Autism Spectrum Disorders Quiz',
    description: 'Test your knowledge about supporting students with autism spectrum disorders in the classroom.',
    durationThreshold: 0.8,
    estimatedTime: 6,
    questions: [
      {
        id: 'q4-1',
        question: 'What is most important to understand about autism spectrum disorders?',
        difficulty: 'medium',
        options: [
          { id: 'opt1-1', text: 'Every individual on the spectrum is unique with different strengths and challenges', isCorrect: true },
          { id: 'opt1-2', text: 'All students with autism have the same learning needs', isCorrect: false },
          { id: 'opt1-3', text: 'Students with autism cannot learn academic content', isCorrect: false },
          { id: 'opt1-4', text: 'Autism always means intellectual disability', isCorrect: false }
        ],
        explanation: 'Autism is a spectrum disorder, meaning each individual has unique abilities, challenges, and support needs.'
      },
      {
        id: 'q4-2',
        question: 'Which classroom strategy is most effective for students with autism?',
        difficulty: 'easy',
        options: [
          { id: 'opt2-1', text: 'Predictable routines and clear visual schedules', isCorrect: true },
          { id: 'opt2-2', text: 'Constant changes to keep them interested', isCorrect: false },
          { id: 'opt2-3', text: 'Loud and stimulating environments', isCorrect: false },
          { id: 'opt2-4', text: 'Isolation from other students', isCorrect: false }
        ],
        explanation: 'Students with autism often thrive with predictable routines and visual supports that help them understand expectations.'
      },
      {
        id: 'q4-3',
        question: 'How should teachers approach communication with students who have autism?',
        difficulty: 'medium',
        options: [
          { id: 'opt3-1', text: 'Speak louder to get their attention', isCorrect: false },
          { id: 'opt3-2', text: 'Use clear, direct language and allow processing time', isCorrect: true },
          { id: 'opt3-3', text: 'Avoid all verbal communication', isCorrect: false },
          { id: 'opt3-4', text: 'Use only complex abstract language', isCorrect: false }
        ],
        explanation: 'Clear, concrete communication with adequate processing time helps students with autism understand and respond effectively.'
      },
      {
        id: 'q4-4',
        question: 'What is the best approach to supporting sensory needs of students with autism?',
        difficulty: 'hard',
        options: [
          { id: 'opt4-1', text: 'Identify individual sensory preferences and provide appropriate accommodations', isCorrect: true },
          { id: 'opt4-2', text: 'Assume all students have the same sensory needs', isCorrect: false },
          { id: 'opt4-3', text: 'Ignore sensory behaviors completely', isCorrect: false },
          { id: 'opt4-4', text: 'Create the loudest possible environment', isCorrect: false }
        ],
        explanation: 'Sensory needs vary greatly among individuals with autism, requiring personalized assessment and accommodation strategies.'
      },
      {
        id: 'q4-5',
        question: 'How can teachers promote social inclusion for students with autism?',
        difficulty: 'medium',
        options: [
          { id: 'opt5-1', text: 'Facilitate structured social interactions and teach social skills explicitly', isCorrect: true },
          { id: 'opt5-2', text: 'Force unstructured social interactions', isCorrect: false },
          { id: 'opt5-3', text: 'Keep them separate from other students', isCorrect: false },
          { id: 'opt5-4', text: 'Expect them to learn social skills naturally', isCorrect: false }
        ],
        explanation: 'Structured social opportunities with explicit social skills instruction help students with autism develop meaningful peer relationships.'
      }
    ]
  }
];