import mongoose from 'mongoose';

/*
 * Define the schema model for survey.
 */

const Schema = mongoose.Schema;
let surveySchema = new Schema({
  survey_id: String,
  question: String,
  is_multiple: Boolean, // 0: Single Choice, 1: Multiple Choice
  options_num: Number,
  options: [
    {
      id: Number,
      is_static: Boolean, // false: description
      content: String,
    },
  ],
});

surveySchema.set('toJSON', {
  getters: true,  // Bring all elements include virtuals.
  virtuals: true,  // Set all virtuals show up in the console.log output.
});

export default mongoose.model('survey', surveySchema);
