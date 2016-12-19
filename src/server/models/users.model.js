import mongoose from 'mongoose';

/*
 * Define the schema model for user.
 */
const Schema = mongoose.Schema;

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
  startYear: {
    name: String,
  },
  year: {
    name: String,
  },
});

const experienceSchema = new Schema({
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

const careerSchema = new Schema({
  area: String,
  role: String,
  years: String,
  education_background: String,
});

const expertiseSchema = new Schema({
  select: String,
  index: Number,
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
  password: String,
  name: String,
  education: [educationSchema],
  experience: [experienceSchema],
  work: [experienceSchema],
  career: [careerSchema],
  expertise: [expertiseSchema],
  personality: [personalitySchema],
  locale: String,
  age: Number,
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
  mentorMode: Boolean,
  deviceToken: Array,
  reg_date: {
    type: Date,
    default: Date.now,
  },
  stamp_login: {
    type: Date,
  },
});

export default mongoose.model('user', userSchema);
