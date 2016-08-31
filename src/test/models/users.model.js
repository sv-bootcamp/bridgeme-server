import should from 'should';
import mongoose from 'mongoose'
import '../../server/models/users.model';

/*
 * Test for mongodb create.
 */

const User = mongoose.model('user');
const u = {
  name: 'yoda'
};

describe('Users: models', function () {
  describe('#create()', function () {
    it('should create a new User and remove', function (done) {
      // Create a User object to pass to User.create()
      User.create(u, function (err, createdUser) {
        should.not.exist(err);
        createdUser.name.should.equal('yoda');
        createdUser.remove();
        done();
      });
    });
  });
});
