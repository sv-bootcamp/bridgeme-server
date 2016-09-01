import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let positionSchema = new Schema({
    name: String,
    summary: String,
    company: String,
    startDate: Date,
    endDate: Date,
    isCurrent: {
        type: Boolean,
        default: false,
    },
});

positionSchema.set('toJSON', {
    getters: true,  // bring all elements include virtuals
    virtuals: true,  // To have all virtuals show up in your console.log output
  });

export default mongoose.model('position', positionSchema);
