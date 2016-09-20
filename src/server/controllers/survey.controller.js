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
    determineUser()
      .then((isSample) => {
        if (isSample) {
          let surveyId;
          if (req.params.type == 'mentee') {
            surveyId = 'A001-1';
          } else if (req.params.type == 'mentor') {
            surveyId = 'B001-1';
          } else {
            throw new Error(surveyCallback.ERR_INVALID_PARAMS);
          }
          
          return Survey.findOne({ survey_id: surveyId }).exec();
        } else {
          res.status(204).json();
        }
      })
      .then((surveyItem) => {
        if (surveyItem)
          res.status(200).json(surveyItem);
        else {
          throw new Error(surveyCallback.ERR_SURVEY_NOT_FOUND);
        }
      })
      .catch((err) => {
        res.status(400).json({ err_point: err.message, err_msg: err.stack });
      });
  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
}

function determineUser(isSampleCallback) {
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
  if (req.session._id) {
    let answer = new Answer();
    answer.survey_id = req.body.survey_id;
    answer.questions = req.body.questions;

    User.findOne({ _id: req.session._id }).exec()
      .then((userItem) => {
        if (userItem) {
          answer.user_id = user._id;
          return answer.save().exec();
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
      survey.save().exec()
        .then((surveyItem) => {
          if (surveyItem) {
            res.status(200).json({ survey_id: surveyItem.survey_id });
          } else {
            throw new Error(surveyCallback.ERR_SAVE_QUESTION);
          }
        })
        .catch((err) => {
          res.status(400).json({ err_point: err.message, err_msg: err.stack });
        });
    }
  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
}
