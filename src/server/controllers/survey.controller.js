import mongoose from 'mongoose';
import callbackMsg from '../config/json/survey.callback';

const Answer = mongoose.model('answer');
const Survey = mongoose.model('survey');
const User = mongoose.model('user');

// Get request
export function getRequest(req, res, next) {
  let t = Math.random() * 100; // random number between 0 ~ 101
  if (t > -1) {
    let surveyId;
    if (req.params.type == 'mentee') {
      surveyId = 'A001-1';
      getSurvey(res, surveyId);
    } else {
      surveyId = 'B001-1';
      getSurvey(res, surveyId);
    }
  } else {
    res.status(204).json();  // 204: No content
  }
}

// Send survey
export function getSurvey(res, surveyId) {
  Survey.find({ survey_id: surveyId }, (err, surveyItem) => {
    if (err) {
      res.status(400).json({ err_point: callbackMsg.ERR_GET_SURVEY, err_msg: err });
    } else {
      res.status(200).json(surveyItem);
    }
  });
}

// Get answer
export function saveAnswer(req, res, next) {
  if (req.session._id) {
    let answer = new Answer();
    answer.survey_id = req.body.survey_id;
    answer.questions = req.body.questions;
    User.findOne({ email: req.session.email }, (err, user) => {
      if (err) {
        res.status(400).json({ err_point: callbackMsg.ERR_GET_SURVEY, err_msg: err });
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
