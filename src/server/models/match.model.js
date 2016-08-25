'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;
let matchSchema = new Schema({
  mentorId: String,
  menteeId: String,
  requestDate: {
    type: Date,
    default: Date.now(),
  },
  isAccepted: {
    type: Number,
    default: 0,
  },
  acceptDate: Date,
  isCanceled: {
    type: Number,
    default: 0,
  },
  cancelDate: Date,
});

matchSchema.set('toJSON', {
  getters: true,
  virtuals: true,
});

export default mongoose.model('match', matchSchema);
