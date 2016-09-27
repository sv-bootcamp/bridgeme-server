export default {
  surveyA001_1: {
    survey_id: 'A001-1',
    questions: [
      {
        question_index: 0,
        question: 'Why did you pick this person as a Mentor?',
        allow_multiple_answer: true,
        answers: [
          {
            options: [
              {
                answer_index: 0,
                is_free_form: false,
                content: 'Education',
                next_question_index: 1,
              },
              {
                answer_index: 1,
                is_free_form: false,
                content: 'Profession (experience, jobs)',
                next_question_index: 1,
              },
              {
                answer_index: 2,
                is_free_form: false,
                content: 'Personality',
                next_question_index: 1,
              },
              {
                answer_index: 3,
                is_free_form: false,
                content: 'Approachable for communication',
                next_question_index: 1,
              },
              {
                answer_index: 4,
                is_free_form: true,
                content: 'Other',
                next_question_index: 1,
              },
            ],
          },
        ],
      },
      {
        question_index: 1,
        question: 'What kind of advices do you expect to get from this Mentor?',
        allow_multiple_answer: true,
        answers: [
          {
            title: 'Study abroad',
            options: [
              {
                answer_index: 0,
                is_free_form: false,
                content: 'Process (TOEFL/GRE, Statement of Purpose, GPA etc)',
                next_question_index: 2,
              },
              {
                answer_index: 1,
                is_free_form: false,
                content: 'Selecting School (Department, Professor, Awareness etc)',
                next_question_index: 2,
              },
            ],
          },
          {
            title: 'Getting a job/Moving a job',
            options: [
              {
                answer_index: 2,
                is_free_form: false,
                content: 'Process',
                next_question_index: 2,
              },
              {
                answer_index: 3,
                is_free_form: false,
                content: 'Selecting company',
                next_question_index: 2,
              },
              {
                answer_index: 4,
                is_free_form: false,
                content: 'Interview',
                next_question_index: 2,
              },
              {
                answer_index: 5,
                is_free_form: false,
                content: 'Salary negotiations - treatments/benefits',
                next_question_index: 2,
              },
              {
                answer_index: 6,
                is_free_form: false,
                content: 'Needed Skills',
                next_question_index: 2,
              },
            ],
          },
          {
            title: 'Foundation',
            options: [
              {
                answer_index: 7,
                is_free_form: false,
                content: 'How to start',
                next_question_index: 2,
              },
              {
                answer_index: 8,
                is_free_form: false,
                content: 'Products',
                next_question_index: 2,
              },
              {
                answer_index: 9,
                is_free_form: false,
                content: 'Market Trends',
                next_question_index: 2,
              },
              {
                answer_index: 10,
                is_free_form: false,
                content: 'Getting investments',
                next_question_index: 2,
              },
              {
                answer_index: 11,
                is_free_form: false,
                content: 'Team building',
                next_question_index: 2,
              },
            ],
          },
          {
            title: 'Life Advices',
            options: [
              {
                answer_index: 12,
                is_free_form: false,
                content: 'Motivation',
                next_question_index: 2,
              },
              {
                answer_index: 13,
                is_free_form: false,
                content: 'Career development (Promotion, Job conversion etc)',
                next_question_index: 2,
              },
            ],
          },
          {
            title: 'Networking',
            options: [
              {
                answer_index: 14,
                is_free_form: false,
                content: 'Technical methodology (e.g. LinkedIn)',
                next_question_index: 2,
              },
              {
                answer_index: 15,
                is_free_form: false,
                content: 'Maintenance & Management',
                next_question_index: 2,
              },
            ],
          },
          {
            options: [
              {
                answer_index: 16,
                is_free_form: true,
                content: 'Other',
                next_question_index: 2,
              },
            ],
          },
        ],
      },
      {
        question_index: 2,
        question: 'Which platform do you prefer for communication?',
        allow_multiple_answer: true,
        answers: [
          {
            options: [
              {
                answer_index: 0,
                is_free_form: false,
                content: 'Text Chat',
                next_question_index: null,
              },
              {
                answer_index: 1,
                is_free_form: false,
                content: 'Video Chat',
                next_question_index: null,
              },
              {
                answer_index: 2,
                is_free_form: false,
                content: 'Voice Chat',
                next_question_index: null,
              },
              {
                answer_index: 3,
                is_free_form: false,
                content: 'Email',
                next_question_index: null,
              },
              {
                answer_index: 4,
                is_free_form: true,
                content: 'Other',
                next_question_index: null,
              },
            ],
          },
        ],
      },
    ],
  },
};
