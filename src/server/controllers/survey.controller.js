import mongoose from 'mongoose';

const Survey = mongoose.model('survey');
const Answer = mongoose.model('answer');

// Send survey
export function getSurvey(res, survey_id) {
  // Todo:
  // 1. find survey with survey_id
  // 2. res.json( survey content )
}

// Get answer
export function getAnswer(res, req, next) {
  // Todo:
  // 1.
  // 2.
}
