import sampleUser from '../fixtures/loggedInUserData';
import should from 'should';
import controller from '../../server/controllers/users.controller';
import mockData from '../fixtures/mockData.js';
import mongoose from 'mongoose';
import '../../server/models/users.model';
import rp from 'request-promise';

/*
 * Test for users.controller.
 */

const User = mongoose.model('user');
const API_BASE_URL = 'http://localhost:8000/users';
const FB_LONG_LIVED_ACCESS_TOKEN = 'EAAaAu6BRYD4BALZCP5ZAREwtNVZA5sTLcsoEP0oG0gsrwA3ZCzxTPPQ5BMFfG44A9eRoUoZB00prufczZCylhIoujY14lV3NIGRCriZC5iBtpAj6ZA8pC8pjtC75ca9kS3FU3V31gBzotZAOJXhI0YDw4ZBzsHNkq7UsMZD';
const FB_LONG_LIVED_ACCESS_TOKEN_B = '';

describe('Test User controller', function () {
  describe('Signup & Signin facebook user.', function () {
// TODO: Add a test to Signup & Signin test.
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
