import mongoose from 'mongoose';

const Survey = mongoose.model('survey');
const Answer = mongoose.model('answer');

// Return all users.
export function getSurvey(req, res, next) {
  
}

// Return all users.
export function saveAnswer(survey_id, is_multiple, options_num, options) {
  
}
