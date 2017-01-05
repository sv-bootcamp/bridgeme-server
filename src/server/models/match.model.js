import mongoose from 'mongoose';
import matchSchema from './schema/match.schema';

const staticFunc = {
  findById: function (_id)  {
    return this.findOne({ _id: _id }).exec();
  },
};

matchSchema.statics = staticFunc;

export default mongoose.model('match', matchSchema);
