//import mockData from '../fixtures/mockData.js';
import '../../server/models/users.model';
import * as controller from '../../server/controllers/users.controller';
import http_mocks from 'node-mocks-http';
import mongoose from 'mongoose';
import should from 'should';

/*
 * Test for users.controller.
 */

const User = mongoose.model('user');

function buildResponse() {
  return http_mocks.createResponse({ eventEmitter: require('events').EventEmitter });
}

describe('Test for users.controller', function () {
  // describe('#signIn()', function () {
  //   it('#registerUser()', function (done) {
  //     let res = buildResponse();
  //     let req  = http_mocks.createRequest({
  //       method: 'POST',
  //       url: '/users/signIn',
  //     });
  //
  //     req.body = {
  //       access_token: '',
  //       platform_type: '1',
  //     };
  //
  //     res.on('end', function () {
  //       let data = JSON.parse(res._getData());
  //       should.not.exist(data.err);
  //
  //       console.log(data);
  //       done();
  //     });
  //
  //     controller.signin(req, res);
  //   });
  // });

  describe('#getAll()', function () {
    it('#getAll()', function (done) {
      let res = buildResponse();
      let req  = http_mocks.createRequest({
        method: 'GET',
        url: '/users/all',
      });

      res.on('end', function () {
        let data = JSON.parse(res._getData());
        console.log(data[0]);
        data[0].name.should.equal('session');
        done();
      });

      controller.getAll(req, res);
    });
  });

  // it('#getMentorList()', function (done) {
  //   let u = sampleUser.loggedInUserData;
  //   User.create(u, function (err, createdUser) {
  //     should.not.exist(err);
  //     createdUser.name.should.equal('session');
  //     // TODO: Add a test to access getMentorList method.
  //     // TODO: Add a test to check for non-existent user session.
  //     // TODO: Add a test to check if all users are returned except the user in the session.
  //     //createdUser.remove();
  //     //done();
  //   });
  // });

  // describe('#getMyProfile()', function () {
  //   // TODO: Add a test to getMyProfile method.
  // });
  //
  // describe('#getProfileById()', function () {
  //   // TODO: Add a test to getProfileById method.
  // });
});
