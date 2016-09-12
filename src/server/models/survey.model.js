import mongoose from 'mongoose';

/*
 * Define the schema model for survey.
 */

const Schema = mongoose.Schema;
let surveySchema = new Schema({
  survey_id: String,
  questions: [
    {
      question_index: Number,
      question: String,
      allow_multiple_answer: Boolean,
      answers: [
        {
          title: String,
          options: [
            {
              answer_index: Number,
              is_free_form: Boolean, // true: description
              content: String,
              next_question_index: Number, // NULL: this is last question
            },
          ],
        },
      ],
    },
  ],
});

surveySchema.set('toJSON', {
  getters: true,  // Bring all elements include virtuals.
  virtuals: true,  // Set all virtuals show up in the console.log output.
});

export default mongoose.model('survey', surveySchema);
