export default {
  surveyB001_1: {
    survey_id: 'B001-1',
    questions: [
      {
        question_index: 0,
        question: '왜 이 멘티의 요청을 수락했는가?',
        allow_multiple_answer: true,
        answers: [
          {
            options: [
              {
                answer_index: 0,
                is_free_form: false,
                content: '경력',
                next_question_index: 1,
              },
              {
                answer_index: 1,
                is_free_form: false,
                content: '학력',
                next_question_index: 1,
              },
              {
                answer_index: 2,
                is_free_form: false,
                content: '사진',
                next_question_index: 1,
              },
              {
                answer_index: 3,
                is_free_form: false,
                content: '성별',
                next_question_index: 1,
              },
              {
                answer_index: 4,
                is_free_form: false,
                content: '메시지: 멘티의 메시지의 내용',
                next_question_index: 1,
              },
              {
                answer_index: 5,
                is_free_form: false,
                content: '무조건적 수락 (특별한 이유 없음)',
                next_question_index: 1,
              },
            ],
          },
        ],
      },
      {
        question_index: 1,
        question: '이 멘티에게 어떤 종류의 조언을 해줄 수 있다고 예상하는가?',
        allow_multiple_answer: true,
        answers: [
          {
            options: [
              {
                answer_index: 0,
                is_free_form: false,
                content: '유학',
                next_question_index: 2,
              },
              {
                answer_index: 1,
                is_free_form: false,
                content: '취업/이직',
                next_question_index: 2,
              },
              {
                answer_index: 2,
                is_free_form: false,
                content: '창업',
                next_question_index: 2,
              },
              {
                answer_index: 3,
                is_free_form: false,
                content: '인생 조언',
                next_question_index: 2,
              },
              {
                answer_index: 4,
                is_free_form: false,
                content: '인맥 관리',
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
        question: '멘토링 소통 방식이 어떤 것이 좋은 가?',
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
        question: '멘토링을 제공하는 동기는?',
        allow_multiple_answer: true,
        answers: [
          {
            options: [
              {
                answer_index: 0,
                is_free_form: false,
                content: '사회적 책임감',
                next_question_index: 4,
              },
              {
                answer_index: 1,
                is_free_form: false,
                content: '후배 세대와의 소통',
                next_question_index: 4,
              },
              {
                answer_index: 2,
                is_free_form: false,
                content: '자기 만족',
                next_question_index: 4,
              },
              {
                answer_index: 3,
                is_free_form: false,
                content: '새로운 사람들과의 만남',
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
        question: '1주일에 얼마나 많은 시간을 멘토링에 투자하실 계획이십니까?',
        allow_multiple_answer: true,
        answer: [
          {
            options: [
              {
                answer_index: 0,
                is_free_form: false,
                content: '30분',
                next_question_index: null,
              },
              {
                answer_index: 1,
                is_free_form: false,
                content: '1시간',
                next_question_index: null,
              },
              {
                answer_index: 2,
                is_free_form: false,
                content: '2시간',
                next_question_index: null,
              },
              {
                answer_index: 3,
                is_free_form: false,
                content: '5시간 이상',
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
