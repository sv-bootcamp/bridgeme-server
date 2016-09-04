import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let userSchema = new Schema({
    userId: { type: String, unique: true },
    email: { type: String, unique: true },
    firstName: String,
    lastName: String,
    summary: String,
    platform_type: Number,
    platform_id: { type: String, unique: true },
    field: String,
    location: String,
    positions: Schema.Types.ObjectId,
    educations: Schema.Types.ObjectId,
    skills: Schema.Types.ObjectId,
    regDate: {
        type: Date,
        default: Date.now(),
      },
    profilePictureURL: String,
  });

userSchema.set('toJSON', {
    getters: true,  // bring all elements include virtuals
    virtuals: true,  // To have all virtuals show up in your console.log output
  });

export default mongoose.model('user', userSchema);
