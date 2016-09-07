import mongoose from 'mongoose';

const Answer = mongoose.model('answer');
const Survey = mongoose.model('survey');
const User = mongoose.model('user');

let successResult = {
  success_code: 1,
};

let failureResult = {
  success_code: 0,
  err_point: null,
  err_msg: null,
};

let surveyQuestion = {
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
};

// Get request
export function getRequest(req, res, next) {
  let t = Math.random() * 100; // random number between 0 ~ 101
  if (t > -1) {
    let survey_id;
    if ( req.params.type == 'mentee') {
      survey_id = 'A001-1';
      getSurvey(res, survey_id);
    } else {
      survey_id = 'B001-1';
      getSurvey(res, survey_id);
    }
  } else {
    successResult.success_code = 2;
    successResult.msg = 'Not in the sample boundary';
    res.json(successResult);
  }
}

// Send survey
export function getSurvey(res, survey_id) {
  Survey.find({ survey_id: survey_id }, (err, surveyItem) => {
      if (err) {
        failureResult.err_point = 'Survey - getSurvey';
        failureResult.err_msg = err;
        res.json(failureResult);
      } else {
        successResult.survey_id = survey_id;
        successResult.questions = surveyItem.questions;
        res.json(surveyItem);
      }
    }
  );
}

// Get answer
export function saveAnswer(req, res, next) {
  // If merge only-accesstoken req.session.email => req.session._id
  if (req.session.email) {
    let answer = new Answer();
    answer.survey_id = req.body.survey_id;
    answer.questions = req.body.questions;
    User.findOne({ email: req.session.email }, (err, user)=>{
      if (err) {
        failureResult.err_point = 'Survey - findUserSession with email';
        failureResult.err_msg = err;
        res.json(failureResult);
      } else {
        answer.user_id = user._id;
      }
    });
  
    answer.save((err, answerItem) => {
      if (err) {
        failureResult.err_point = 'Survey - saveAnswer';
        failureResult.err_msg = err;
        res.json(failureResult);
      } else {
        successResult.survey_id = answerItem.survey_id;
        successResult.user_id = answerItem.user_id;
        successResult.questions = answerItem.questions;
        res.json(successResult);
      }
    });
  } else {
    res.status(400).json();
  }
}

// Save question
export function saveQuestion(req, res, next) {
  let survey = new Survey({
    survey_id: surveyQuestion.survey_id,
    questions: surveyQuestion.questions,
  });
  survey.save((err) => {
    if (err) {
      failureResult.err_point = 'Survey - saveQuestion';
      failureResult.err_msg = err;
      res.json(failureResult);
    } else {
      res.json(successResult);
    }
  });
}
