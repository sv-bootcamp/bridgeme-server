import mongoose from 'mongoose';
import answerSchema from './schema/answer.schema';

const staticFunc = {};

answerSchema.statics = staticFunc;

export default mongoose.model('answer', answerSchema);
