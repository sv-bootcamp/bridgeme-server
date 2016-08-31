'use strict';

import '../../server/models/users.model';

/*
 * Test for mongodb create.
 */

const should = require('should');
let user = require('mongoose').model('user');
let u = {
  name: 'yoda'
};

describe('Users: models', function () {
  describe('#create()', function () {
    it('should create a new User and remove', function (done) {
      // Create a User object to pass to User.create()
      user.create(u, function (err, createdUser) {
        should.not.exist(err);
        createdUser.name.should.equal('yoda');
        createdUser.remove();
        done();
      });
    });
  });
});
