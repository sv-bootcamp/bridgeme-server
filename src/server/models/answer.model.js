import mongoose from 'mongoose';

/*
 * Define the schema model for survey answer.
 */

const Schema = mongoose.Schema;
let answerSchema = new Schema({
  survey_id: String,
  user_id: Schema.Types.ObjectId,
  questions: [
    {
      question_index: Number,
      question: String,
      answers: [
        {
          answer_index: Number,
          content: String,
        },
      ],
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

answerSchema.set('toJSON', {
  getters: true,  // Bring all elements include virtuals.
  virtuals: true,  // Set all virtuals show up in the console.log output.
});

export default mongoose.model('answer', answerSchema);
