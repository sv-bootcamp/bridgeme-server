import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let educationSchema = new Schema({
    schoolName: String,
    degree: String,
    startDate: Date,
    endDate: Date,
    fieldOfStudy: String,
    isLast: {
        type: Boolean,
        default: false,
    },
    location: String,
  });

educationSchema.set('toJSON', {
    getters: true,  // bring all elements include virtuals
    virtuals: true,  // To have all virtuals show up in your console.log output
  });

export default mongoose.model('education', educationSchema);
