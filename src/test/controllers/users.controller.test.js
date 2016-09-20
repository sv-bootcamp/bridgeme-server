import '../../server/models/users.model';
import * as controller from '../../server/controllers/users.controller';
import http_mocks from 'node-mocks-http';
import loggedInUserData from '../fixtures/loggedInUserData.js';
import mongoose from 'mongoose';
import should from 'should';

mongoose.Promise = require('bluebird');

/*
 * Test for users.controller.
 */

const User = mongoose.model('user');

function buildResponse() {
  return http_mocks.createResponse({ eventEmitter: require('events').EventEmitter });
}

describe('before test make one user', function () {
  it('save default user', function (done) {
    User.find({ name: 'session' }, (err, user) => {
      if (user == '') {
        let u = loggedInUserData.user;
        User.create(u, function (err, createdUser) {
          should.not.exist(err);
          createdUser.name.should.equal('session');
        });
      }

      done();
    });
  });
});

describe('Test for users.controller', function () {
  describe('#signIn()', function () {
    it('Invalid access_token test.', function (done) {
      let res = buildResponse();
      let req  = http_mocks.createRequest({
        method: 'POST',
        url: '/users/signIn',
      });

      req.body = {
        access_token: '',
        platform_type: '1',
      };

      res.on('end', function () {
        res._isJSON().should.be.true;

        let data = JSON.parse(res._getData());
        should.not.exist(data.err);
        data.err_point.should.equal('Invalid access_token.');
        done();
      });

      controller.signin(req, res);
    });

    // it('Valid access_token test.', function (done) {
    //   let res = buildResponse();
    //   let req  = http_mocks.createRequest({
    //     method: 'POST',
    //     url: '/users/signIn',
    //   });
    //
    //   req.body = {
    //     access_token: '', //put token.
    //     platform_type: '1',
    //   };
    //
    //   res.on('end', function () {
    //     //res._isJSON().should.be.true;
    //     let data = JSON.parse(res._getData());
    //     console.log(data);
    //     should.not.exist(data.err);
    //     //TODO: complete valid session test.
    //     done();
    //   });
    //
    //   controller.signin(req, res);
    // });
  });

  describe('#getAll()', function () {
    //TODO: need session check part.
    // it('#getAll()', function (done) {
    //   let res = buildResponse();
    //   let req  = http_mocks.createRequest({
    //     method: 'GET',
    //     url: '/users/all',
    //   });
    //
    //   res.on('end', function () {
    //     let data = JSON.parse(res._getData());
    //     data[0].name.should.equal('session');
    //     data[0].email.should.equal('session@yoda.com');
    //     done();
    //   });
    //
    //   controller.getAll(req, res);
    // });
  });

  describe('#getMentorList()', function () {
    // TODO: Add a test to getMyProfile method.
  });

  describe('#getMyProfile()', function () {
    // TODO: Add a test to getMyProfile method.
  });

  describe('#getProfileById()', function () {
    // TODO: Add a test to getProfileById method.
  });
});
