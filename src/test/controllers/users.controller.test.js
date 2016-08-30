'use strict';

import sampleUser from '../fixtures/loginedUser';
import '../../server/models/users.model';

/*
 * Test for users.controller.
 */

let assert = require('assert');
let should = require('should');
let user = require('mongoose').model('user');

// Test for getMentorList method.
describe('Test for users.controller', function() {
  describe('#getMentorList()', function() {
    it('should create a new User with fake session', function (done) {
      var u = sampleUser.loginedUserData;
      user.create(u, function (err, createdUser) {
        should.not.exist(err);
        createdUser.name.should.equal('session');
        done();
      });
    });
    
    // Need to access getMentorList method
    // Need to check not existing session user
    // Need to check existing all users except session user
  
    it('should delete new User with fake session', function (done) {
      user.find({ name: 'session' }).remove(function() {
        done();
      });
    });
  });
});
