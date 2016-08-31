'use strict';

import mongoose from 'mongoose';

/*
 * Define the schema model for user.
 */

const Schema = mongoose.Schema;
let userSchema = new Schema({
  email: String,
  name: String,
  age: Number,
  field: String,
  region: String,
  skills: String,
  company: String,
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
