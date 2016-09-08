export default {
  surveyQuestion: {
    survey_id: 'A-001',
    questions: [
      {
        question_index: 1,
        question: '왜 수락해 주셨나요?',
        allow_multiple_answer: true,
        answers: [
          {
            answer_index: 0,
            is_free_form: false,
            content: '멘티가 마음에 들었다',
            next_question_index: 0,
          },
          {
            answer_index: 1,
            is_free_form: false,
            content: '봉사가 하고 싶어서',
            next_question_index: 1,
          },
          {
            answer_index: 2,
            is_free_form: true,
            next_question_index: null,
          },
        ],
      },
    ],
  },
  
};
