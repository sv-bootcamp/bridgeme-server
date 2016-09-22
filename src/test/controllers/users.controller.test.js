import should from 'should';
import mongoose from 'mongoose';
import '../../server/models/users.model';
import userCallback from '../../server/config/json/user.callback';
import rp from 'request-promise';

/*
 * Test for User API
 */

const User = mongoose.model('user');
const API_BASE_URL = 'http://localhost:8000/users';
const FB_LONG_LIVED_ACCESS_TOKEN
  = 'EAAEKfDmZBjtkBACZCHUDBcU57UZCgoPNoVxtMUVcyIKzNIGzMZCXNONEubZCgjg7ZBVIZAWNZASiRekSEFeT' +
  'K3mzVBoY7Wr26ji1Yq058pw1Yvz7QY0ZA1sTXlrQ1D4i6yq04FQLoSTkpWN2wrZCdmsCAZAcqUmvfTNpx0ZD';
const FB_LONG_LIVED_ACCESS_TOKEN_B = '';

describe('Test User API', function () {
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
        .catch(function (err) {
          err.statusCode.should.equal(400);
          err.response.body.err_point.should.equal(userCallback.ERR_INVALID_ACCESS_TOKEN);
          done();
        });
    });

    it(': Sign up with Invalid platform type.', function (done) {
      this.timeout(4000);
      var options = {
        method: 'POST',
        uri: API_BASE_URL + '/signin',
        form: {
          access_token: 'THIS IS INVALID ACCESS TOKEN',
          platform_type: '123',
        },
        resolveWithFullResponse: true,
        json: true,
      };

      rp(options)
        .then(function (result) {
          should.fail('status code is not 400');
          done();
        })
        .catch(function (err) {

          err.statusCode.should.equal(400);
          err.response.body.err_point.should.equal(userCallback.ERR_INVALID_PLATFORM);
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
          should.fail('status code is not 201');
          done();

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
          should.fail('status code is not 200');
          done();

        });
    });
  });

  describe('Get all user`s prifile', function () {
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
