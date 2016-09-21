import '../../server/models/users.model';
import * as controller from '../../server/controllers/users.controller';
import express from 'express';
import http_mocks from 'node-mocks-http';
import loggedInUserData from '../fixtures/loggedInUserData.js';
import mongoose from 'mongoose';
import session from 'express-session';
import should from 'should';
import mongo from '../../server/config/mongoose';

mongoose.Promise = require('bluebird');

/*
 * Test for users.controller.
 */
const User = mongoose.model('user');
let Session = mongoose.connection.collection();
const app = express();

function buildResponse() {
  let EventEmitter = require('events').EventEmitter;
  return http_mocks.createResponse({ eventEmitter: EventEmitter });
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

    it('Valid access_token test.', function (done) {
      let res = buildResponse();
      let req  = http_mocks.createRequest({
        method: 'POST',
        url: '/users/signIn',
        session: Session,
      });

      console.log('####');
      console.log(Session);

      req.body = {
        access_token: 'EAACEdEose0cBAPeyMi9hkGLAOMEw90HhQ6lDeZCrtLk9I2hsbZCDmUjT0oZBRQAL92gFtCDiDAzjq4sLpCqEIuMZCbhbDWvLdrSowfTrvb6d6nXBWrr8gx3l6yDABfmrUWmnmCc9JlC4f1oe1Vh87ewTlnDAKsS6wgyxZB3IhiAZDZD', //put token.
        platform_type: '1',
      };

      res.on('end', function () {
        //res._isJSON().should.be.true;
        let data = JSON.parse(res._getData());
        console.log(data);
        should.not.exist(data.err);
        //TODO: complete valid session test.

        done();
      });

      controller.signin(req, res);
    });
  });

  describe('#getAll()', function () {
    //TODO: need session check part.
    it('#getAll()', function (done) {
      let res = buildResponse();
      let req  = http_mocks.createRequest({
        method: 'GET',
        url: '/users/all',
        session: Session,
      });

      console.log('####');
      console.log(Session);

      console.log(req.session);

      res.on('end', function () {
        let data = JSON.parse(res._getData());
        console.log(data);
        //data[0].name.should.equal('session');
        //data[0].email.should.equal('session@yoda.com');
        done();
      });

      controller.getAll(req, res);
    });
  });

  describe('#getMentorList()', function () {
    it('#getMentorList()', function (done) {
      let res = buildResponse();
      let req  = http_mocks.createRequest({
        method: 'GET',
        url: '/users/mentorlist',
        session: Session,
      });

      res.on('end', function () {
        let data = JSON.parse(res._getData());
        console.log(data);
        //data[0].name.should.equal('session');
        //data[0].email.should.equal('session@yoda.com');
        done();
      });

      controller.getMentorList(req, res);
    });
  });

  describe('#getMyProfile()', function () {
    it('#getMyProfile()', function (done) {
      let res = buildResponse();
      let req  = http_mocks.createRequest({
        method: 'GET',
        url: '/users/me',
        session: Session,
      });

      res.on('end', function () {
        let data = JSON.parse(res._getData());
        console.log(data);
        //data[0].name.should.equal('session');
        //data[0].email.should.equal('session@yoda.com');
        done();
      });

      controller.getMyProfile(req, res);
    });
  });

  describe('#getProfileById()', function () {
    // TODO: Add a test to getProfileById method.
  });
});
