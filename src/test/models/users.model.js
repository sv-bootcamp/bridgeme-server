'use strict';

import '../../server/models/users.model';

/*
 * Test for mongodb create.
 */

let should = require('should');
let user = require('mongoose').model('user');

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
  
    it('should delete new User', function (done) {
      // Create a User object to pass to User.create()
      var u = {
        name: 'yoda'
      };
      user.find(u).remove(function() {
        done();
      });
    });
  });
});
