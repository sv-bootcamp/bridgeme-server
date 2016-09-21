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
const FB_LONG_LIVED_ACCESS_TOKEN = 'EAAEKfDmZBjtkBACZCHUDBcU57UZCgoPNoVxtMUVcyIKzNIGzMZCXNONEubZCgjg7ZBVIZAWNZASiRekSEFeTK3mzVBoY7Wr26ji1Yq058pw1Yvz7QY0ZA1sTXlrQ1D4i6yq04FQLoSTkpWN2wrZCdmsCAZAcqUmvfTNpx0ZD';
const FB_LONG_LIVED_ACCESS_TOKEN_B = '';

describe('Test User controller', function () {
  describe('Signup & Signin facebook user.', function () {

    it(': Sign up invalid Facebook user.', function (done) {
      this.timeout(4000);
      var options = {
        method: 'POST',
        uri: API_BASE_URL + '/signin',
        form: {
          access_token: 'THIS IS INVALID ACCESS TOKEN',
          platform_type: '1',
        },
        resolveWithFullResponse: true,
        json: true,
      };

      rp(options)
        .then(function (result) {

        })
        .catch(function (err) {
          err.statusCode.should.equal(400);
          done();
        });
    });

    it(': Sign up valid Facebook user.', function (done) {
      this.timeout(4000);
      var options = {
        method: 'POST',
        uri: API_BASE_URL + '/signin',
        form: {
          access_token: FB_LONG_LIVED_ACCESS_TOKEN,
          platform_type: '1',
        },
        resolveWithFullResponse: true,
        json: true,
      };

      rp(options)
        .then(function (result) {
          result.statusCode.should.equal(201);
          done();
        })
        .catch(function (err) {
          console.log(err.statusCode);

        });
    });

    it(': Sign in valid Facebook user.', function (done) {
      this.timeout(4000);
      var options = {
        method: 'POST',
        uri: API_BASE_URL + '/signin',
        form: {
          access_token: FB_LONG_LIVED_ACCESS_TOKEN,
          platform_type: '1',
        },
        resolveWithFullResponse: true,
        json: true,
      };

      rp(options)
        .then(function (result) {
          result.statusCode.should.equal(200);
          result.body.msg.should.equal('Sign in success.');
          done();
        })
        .catch(function (err) {

        });
    });

  });


  //describe('register user', function () {
  //  it('should create a new User with fake session', done => {
  //    let u = sampleUser.loggedInUserData;
  //    User.create(u, function (err, createdUser) {
  //      should.not.exist(err);
  //      createdUser.name.should.equal('session');
  //      //controller.handle();
  //      // TODO: Add a test to access getMentorList method.
  //      // TODO: Add a test to check for non-existent user session.
  //      // TODO: Add a test to check if all users are returned except the user in the session.
  //      createdUser.remove();
  //      done();
  //    });
  //  });
  //});

  describe('register user', function () {
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
