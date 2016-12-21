import mongoose from 'mongoose';

/*
 * Define the schema model for filter usage history
 */

const Schema = mongoose.Schema;

let filterSchema = new Schema({
  user_id: Schema.Types.ObjectId,
  expertise: [expertiseSchema],
  career: {
    area: String,
    role: String,
    years: String,
    education_background: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const expertiseSchema = new Schema({
  select: String,
  index: Number,
});

filterSchema.set('toJSON', {
  getters: true,
  virtuals: true,
});

export default mongoose.model('filter', filterSchema);
