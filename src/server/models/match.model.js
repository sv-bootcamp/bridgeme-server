'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let matchSchema = new Schema({
  mentorId: Schema.Types.ObjectId,
  menteeId: Schema.Types.ObjectId,
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
