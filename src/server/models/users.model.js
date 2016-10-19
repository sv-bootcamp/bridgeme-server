import mongoose from 'mongoose';

/*
 * Define the schema model for user.
 */
const Schema = mongoose.Schema;

const workSchema = new Schema({
  employer: {
    name: String,
  },
  location: {
    name: String,
  },
  position: {
    name: String,
  },
  start_date: String,
  end_date: String,
});

let concentrationSchema = new Schema({
  name: String,
});

let educationSchema = new Schema({
  school: {
    name: String,
  },
  concentration: [concentrationSchema],
  degree: {
    name: String,
  },
  type: String,
  location: {
    name: String,
  },
  year: {
    name: String,
  },
});

const jobSchema = new Schema({
  area: String,
  role: String,
  years: String,
  education_background: String,
});

const helpSchema = new Schema({
  select: String,
});

const personalitySchema = new Schema({
  option: String,
  score: Number,
});

let userSchema = new Schema({
  email: { type: String, unique: true },
  //Unique user id from platform.
  platform_id: String,
  //Which platform user is using.  1:Facebook 2: LinkedIn
  platform_type: Number,
  name: String,
  education: [educationSchema],
  work: [workSchema],
  job: [jobSchema],
  help: [helpSchema],
  personality: [personalitySchema],
  locale: String,
  age: Number,
  gender: String,
  location: String,
  field: String,
  region: String,
  skills: String,
  company: String,
  timezone: Number,
  profile_picture: String,
  job_position: String,
  about: String,
  languages: String,
  reg_date: {
    type: Date,
    default: Date.now,
  },
  stamp_login: {
    type: Date,
  },
});

export default mongoose.model('user', userSchema);
