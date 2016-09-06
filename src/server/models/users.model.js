import mongoose from 'mongoose';

/*
 * Define the schema model for user.
 */

const Schema = mongoose.Schema;
let userSchema = new Schema({
  email: { type: String, unique: true },
  //Unique user id from platform.
  platform_id: String,
  //Which platform user is using.  1:Facebook 2: LinkedIn
  platform_type: Number,
  name: String,
  locale: String,
  age: Number,
  field: String,
  region: String,
  skills: String,
  company: String,
  timezone: Number,
  profile_picture: String,
  job_position: String,
  regDate: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.set('toJSON', {
  getters: true,  // Bring all elements include virtuals.
  virtuals: true,  // Set all virtuals show up in the console.log output.
});

export default mongoose.model('user', userSchema);
