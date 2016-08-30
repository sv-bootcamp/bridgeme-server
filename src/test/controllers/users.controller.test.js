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
    it('should create a new User with email session', function (done) {
      var u = sampleUser.loginedUserData;
      user.create(u, function (err, createdUser) {
        should.not.exist(err);
        createdUser.name.should.equal('session');
        done();
      });
    });
  
    it('should delete new User with email session', function (done) {
      user.find({ name: 'session' }).remove(function() {
        done();
      });
    });
  });
});
