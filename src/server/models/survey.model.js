import mongoose from 'mongoose';
import surveySchema from './schema/survey.schema';

const staticFunc = {};

surveySchema.statics = staticFunc;

export default mongoose.model('survey', surveySchema);
