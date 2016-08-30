'use strict';

/*
 * Test for users.controller.
 */

import sampleUser from '../fixtures/loginedUser';

var should = require('should');
var User = require('../../server/models/users.model');
const user = require('mongoose').model('user');
let assert = require('assert');

// Test for getAll method.
describe('Test for users.controller', function() {
  describe('#getMentorList()', function() {
    it('should create a new User with session', function (done) {
      // Create a User object to pass to User.create()
      var u = sampleUser.loginedUserData;
      user.create(u, function (err, createdUser) {
        should.not.exist(err);
        createdUser.name.should.equal('session');
        done();
      });
    });
  
    it('should get all users except session user', function (done) {
      
    });
    // it('should return not exist because logined user', function() {
    //   assert.equal(-1, [1,2,3].indexOf(4));
    // });
  });
});
