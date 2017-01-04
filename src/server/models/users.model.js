import mongoose from 'mongoose';
import userSchema from './schema/users.schema';

const staticFunc = {
  findById: function (_id)  {
    return this.findOne({ _id: _id }).exec();
  },

  findByEmail: function (email) {
    return this.findOne({ email: email }).exec();
  },
};

userSchema.statics = staticFunc;

export default mongoose.model('user', userSchema);
