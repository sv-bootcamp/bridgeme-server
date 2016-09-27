export default {
  surveyB001_1: {
    survey_id: 'B001-1',
    questions: [
      {
        question_index: 0,
        question: 'Why did you accept this person as a mentee?',
        allow_multiple_answer: true,
        answers: [
          {
            options: [
              {
                answer_index: 0,
                is_free_form: false,
                content: 'Profession (experience, jobs)',
                next_question_index: 1,
              },
              {
                answer_index: 1,
                is_free_form: false,
                content: 'Education',
                next_question_index: 1,
              },
              {
                answer_index: 2,
                is_free_form: false,
                content: 'Profile Pic 사진',
                next_question_index: 1,
              },
              {
                answer_index: 3,
                is_free_form: false,
                content: 'Gender 성별',
                next_question_index: 1,
              },
              {
                answer_index: 4,
                is_free_form: false,
                content: 'Message: Contents od Mentee message',
                next_question_index: 1,
              },
              {
                answer_index: 5,
                is_free_form: false,
                content: 'No special reason',
                next_question_index: 1,
              },
            ],
          },
        ],
      },
      {
        question_index: 1,
        question: 'What kind of advices do you expect to give Mentee?',
        allow_multiple_answer: true,
        answers: [
          {
            options: [
              {
                answer_index: 0,
                is_free_form: false,
                content: 'Study abroad',
                next_question_index: 2,
              },
              {
                answer_index: 1,
                is_free_form: false,
                content: 'Getting a job/Moving a job',
                next_question_index: 2,
              },
              {
                answer_index: 2,
                is_free_form: false,
                content: 'Foundation',
                next_question_index: 2,
              },
              {
                answer_index: 3,
                is_free_form: false,
                content: 'Life Advices',
                next_question_index: 2,
              },
              {
                answer_index: 4,
                is_free_form: false,
                content: 'Networking',
                next_question_index: 2,
              },
              {
                answer_index: 5,
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
                next_question_index: 3,
              },
              {
                answer_index: 1,
                is_free_form: false,
                content: 'Video Chat',
                next_question_index: 3,
              },
              {
                answer_index: 2,
                is_free_form: false,
                content: 'Voice Chat',
                next_question_index: 3,
              },
              {
                answer_index: 3,
                is_free_form: false,
                content: 'Email',
                next_question_index: 3,
              },
              {
                answer_index: 4,
                is_free_form: true,
                content: 'Other',
                next_question_index: 3,
              },
            ],
          },
        ],
      },
      {
        question_index: 3,
        question: 'Why do you offer mentoring?',
        allow_multiple_answer: true,
        answers: [
          {
            options: [
              {
                answer_index: 0,
                is_free_form: false,
                content: 'For social responsibility',
                next_question_index: 4,
              },
              {
                answer_index: 1,
                is_free_form: false,
                content: 'To get connection with other generation',
                next_question_index: 4,
              },
              {
                answer_index: 2,
                is_free_form: false,
                content: 'To get self satisfaction',
                next_question_index: 4,
              },
              {
                answer_index: 3,
                is_free_form: false,
                content: 'To meet new people',
                next_question_index: 4,
              },
              {
                answer_index: 4,
                is_free_form: true,
                content: 'Other',
                next_question_index: 4,
              },
            ],
          },
        ],
      },
      {
        question_index: 4,
        question: 'How many time will you allocate for mentoring in 1 week?',
        allow_multiple_answer: true,
        answer: [
          {
            options: [
              {
                answer_index: 0,
                is_free_form: false,
                content: '30 minites',
                next_question_index: null,
              },
              {
                answer_index: 1,
                is_free_form: false,
                content: '1 hour',
                next_question_index: null,
              },
              {
                answer_index: 2,
                is_free_form: false,
                content: '2 hours',
                next_question_index: null,
              },
              {
                answer_index: 3,
                is_free_form: false,
                content: 'Over 5 hours',
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
