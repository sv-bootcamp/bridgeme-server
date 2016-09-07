import should from 'should';
import mongoose from 'mongoose';
import '../../server/models/users.model';

/*
 * Test for mongodb create.
 */

const User = mongoose.model('user');
const u = {
  name: 'yoda',
};

describe('Users: models', function () {
});
