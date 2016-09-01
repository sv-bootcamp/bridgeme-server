import assert from 'assert';
import requestah from 'requestah';
import sampleUser from '../fixtures/loggedInUserData';
import should from 'should';
import mockData from '../fixtures/mockData.js';
import mongoose from 'mongoose';
import '../../server/models/users.model';

/*
 * Test for users.controller.
 */

const User = mongoose.model('user');
let r = requestah(8000);
let _id;

describe('Test for users.controller', function () {
  describe('#getMentorList()', function () {
    it('should create a new User with fake session', function (done) {
      let u = sampleUser.loggedInUserData;
      User.create(u, function (err, createdUser) {
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

  describe('#getAll()', function () {
    // TODO: Add a test to getAll method.
  });

  describe('#getMyProfile()', function () {
    // TODO: Add a test to getMyProfile method.
  });

  describe('#getProfileById()', function () {
    // TODO: Add a test to getProfileById method.
  });

  describe('#registerUser()', function () {
    // TODO: Add a test to registerUser method.
  });
});
