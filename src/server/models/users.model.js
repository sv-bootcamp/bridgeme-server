'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;
let userSchema = new Schema({
  email: { type: String, unique: true },
  platform_id: String,
  platform_type: Number,
  name: String,
  regDate: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.set('toJSON', {
  getters: true,  // bring all elements include virtuals
  virtuals: true,  // To have all virtuals show up in your console.log output
});

export default mongoose.model('user', userSchema);
