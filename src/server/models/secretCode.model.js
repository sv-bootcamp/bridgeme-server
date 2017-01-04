import mongoose from 'mongoose';
import secretCodeSchema from './schema/secretCode.schema';

const staticFunc = {};

secretCodeSchema.statics = staticFunc;

export default mongoose.model('secretCode', secretCodeSchema);
