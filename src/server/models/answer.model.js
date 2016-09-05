import mongoose from 'mongoose';

/*
 * Define the schema model for survey answer.
 */

const Schema = mongoose.Schema;
let answerSchema = new Schema({
  survey_id: String,
  user_id: Schema.Types.ObjectId,
  options_num: Number,
  options: [
    {
      id: Number,
      is_static: Boolean, // false: description
      content: String,
    },
  ],
  reg_date: {
    type: Date,
    default: Date.now,
  },
});

answerSchema.set('toJSON', {
  getters: true,  // Bring all elements include virtuals.
  virtuals: true,  // Set all virtuals show up in the console.log output.
});

export default mongoose.model('answer', answerSchema);
