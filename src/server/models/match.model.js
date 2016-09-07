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
    default: Date.now,
  },
  response_date: Date,
  //status of match {pending:2, accepted:1, rejected:0}
  status: {
    type: Number,
    default: 2,
  },

});

export default mongoose.model('match', matchSchema);
