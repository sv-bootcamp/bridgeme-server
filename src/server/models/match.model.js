import mongoose from 'mongoose';
import matchSchema from './schema/match.schema';

const staticFunc = {};

matchSchema.statics = staticFunc;

export default mongoose.model('match', matchSchema);
