import mongoose from 'mongoose';
import filterSchema from './schema/filter.schema';

const staticFunc = {};

filterSchema.statics = staticFunc;

export default mongoose.model('filter', filterSchema);
