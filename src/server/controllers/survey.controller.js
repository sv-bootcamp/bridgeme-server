import mongoose from 'mongoose';

const Survey = mongoose.model('survey');
const Answer = mongoose.model('answer');

let successResult = {
  success_code: 1,
  survey_id: null,
  questions: null,
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

// Get request
export function getRequest(req, res, next) {
  let t = Math.random() * 100; // random number between 0 ~ 101
  if (t > -1) {
    getSurvey(res, req.params.survey_id);
  } else {
    failureResult.err_point = 'Survey - getRequest';
    failureResult.err_msg = err;
    res.json(failureResult);
  }
}

// Send survey
export function getSurvey(res, survey_id) {
  Survey.find((err, surveyItem) => {
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
export function saveAnswer(res, req, next) {
  //if (typeof req.session.access_token !== 'undefined'
  //  && req.session.access_token === req.query.access_token) {
    let answer = new Answer();
    // answer.survey_id = req.body.survey_id;
    // answer.user_id = res.session._id;
    // answer.questions = req.body.questions;
    let jsonObject = JSON.parse(req.body);
    console.log('*' + jsonObject);
    // console.log('**' + req.body.survey_id);
    
  
    answer.save((err, doc) => {
      if (err) {
        failureResult.err_point = 'Survey - getAnswer';
        failureResult.err_msg = err;
        res.json(failureResult);
      } else {
        res.json(successResult);
      }
    });
  //} else {
  //  res.status(400).json(authCallback.failAuth);
  //}
}
