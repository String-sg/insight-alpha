import { Quiz } from '@/types/quiz';

/**
 * Mock quiz data for development and testing
 * Each quiz corresponds to a podcast in the mockPodcasts data
 */
export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    podcastId: '1', // Tech Talk Daily
    title: 'Tech Trends & Innovation Quiz',
    description: 'Test your knowledge about the latest technology trends and startup innovations discussed in this episode.',
    durationThreshold: 0.8, // 80% listening required
    estimatedTime: 5,
    questions: [
      {
        id: 'q1-1',
        question: 'What are the key characteristics of successful tech startups according to the episode?',
        difficulty: 'medium',
        options: [
          { id: 'opt1-1', text: 'Fast growth and high valuations only', isCorrect: false },
          { id: 'opt1-2', text: 'Solving real problems, strong team, and scalable business model', isCorrect: true },
          { id: 'opt1-3', text: 'Having the most advanced technology', isCorrect: false },
          { id: 'opt1-4', text: 'Large initial funding rounds', isCorrect: false }
        ],
        explanation: 'Successful startups focus on solving real problems with strong teams and scalable models rather than just technology or funding.'
      },
      {
        id: 'q1-2',
        question: 'Which emerging technology trend was highlighted as most promising for 2024?',
        difficulty: 'easy',
        options: [
          { id: 'opt2-1', text: 'Artificial Intelligence and Machine Learning', isCorrect: true },
          { id: 'opt2-2', text: 'Virtual Reality Gaming', isCorrect: false },
          { id: 'opt2-3', text: '3D Printing', isCorrect: false },
          { id: 'opt2-4', text: 'Cryptocurrency Mining', isCorrect: false }
        ],
        explanation: 'AI and ML were emphasized as the most transformative technologies for various industries in 2024.'
      },
      {
        id: 'q1-3',
        question: 'What advice was given for tech professionals looking to stay relevant?',
        difficulty: 'medium',
        options: [
          { id: 'opt3-1', text: 'Focus only on one programming language', isCorrect: false },
          { id: 'opt3-2', text: 'Continuous learning and adapting to new technologies', isCorrect: true },
          { id: 'opt3-3', text: 'Avoid working with startups', isCorrect: false },
          { id: 'opt3-4', text: 'Only work on established technologies', isCorrect: false }
        ],
        explanation: 'The key is continuous learning and staying adaptable to new technological developments.'
      },
      {
        id: 'q1-4',
        question: 'What was mentioned as a major challenge for tech companies in 2024?',
        difficulty: 'hard',
        options: [
          { id: 'opt4-1', text: 'Lack of talent and skills gap', isCorrect: true },
          { id: 'opt4-2', text: 'Too much competition', isCorrect: false },
          { id: 'opt4-3', text: 'Government regulations', isCorrect: false },
          { id: 'opt4-4', text: 'Limited market opportunities', isCorrect: false }
        ],
        explanation: 'The skills gap and difficulty finding qualified talent was identified as a primary challenge.'
      }
    ]
  },
  {
    id: 'quiz-2',
    podcastId: '2', // Business Beyond Borders
    title: 'Global Business Strategy Quiz',
    description: 'Explore your understanding of international business strategies and entrepreneurship insights.',
    durationThreshold: 0.8,
    estimatedTime: 6,
    questions: [
      {
        id: 'q2-1',
        question: 'What is the most important factor when expanding a business internationally?',
        difficulty: 'medium',
        options: [
          { id: 'opt1-1', text: 'Having the lowest prices', isCorrect: false },
          { id: 'opt1-2', text: 'Understanding local culture and market needs', isCorrect: true },
          { id: 'opt1-3', text: 'Using the same strategy everywhere', isCorrect: false },
          { id: 'opt1-4', text: 'Having a large marketing budget', isCorrect: false }
        ],
        explanation: 'Cultural understanding and local market adaptation are crucial for successful international expansion.'
      },
      {
        id: 'q2-2',
        question: 'Which business model was highlighted as most resilient during economic uncertainty?',
        difficulty: 'easy',
        options: [
          { id: 'opt2-1', text: 'Subscription-based services', isCorrect: true },
          { id: 'opt2-2', text: 'One-time product sales', isCorrect: false },
          { id: 'opt2-3', text: 'Luxury goods only', isCorrect: false },
          { id: 'opt2-4', text: 'Real estate investment', isCorrect: false }
        ],
        explanation: 'Subscription models provide predictable recurring revenue, making them more stable during uncertain times.'
      },
      {
        id: 'q2-3',
        question: 'What was emphasized as the key to successful remote team management?',
        difficulty: 'medium',
        options: [
          { id: 'opt3-1', text: 'Constant monitoring and micromanagement', isCorrect: false },
          { id: 'opt3-2', text: 'Clear communication and trust-building', isCorrect: true },
          { id: 'opt3-3', text: 'Only hiring local talent', isCorrect: false },
          { id: 'opt3-4', text: 'Avoiding video calls', isCorrect: false }
        ],
        explanation: 'Trust and clear communication are fundamental for effective remote team management.'
      },
      {
        id: 'q2-4',
        question: 'According to the episode, what is the biggest mistake entrepreneurs make when scaling?',
        difficulty: 'hard',
        options: [
          { id: 'opt4-1', text: 'Hiring too quickly without proper planning', isCorrect: true },
          { id: 'opt4-2', text: 'Not raising enough funding', isCorrect: false },
          { id: 'opt4-3', text: 'Focusing too much on marketing', isCorrect: false },
          { id: 'opt4-4', text: 'Not automating processes', isCorrect: false }
        ],
        explanation: 'Rapid hiring without proper planning and systems can lead to culture dilution and operational chaos.'
      },
      {
        id: 'q2-5',
        question: 'What trend in global business was predicted to grow significantly?',
        difficulty: 'medium',
        options: [
          { id: 'opt5-1', text: 'Sustainable and ESG-focused businesses', isCorrect: true },
          { id: 'opt5-2', text: 'Traditional manufacturing', isCorrect: false },
          { id: 'opt5-3', text: 'Brick-and-mortar retail only', isCorrect: false },
          { id: 'opt5-4', text: 'Single-market businesses', isCorrect: false }
        ],
        explanation: 'Environmental, Social, and Governance (ESG) focused businesses are gaining significant traction globally.'
      }
    ]
  },
  {
    id: 'quiz-3',
    podcastId: '3', // Mindful Health Journey
    title: 'Wellness & Mindfulness Quiz',
    description: 'Check your understanding of wellness practices and mental health strategies for a balanced life.',
    durationThreshold: 0.8,
    estimatedTime: 4,
    questions: [
      {
        id: 'q3-1',
        question: 'What is the recommended daily practice for maintaining mental wellness?',
        difficulty: 'easy',
        options: [
          { id: 'opt1-1', text: 'Mindfulness meditation for 10-15 minutes', isCorrect: true },
          { id: 'opt1-2', text: 'Intense exercise for 2 hours', isCorrect: false },
          { id: 'opt1-3', text: 'Avoiding all social interactions', isCorrect: false },
          { id: 'opt1-4', text: 'Watching TV for relaxation', isCorrect: false }
        ],
        explanation: 'Short daily mindfulness practices have been proven most effective for mental wellness.'
      },
      {
        id: 'q3-2',
        question: 'Which factor was identified as most important for quality sleep?',
        difficulty: 'medium',
        options: [
          { id: 'opt2-1', text: 'Room temperature and lighting', isCorrect: false },
          { id: 'opt2-2', text: 'Consistent sleep schedule and bedtime routine', isCorrect: true },
          { id: 'opt2-3', text: 'Expensive mattress and pillows', isCorrect: false },
          { id: 'opt2-4', text: 'Sleeping pills or supplements', isCorrect: false }
        ],
        explanation: 'Maintaining consistent sleep patterns and routines is more important than any single environmental factor.'
      },
      {
        id: 'q3-3',
        question: 'What was the recommended approach to managing stress?',
        difficulty: 'medium',
        options: [
          { id: 'opt3-1', text: 'Avoiding all stressful situations', isCorrect: false },
          { id: 'opt3-2', text: 'Identifying triggers and developing coping strategies', isCorrect: true },
          { id: 'opt3-3', text: 'Using only medication', isCorrect: false },
          { id: 'opt3-4', text: 'Ignoring stress completely', isCorrect: false }
        ],
        explanation: 'Understanding personal stress triggers and having healthy coping mechanisms is key to stress management.'
      },
      {
        id: 'q3-4',
        question: 'Which nutrition principle was emphasized for mental health?',
        difficulty: 'hard',
        options: [
          { id: 'opt4-1', text: 'The gut-brain connection and balanced microbiome', isCorrect: true },
          { id: 'opt4-2', text: 'Eating only organic foods', isCorrect: false },
          { id: 'opt4-3', text: 'Following strict dietary restrictions', isCorrect: false },
          { id: 'opt4-4', text: 'Taking multiple supplements', isCorrect: false }
        ],
        explanation: 'The connection between gut health and mental wellbeing through microbiome balance is increasingly recognized.'
      }
    ]
  },
  {
    id: 'quiz-4',
    podcastId: '4', // Comedy Central Nights
    title: 'Comedy & Entertainment Quiz',
    description: 'Test your knowledge about comedy, entertainment industry insights, and humor psychology.',
    durationThreshold: 0.8,
    estimatedTime: 5,
    questions: [
      {
        id: 'q4-1',
        question: 'What makes a joke universally funny according to the comedians?',
        difficulty: 'medium',
        options: [
          { id: 'opt1-1', text: 'Timing and relatability', isCorrect: true },
          { id: 'opt1-2', text: 'Being offensive or controversial', isCorrect: false },
          { id: 'opt1-3', text: 'Using complex wordplay', isCorrect: false },
          { id: 'opt1-4', text: 'Making fun of others', isCorrect: false }
        ],
        explanation: 'Good timing and universal relatability are the foundation of effective humor.'
      },
      {
        id: 'q4-2',
        question: 'What was mentioned as the biggest challenge for new comedians?',
        difficulty: 'easy',
        options: [
          { id: 'opt2-1', text: 'Getting stage time and building confidence', isCorrect: true },
          { id: 'opt2-2', text: 'Writing new material', isCorrect: false },
          { id: 'opt2-3', text: 'Dealing with hecklers', isCorrect: false },
          { id: 'opt2-4', text: 'Learning to use microphones', isCorrect: false }
        ],
        explanation: 'Getting opportunities to perform and building stage confidence are the primary hurdles for new comedians.'
      },
      {
        id: 'q4-3',
        question: 'How has social media changed the comedy industry?',
        difficulty: 'medium',
        options: [
          { id: 'opt3-1', text: 'It has made traditional venues obsolete', isCorrect: false },
          { id: 'opt3-2', text: 'It provides new platforms for discovery and audience building', isCorrect: true },
          { id: 'opt3-3', text: 'It has made comedy less popular', isCorrect: false },
          { id: 'opt3-4', text: 'It only benefits established comedians', isCorrect: false }
        ],
        explanation: 'Social media has democratized comedy by providing new ways for comedians to find audiences and get discovered.'
      },
      {
        id: 'q4-4',
        question: 'What was identified as the key to maintaining longevity in comedy?',
        difficulty: 'hard',
        options: [
          { id: 'opt4-1', text: 'Constantly evolving and staying authentic to your voice', isCorrect: true },
          { id: 'opt4-2', text: 'Sticking to the same successful formula', isCorrect: false },
          { id: 'opt4-3', text: 'Only performing in major cities', isCorrect: false },
          { id: 'opt4-4', text: 'Avoiding controversial topics completely', isCorrect: false }
        ],
        explanation: 'Successful comedians balance evolution with authenticity, keeping their unique voice while adapting to changing times.'
      }
    ]
  },
  {
    id: 'quiz-5',
    podcastId: '5', // History Uncovered
    title: 'Historical Insights Quiz',
    description: 'Explore your knowledge of historical events, forgotten stories, and the people who shaped our world.',
    durationThreshold: 0.8,
    estimatedTime: 6,
    questions: [
      {
        id: 'q5-1',
        question: 'What was emphasized as the most important skill for understanding history?',
        difficulty: 'medium',
        options: [
          { id: 'opt1-1', text: 'Memorizing dates and names', isCorrect: false },
          { id: 'opt1-2', text: 'Understanding context and cause-and-effect relationships', isCorrect: true },
          { id: 'opt1-3', text: 'Reading only primary sources', isCorrect: false },
          { id: 'opt1-4', text: 'Focusing on political events only', isCorrect: false }
        ],
        explanation: 'Understanding historical context and how events connect to each other provides deeper insights than memorization.'
      },
      {
        id: 'q5-2',
        question: 'Which historical period was described as most transformative for modern society?',
        difficulty: 'easy',
        options: [
          { id: 'opt2-1', text: 'The Industrial Revolution', isCorrect: true },
          { id: 'opt2-2', text: 'The Renaissance', isCorrect: false },
          { id: 'opt2-3', text: 'The Roman Empire', isCorrect: false },
          { id: 'opt2-4', text: 'The Medieval Period', isCorrect: false }
        ],
        explanation: 'The Industrial Revolution fundamentally changed how we live, work, and organize society.'
      },
      {
        id: 'q5-3',
        question: 'What approach was recommended for learning about historical figures?',
        difficulty: 'medium',
        options: [
          { id: 'opt3-1', text: 'Focus only on their achievements', isCorrect: false },
          { id: 'opt3-2', text: 'Understand them as complex individuals in their historical context', isCorrect: true },
          { id: 'opt3-3', text: 'Judge them by modern standards', isCorrect: false },
          { id: 'opt3-4', text: 'Only study their public lives', isCorrect: false }
        ],
        explanation: 'Historical figures should be understood as complex people within their time period, not judged solely by modern standards.'
      },
      {
        id: 'q5-4',
        question: 'Why was it mentioned that studying forgotten histories is important?',
        difficulty: 'hard',
        options: [
          { id: 'opt4-1', text: 'It provides a more complete and diverse understanding of the past', isCorrect: true },
          { id: 'opt4-2', text: 'It is easier to research', isCorrect: false },
          { id: 'opt4-3', text: 'It is more entertaining', isCorrect: false },
          { id: 'opt4-4', text: 'It requires less critical thinking', isCorrect: false }
        ],
        explanation: 'Forgotten histories often include marginalized voices and perspectives that provide a more complete picture of the past.'
      },
      {
        id: 'q5-5',
        question: 'What was identified as history\'s greatest lesson for modern times?',
        difficulty: 'medium',
        options: [
          { id: 'opt5-1', text: 'That patterns repeat but contexts change', isCorrect: true },
          { id: 'opt5-2', text: 'That nothing ever changes', isCorrect: false },
          { id: 'opt5-3', text: 'That progress is always linear', isCorrect: false },
          { id: 'opt5-4', text: 'That technology solves all problems', isCorrect: false }
        ],
        explanation: 'Historical patterns do repeat, but the specific contexts and details change, requiring adaptation rather than exact replication of solutions.'
      }
    ]
  },
  {
    id: 'quiz-6',
    podcastId: '6', // Creative Minds Collective
    title: 'Creativity & Arts Quiz',
    description: 'Test your understanding of the creative process, artistic development, and unlocking creative potential.',
    durationThreshold: 0.8,
    estimatedTime: 5,
    questions: [
      {
        id: 'q6-1',
        question: 'What was identified as the biggest barrier to creativity?',
        difficulty: 'easy',
        options: [
          { id: 'opt1-1', text: 'Fear of failure and self-doubt', isCorrect: true },
          { id: 'opt1-2', text: 'Lack of talent', isCorrect: false },
          { id: 'opt1-3', text: 'Not having enough resources', isCorrect: false },
          { id: 'opt1-4', text: 'Limited time', isCorrect: false }
        ],
        explanation: 'Fear of failure and self-doubt prevent more people from expressing their creativity than lack of talent or resources.'
      },
      {
        id: 'q6-2',
        question: 'Which practice was most recommended for developing creativity?',
        difficulty: 'medium',
        options: [
          { id: 'opt2-1', text: 'Copying other artists exactly', isCorrect: false },
          { id: 'opt2-2', text: 'Daily creative practice, even if small', isCorrect: true },
          { id: 'opt2-3', text: 'Waiting for inspiration to strike', isCorrect: false },
          { id: 'opt2-4', text: 'Only working on large projects', isCorrect: false }
        ],
        explanation: 'Consistent daily practice, even in small amounts, builds creative skills and habits more effectively than sporadic bursts.'
      },
      {
        id: 'q6-3',
        question: 'How should artists approach criticism of their work?',
        difficulty: 'medium',
        options: [
          { id: 'opt3-1', text: 'Ignore all criticism completely', isCorrect: false },
          { id: 'opt3-2', text: 'Accept constructive feedback while staying true to their vision', isCorrect: true },
          { id: 'opt3-3', text: 'Change their work based on every comment', isCorrect: false },
          { id: 'opt3-4', text: 'Only listen to other artists', isCorrect: false }
        ],
        explanation: 'The key is discerning between constructive feedback that helps growth and criticism that undermines creative vision.'
      },
      {
        id: 'q6-4',
        question: 'What was mentioned as essential for a sustainable creative career?',
        difficulty: 'hard',
        options: [
          { id: 'opt4-1', text: 'Balancing artistic integrity with commercial viability', isCorrect: true },
          { id: 'opt4-2', text: 'Never compromising on artistic vision', isCorrect: false },
          { id: 'opt4-3', text: 'Only creating commercially popular work', isCorrect: false },
          { id: 'opt4-4', text: 'Avoiding all business aspects', isCorrect: false }
        ],
        explanation: 'Successful creative careers require finding a balance between maintaining artistic integrity and creating commercially viable work.'
      }
    ]
  },
  {
    id: 'quiz-7',
    podcastId: '7', // Science Simplified
    title: 'Science & Discovery Quiz',
    description: 'Challenge your understanding of scientific concepts, research discoveries, and complex theories made simple.',
    durationThreshold: 0.8,
    estimatedTime: 6,
    questions: [
      {
        id: 'q7-1',
        question: 'What was emphasized as the most important aspect of scientific thinking?',
        difficulty: 'medium',
        options: [
          { id: 'opt1-1', text: 'Memorizing facts and formulas', isCorrect: false },
          { id: 'opt1-2', text: 'Questioning assumptions and testing hypotheses', isCorrect: true },
          { id: 'opt1-3', text: 'Accepting established theories without doubt', isCorrect: false },
          { id: 'opt1-4', text: 'Using complex terminology', isCorrect: false }
        ],
        explanation: 'Scientific thinking is fundamentally about questioning, testing, and being open to changing our understanding based on evidence.'
      },
      {
        id: 'q7-2',
        question: 'Which scientific breakthrough was highlighted as most impactful for daily life?',
        difficulty: 'easy',
        options: [
          { id: 'opt2-1', text: 'Antibiotics and modern medicine', isCorrect: true },
          { id: 'opt2-2', text: 'Space exploration', isCorrect: false },
          { id: 'opt2-3', text: 'Quantum physics', isCorrect: false },
          { id: 'opt2-4', text: 'Theoretical mathematics', isCorrect: false }
        ],
        explanation: 'Medical advances, particularly antibiotics, have had the most direct and widespread impact on human daily life and longevity.'
      },
      {
        id: 'q7-3',
        question: 'What approach was recommended for understanding complex scientific concepts?',
        difficulty: 'medium',
        options: [
          { id: 'opt3-1', text: 'Starting with basic principles and building up', isCorrect: true },
          { id: 'opt3-2', text: 'Jumping straight to advanced topics', isCorrect: false },
          { id: 'opt3-3', text: 'Avoiding mathematics completely', isCorrect: false },
          { id: 'opt3-4', text: 'Only reading popular science books', isCorrect: false }
        ],
        explanation: 'Building understanding from fundamental principles creates a solid foundation for grasping more complex concepts.'
      },
      {
        id: 'q7-4',
        question: 'Why is it important for non-scientists to understand basic scientific principles?',
        difficulty: 'hard',
        options: [
          { id: 'opt4-1', text: 'To make informed decisions about health, environment, and technology', isCorrect: true },
          { id: 'opt4-2', text: 'To become professional scientists', isCorrect: false },
          { id: 'opt4-3', text: 'To win arguments with others', isCorrect: false },
          { id: 'opt4-4', text: 'To appear more intelligent', isCorrect: false }
        ],
        explanation: 'Scientific literacy helps people make better decisions about their health, understand environmental issues, and evaluate new technologies.'
      },
      {
        id: 'q7-5',
        question: 'What was mentioned as the biggest misconception about science?',
        difficulty: 'medium',
        options: [
          { id: 'opt5-1', text: 'That it provides absolute, unchanging truths', isCorrect: true },
          { id: 'opt5-2', text: 'That it is too difficult for most people', isCorrect: false },
          { id: 'opt5-3', text: 'That it is not relevant to daily life', isCorrect: false },
          { id: 'opt5-4', text: 'That it requires expensive equipment', isCorrect: false }
        ],
        explanation: 'Science is a process of building the best current understanding, which can change as new evidence emerges.'
      }
    ]
  },
  {
    id: 'quiz-8',
    podcastId: '8', // True Crime Chronicles
    title: 'Criminal Psychology & Investigation Quiz',
    description: 'Test your knowledge of criminal psychology, investigative techniques, and the pursuit of justice.',
    durationThreshold: 0.8,
    estimatedTime: 7,
    questions: [
      {
        id: 'q8-1',
        question: 'What was identified as the most important skill for criminal investigators?',
        difficulty: 'medium',
        options: [
          { id: 'opt1-1', text: 'Physical strength and intimidation', isCorrect: false },
          { id: 'opt1-2', text: 'Attention to detail and pattern recognition', isCorrect: true },
          { id: 'opt1-3', text: 'Advanced technology knowledge', isCorrect: false },
          { id: 'opt1-4', text: 'Legal expertise', isCorrect: false }
        ],
        explanation: 'The ability to notice details others miss and recognize patterns is crucial for connecting evidence and solving cases.'
      },
      {
        id: 'q8-2',
        question: 'Which factor was mentioned as most important in criminal profiling?',
        difficulty: 'easy',
        options: [
          { id: 'opt2-1', text: 'Understanding the psychology behind criminal behavior', isCorrect: true },
          { id: 'opt2-2', text: 'Physical evidence alone', isCorrect: false },
          { id: 'opt2-3', text: 'Eyewitness testimony', isCorrect: false },
          { id: 'opt2-4', text: 'Criminal records only', isCorrect: false }
        ],
        explanation: 'Understanding why criminals act the way they do helps investigators predict behavior and narrow down suspects.'
      },
      {
        id: 'q8-3',
        question: 'What was emphasized about the role of forensic science in investigations?',
        difficulty: 'medium',
        options: [
          { id: 'opt3-1', text: 'It always provides definitive answers', isCorrect: false },
          { id: 'opt3-2', text: 'It is one tool among many that requires interpretation', isCorrect: true },
          { id: 'opt3-3', text: 'It is not reliable enough to use', isCorrect: false },
          { id: 'opt3-4', text: 'It should be the only evidence considered', isCorrect: false }
        ],
        explanation: 'Forensic science provides valuable evidence but must be interpreted correctly and combined with other investigative methods.'
      },
      {
        id: 'q8-4',
        question: 'What was mentioned as a common mistake in criminal investigations?',
        difficulty: 'hard',
        options: [
          { id: 'opt4-1', text: 'Tunnel vision and confirmation bias', isCorrect: true },
          { id: 'opt4-2', text: 'Collecting too much evidence', isCorrect: false },
          { id: 'opt4-3', text: 'Interviewing too many witnesses', isCorrect: false },
          { id: 'opt4-4', text: 'Using modern technology', isCorrect: false }
        ],
        explanation: 'Focusing too narrowly on one theory or suspect and ignoring contradictory evidence can lead to wrongful convictions.'
      },
      {
        id: 'q8-5',
        question: 'Why is understanding victim psychology important in criminal cases?',
        difficulty: 'medium',
        options: [
          { id: 'opt5-1', text: 'It helps understand why they were targeted and aids in finding the perpetrator', isCorrect: true },
          { id: 'opt5-2', text: 'It helps blame the victim', isCorrect: false },
          { id: 'opt5-3', text: 'It is not important at all', isCorrect: false },
          { id: 'opt5-4', text: 'It only matters for certain types of crimes', isCorrect: false }
        ],
        explanation: 'Understanding victim selection can reveal patterns about the perpetrator and help predict future behavior or identify suspects.'
      }
    ]
  }
];