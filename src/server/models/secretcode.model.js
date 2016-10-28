import mongoose from 'mongoose';

/*
 * Define the schema model for survey.
 */

const Schema = mongoose.Schema;
let secretcodeSchema = new Schema({
  email: String,
  secretcode: String,
});

secretcodeSchema.set('toJSON', {
  getters: true,  // Bring all elements include virtuals.
  virtuals: true,  // Set all virtuals show up in the console.log output.
});

export default mongoose.model('secretcode', secretcodeSchema);
