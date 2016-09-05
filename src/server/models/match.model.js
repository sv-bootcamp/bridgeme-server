import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let matchSchema = new Schema({
  mentor_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  mentee_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  request_date: {
    type: Date,
    default: Date.now(),
  },
  //status of match {pending:0, accepted:1, rejected:2}
  status: {
    type: Number,
    default: 2,
  },
  response_date: Date,
});

matchSchema.set('toJSON', {
  getters: true,
  virtuals: true,
});

export default mongoose.model('match', matchSchema);
