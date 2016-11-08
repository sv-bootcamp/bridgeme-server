import should from 'should';
import '../../server/models/users.model';
import rp from 'request-promise';
import userData from '../fixtures/userData';

/*
 * Test for User API
 */

const API_BASE_URL = 'http://localhost:8000';

let matchData;

describe('Test Match API', function () {

  describe('User B request mentoring to User A.', () => {
    it('Sign up with valid Facebook user B.', done => {
      rp({
        method: 'POST',
        uri: API_BASE_URL + '/users/signin',
        form: {
          access_token: userData.USER_B_FB_LONG_LIVED_ACCESS_TOKEN,
          platform_type: '1',
        },
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(function (result) {
          result.statusCode.should.equal(201);
          userData.USER_B_DATA = result.body;
          done();
        })
        .catch(function (err) {
          should.fail(err);
          done();
        });
    });

    it('request mentoring to Invalid User.', done => {
      rp({
        method: 'POST',
        uri: API_BASE_URL + '/match/request',
        form: {
          mentor_id: 'invaliduserid',
          subjects: "Getting a job",
          contents: "hi",
        },
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(function (result) {
          should.fail();
          done();
        })
        .catch(function (err) {
          err.statusCode.should.equal(400);
          done();
        });
    });

    it('User B request mentoring to User A', function (done) {
      //TODO issue :  this.timeout() doesn't work with arrow function.
      //For wating to send mail.
      this.timeout(10000);
      rp({
        method: 'POST',
        uri: API_BASE_URL + '/match/request',
        form: {
          mentor_id: userData.USER_A_DATA._id,
          subjects: "Getting a job",
          contents: "hi",
        },
        jar: true,
        resolveWithFullResponse: true,
        json: true,
        timeout: 5000,
      })
        .then(function (result) {
          result.statusCode.should.equal(201);
          done();
        })
        .catch(function (err) {
          // should.fail(err);
          done();
        });
    });

    it('User B Retrieve activity page.', done => {
      rp({
        method: 'GET',
        uri: API_BASE_URL + '/match/activity',
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(function (result) {
          matchData = result.body;
          result.statusCode.should.equal(200);
          result.body.pending.length.should.equal(1);
          result.body.accepted.length.should.equal(0);
          result.body.rejected.length.should.equal(0);
          result.body.requested.length.should.equal(0);
          done();
        })
        .catch(function (err) {
          should.fail(err);
          done();
        });
    });
  });

  describe('User A accept mentoring from User B.', () => {
    it('Sign up with User A.', done => {
      rp({
        method: 'POST',
        uri: API_BASE_URL + '/users/signin',
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
          userData.USER_A_DATA = result.body;
          done();
        })
        .catch(function (err) {
          should.fail(err);
          done();
        });
    });
    it('User A Retrieve activity page.', done => {
      rp({
        method: 'GET',
        uri: API_BASE_URL + '/match/activity',
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(function (result) {
          matchData = result.body;
          result.statusCode.should.equal(200);
          result.body.pending.length.should.equal(0);
          result.body.accepted.length.should.equal(0);
          result.body.rejected.length.should.equal(0);
          result.body.requested.length.should.equal(1);
          done();
        })
        .catch(function (err) {
          should.fail(err);
          done();
        });
    });
    it('User A accept request from User B.', done => {
      rp({
        method: 'POST',
        uri: API_BASE_URL + '/match/response',
        form: {
          match_id: matchData.requested[0]._id,
          option: 1,  //accept
        },
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(function (result) {
          result.statusCode.should.equal(200);
          done();
        })
        .catch(function (err) {
          should.fail(err);
          done();
        });
    });

  });

  describe('User B check request status is changed.', () => {
    it('Sign up with User B.', done => {
      rp({
        method: 'POST',
        uri: API_BASE_URL + '/users/signin',
        form: {
          access_token: userData.USER_B_FB_LONG_LIVED_ACCESS_TOKEN,
          platform_type: '1',
        },
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(function (result) {
          result.statusCode.should.equal(200);
          userData.USER_B_DATA = result.body;
          done();
        })
        .catch(function (err) {
          should.fail(err);
          done();
        });
    });

    it('User B Retrieve activity page.', done => {
      rp({
        method: 'GET',
        uri: API_BASE_URL + '/match/activity',
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(function (result) {
          matchData = result.body;
          result.statusCode.should.equal(200);
          result.body.pending.length.should.equal(0);
          result.body.accepted.length.should.equal(1);
          result.body.rejected.length.should.equal(0);
          result.body.requested.length.should.equal(0);
          done();
        })
        .catch(function (err) {
          should.fail(err);
          done();
        });
    });
  });

  describe('AnauthorizedAccess to API', () => {
    it('request /activity without session coockie.', done => {
      anauthorizedAccessTest('GET', API_BASE_URL + '/match/activity', done);
    });
    it('request /request without session coockie.', done => {
      anauthorizedAccessTest('POST', API_BASE_URL + '/match/request', done);
    });
    it('request /response without session coockie.', done => {
      anauthorizedAccessTest('POST', API_BASE_URL + '/match/response', done);
    });
  });
});

function anauthorizedAccessTest(method, uri, done) {
  rp({
    method: method,
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
