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
        type: Boolean,
        default: false,
    },
    acceptDate: Date,
    isCanceled: {
        type: Boolean,
        default: false,
    },
    cancelDate: Date,
});

matchSchema.set('toJSON', {
    getters: true,  // bring all elements include virtuals
    virtuals: true,  // To have all virtuals show up in your console.log output
  });

export default mongoose.model('match', matchSchema);
