import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let matchSchema = new Schema({
  mentor_id: {
    type: String,
    required: true,
  },
  mentee_id: {
    type: String,
    required: true,
  },
  requestDate: {
    type: Date,
    default: Date.now(),
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
  acceptDate: Date,
  isRejected: {
    type: Boolean,
    default: false,
  },
  rejectDate: Date,
});

matchSchema.set('toJSON', {
  getters: true,
  virtuals: true,
});

export default mongoose.model('match', matchSchema);
