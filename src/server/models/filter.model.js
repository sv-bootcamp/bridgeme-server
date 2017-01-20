import mongoose from 'mongoose';

/*
 * Define the schema model for filter search history
 */

const Schema = mongoose.Schema;

let filterSchema = new Schema({
  user_id: Schema.Types.ObjectId,
  expertise: Array,
  career: {
    area: Number,
    role: Number,
    years: Number,
    education_background: Number,
  },
  isLatest: Boolean,
  date: {
    type: Date,
    default: Date.now,
  },
});

filterSchema.set('toJSON', {
  getters: true,
  virtuals: true,
});

export default mongoose.model('filter', filterSchema);
