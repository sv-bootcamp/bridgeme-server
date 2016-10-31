import '../../server/models/users.model';
import rp from 'request-promise';
import should from 'should';
import userCallback from '../../server/config/json/user.callback';
import userData from '../fixtures/userData';

/*
 * Test for User API
 */

const API_BASE_URL = 'http://localhost:8000/users';

describe('Test User API', function () {
  describe('/local_signin', function() {
    it(': Sign up with local ')
  });

  describe('/signin : FACEBOOK.', function () {
    it(': Sign up invalid Facebook user.', done => {
      rp({
        method: 'POST',
        uri: API_BASE_URL + '/signin',
        form: {
          access_token: 'THIS IS INVALID ACCESS TOKEN',
          platform_type: '1',
        },
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(function (result) {
          should.fail('status code is not 400');
          done();
        })
        .catch(function (err) {
          err.statusCode.should.equal(400);
          err.response.body.err_point.should.equal(userCallback.ERR_INVALID_ACCESS_TOKEN);
          done();
        });
    });

    it(': Sign up with Invalid platform type.', done => {
      rp({
        method: 'POST',
        uri: API_BASE_URL + '/signin',
        form: {
          access_token: 'THIS IS INVALID ACCESS TOKEN',
          platform_type: '123',
        },
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
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

    it(': Sign up valid Facebook user A.', done => {
      rp({
        method: 'POST',
        uri: API_BASE_URL + '/signin',
        form: {
          access_token: userData.USER_A_FB_LONG_LIVED_ACCESS_TOKEN,
          platform_type: '1',
        },
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(function (result) {
          result.statusCode.should.equal(201);
          userData.USER_A_DATA = result.body;
          done();
        })
        .catch(function (err) {
          should.fail();
          done();

        });
    });

    it(': Sign in valid Facebook user A.', done => {
      rp({
        method: 'POST',
        uri: API_BASE_URL + '/signin',
        form: {
          access_token: userData.USER_A_FB_LONG_LIVED_ACCESS_TOKEN,
          platform_type: '1',
        },
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(function (result) {
          result.statusCode.should.equal(200);
          result.body.msg.should.equal('Sign in success.');
          done();
        })
        .catch(function (err) {
          should.fail();
          done();
        });
    });
  });

  describe('/all', function () {
    it('request /all without session coockie.', done => {
      anauthorizedAccessTest(API_BASE_URL + '/all', done);
    });

    it('request /all with session coockie.', done => {
      rp({
        method: 'GET',
        uri: API_BASE_URL + '/all',
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(function (result) {
          result.statusCode.should.equal(200);
          let body = result.body;
          body[0]._id.should.equal(userData.USER_A_DATA._id);
          body[0].email.should.equal(userData.USER_A_DATA.email);
          body[0].name.should.equal(userData.USER_A_DATA.name);
          body[0].gender.should.equal(userData.USER_A_DATA.gender);
          done();
        })
        .catch(function (err) {
          should.fail();
          done();
        });
    });
  });

  describe('/me', function () {
    it('request /me without session coockie.', done => {
      anauthorizedAccessTest(API_BASE_URL + '/me', done);
    });

    it('request /me with session coockie.', done => {
      rp({
        method: 'GET',
        uri: API_BASE_URL + '/me',
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(function (result) {
          result.statusCode.should.equal(200);
          let body = result.body;
          body._id.should.equal(userData.USER_A_DATA._id);
          body.email.should.equal(userData.USER_A_DATA.email);
          body.name.should.equal(userData.USER_A_DATA.name);
          body.gender.should.equal(userData.USER_A_DATA.gender);
          done();
        })
        .catch(function (err) {
          should.fail();
          done();
        });
    });
  });

  describe('/mentorlist', function () {
    it('request /mentorlist without session coockie.', done => {
      anauthorizedAccessTest(API_BASE_URL + '/mentorlist', done);
    });

    it('request /mentorlist with session coockie.', done => {
      rp({
        method: 'GET',
        uri: API_BASE_URL + '/mentorlist',
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(function (result) {
          result.statusCode.should.equal(200);
          let body = result.body;
          body.length.should.equal(0);
          done();
        })
        .catch(function (err) {
          should.fail();
          done();
        });
    });
  });

  describe('/id/:id', function () {
    it('request /id/:id without session coockie.', done => {
      anauthorizedAccessTest(API_BASE_URL + '/id/' + userData.USER_A_DATA._id, done);
    });

    it('request /id/:id with session coockie.', done => {
      rp({
        method: 'GET',
        uri: API_BASE_URL + '/id/' + userData.USER_A_DATA._id,
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(function (result) {
          result.statusCode.should.equal(200);
          let body = result.body;
          body._id.should.equal(userData.USER_A_DATA._id);
          body.email.should.equal(userData.USER_A_DATA.email);
          body.name.should.equal(userData.USER_A_DATA.name);
          body.gender.should.equal(userData.USER_A_DATA.gender);
          body.relation.asMentee.should.equal(0);
          body.relation.asMentor.should.equal(0);
          done();
        })
        .catch(function (err) {
          should.fail();
          done();
        });
    });
  });
});

function anauthorizedAccessTest(uri, done) {
  rp({
    method: 'GET',
    uri: uri,
    resolveWithFullResponse: true,
    json: true,
  })
    .then(function (result) {
      should.fail('status code is not 401');
      done();
    })
    .catch(function (err) {
      err.statusCode.should.equal(401);
      done();
    });
}
