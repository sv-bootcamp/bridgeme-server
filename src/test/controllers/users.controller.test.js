'use strict';

import sampleUser from '../fixtures/loggedInUserData';
import '../../server/models/users.model';

/*
 * Test for users.controller.
 */

let assert = require('assert');
let should = require('should');
let user = require('mongoose').model('user');

describe('Test for users.controller', function() {
  describe('#getMentorList()', function() {
    it('should create a new User with fake session', function (done) {
      var u = sampleUser.loggedInUserData;
      user.create(u, function (err, createdUser) {
        should.not.exist(err);
        createdUser.name.should.equal('session');
        // TODO: Add a test to access getMentorList method.
        // TODO: Add a test to check for non-existent user session.
        // TODO: Add a test to check if all users are returned except the user in the session.
        createdUser.remove();
        done();
      });
    });
  });
});
