import menteeSurvey from '../config/json/surveyA001-1';
import mentorSurvey from '../config/json/surveyB001-1';
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
  let surveyId;
  determineUser()
    .then((isSample) => {
      if (isSample) {
        if (req.params.type == 'mentee') {
          res.status(200).json(menteeSurvey.data);
        } else if (req.params.type == 'mentor') {
          res.status(200).json(mentorSurvey.data);
        } else {
          throw new Error(surveyCallback.ERR_INVALID_PARAMS);
        }
      } else {
        res.status(204).json();
      }
    })
    .catch((err) => {
      res.status(400).json({ err_point: err.message, err_msg: err.stack });
    });
}

function determineUser() {
  // TODO: traffic management
  // In this version we send survey to all user.
  // after launch we can manage traffic by setting t.
  return new Promise((resolve, reject) => {
    let n = Math.random() * 100;
    let t = -1;
    if (n > t) {
      resolve(true);
    } else {
      reject(false);
    }
  });
}

// Get answer
export function saveAnswer(req, res, next) {
  let answer = new Answer();
  answer.survey_id = req.body.survey_id;
  answer.questions = req.body.questions;

  User.findOne({ _id: req.user._id }).exec()
    .then((userItem) => {
      if (userItem) {
        answer.user_id = userItem._id;
        return answer.save();
      } else {
        return new Error(surveyCallback.ERR_USER_NOT_FOUND);
      }
    })
    .then((answerItem) => {
      if (answerItem) {
        res.status(200).json({ survey_id: answerItem.survey_id });
      } else {
        return new Error(surveyCallback.ERR_SAVE_ANSWER);
      }
    })
    .catch((err) => {
      res.status(400).json({ err_point: err.message, err_msg: err.stack });
    });
}

// Save question
export function saveSurvey(req, res, next) {
  let survey = new Survey(req.body);

  if (survey.survey_id == undefined || survey.questions == undefined) {
    res.status(400).json({
      err_point: surveyCallback.ERR_SAVE_QUESTION,
      err_msg: surveyCallback.ERR_INVALID_PARAMS,
    });
  } else {
    survey.save((err, surveyItem) => {
      if (err) {
        res.status(400).json({ err_point: callbackMsg.ERR_SAVE_QUESTION, err_msg: err });
      } else {
        res.status(200).json({ survey_id: surveyItem.survey_id });
      }
    });
  }
}
