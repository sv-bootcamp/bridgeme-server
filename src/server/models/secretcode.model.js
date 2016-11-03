import mongoose from 'mongoose';

/*
 * Define the schema model for survey.
 */

const Schema = mongoose.Schema;
let secretCodeSchema = new Schema({
  email: String,
  secretCode: String,
  regDate: {
    type: Date,
    default: Date.now,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
});

secretcodeSchema.set('toJSON', {
  getters: true,  // Bring all elements include virtuals.
  virtuals: true,  // Set all virtuals show up in the console.log output.
});

export default mongoose.model('secretCode', secretCodeSchema);
