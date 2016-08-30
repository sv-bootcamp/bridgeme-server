'use strict';

/*
 * Test for mongodb create.
 */

var should = require('should');
var User = require('../../server/models/users.model');
const user = require('mongoose').model('user');

describe('Users: models', function () {
  describe('#create()', function () {
    it('should create a new User', function (done) {
      // Create a User object to pass to User.create()
      var u = {
        name: 'yoda'
      };
      user.create(u, function (err, createdUser) {
        should.not.exist(err);
        createdUser.name.should.equal('yoda');
        done();
      });
    });
  });
});
