import mongoose from 'mongoose';
import surveyCallback from '../config/json/survey.callback';
import userCallback from '../config/json/user.callback';

/*
 * Methods about Eval Framework, save or return survey/answer
 */

const Answer = mongoose.model('answer');
const Survey = mongoose.model('survey');
const User = mongoose.model('user');

// Get request
export function getRequest(req, res, next) {
  if (req.session._id) {
    let n = Math.random() * 100; // random number between 0 ~ 101
    let t = -1;
    // TODO: traffic management
    // In this version we send survey to all user.
    // after launch we can manage traffic by setting t.
    if (n > t) {
      let surveyId;
      if (req.params.type == 'mentee') {
        surveyId = 'A001-1';
        getSurvey(res, surveyId);
      } else if (req.params.type == 'mentor') {
        surveyId = 'B001-1';
        getSurvey(res, surveyId);
      } else {
        res.status(400).json({ err_point: surveyCallback.ERR_INVALID_PARAMS });
      }
    } else {
      res.status(204).json();  // 204: No content
    }
  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
}

// Send survey
function getSurvey(res, surveyId) {
  Survey.findOne({ survey_id: surveyId }, (err, surveyItem) => {
    if (err) {
      res.status(400).json({ err_point: surveyCallback.ERR_GET_SURVEY, err_msg: err });
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

    User.findOne({ _id: req.session._id }, (err, user) => {
      if (err) {
        res.status(400).json({ err_point: surveyCallback.ERR_USER_NOT_FOUND, err_msg: err });
      } else {
        answer.user_id = user._id;
        answer.save((err, answerItem) => {
          if (err) {
            res.status(400).json({ err_point: surveyCallback.ERR_SAVE_ANSWER, err_msg: err });
          } else {
            res.status(200).json({ survey_id: answerItem.survey_id });
          }
        });
      }
    });

  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
}

// Save question
export function saveSurvey(req, res, next) {
  if (req.session._id) {
    let survey = new Survey({
      survey_id: req.params.surveyQuestion.survey_id,
      questions: req.params.surveyQuestion.questions,
    });

    if (survey.survey_id == null || survey.questions == null) {
      res.status(400).json({
        err_point: surveyCallback.ERR_SAVE_QUESTION,
        err_msg: surveyCallback.ERR_INVALID_PARAMS,
      });
    } else {
      survey.save((err, surveyItem) => {
        if (err) {
          res.status(400).json({ err_point: surveyCallback.ERR_SAVE_QUESTION, err_msg: err });
        } else {
          res.status(200).json({ survey_id: surveyItem.survey_id });
        }
      });
    }
  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
}
