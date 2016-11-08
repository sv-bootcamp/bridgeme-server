import '../../server/models/users.model';
import jobData from '../../server/config/json/jobcategory';
import rp from 'request-promise';
import signupData from '../fixtures/signupData';
import should from 'should';
import userCallback from '../../server/config/json/user.callback';
import userData from '../fixtures/userData';

/*
 * Test for User API
 */

const API_BASE_URL = 'http://localhost:8000/users';
let mentorMode = true;

describe('Test User API', function () {

  describe('/signIn : FACEBOOK.', function () {
    it(': Sign up invalid Facebook user.', done => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/signIn`,
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
        uri: `${API_BASE_URL}/signIn`,
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
        uri: `${API_BASE_URL}/signIn`,
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
          userData.USER_A_DATA = result.body.user;
          userData.USER_A_DATA.access_token = result.body.access_token;
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
        uri: `${API_BASE_URL}/signIn`,
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
    it('request /all without access_token.', done => {
      unauthorizedAccessTest(`${API_BASE_URL}/all`, done);
    });

    it('request /all with access_token.', done => {
      rp({
        method: 'GET',
        uri: `${API_BASE_URL}/all`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_A_DATA.access_token,
        },
      })
        .then(function (result) {
          result.statusCode.should.equal(200);
          let body = result.body;
          body[0]._id.should.equal(userData.USER_A_DATA._id);
          body[0].email.should.equal(userData.USER_A_DATA.email);
          body[0].name.should.equal(userData.USER_A_DATA.name);
          done();
        })
        .catch(function (err) {
          should.fail();
          done();
        });
    });
  });

  describe('/me', function () {
    it('request /me without access_token.', done => {
      unauthorizedAccessTest(API_BASE_URL + '/me', done);
    });

    it('request /me with access_token.', done => {
      rp({
        method: 'GET',
        uri: `${API_BASE_URL}/me`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_A_DATA.access_token,
        },
      })
        .then(function (result) {
          result.statusCode.should.equal(200);
          let body = result.body;
          body._id.should.equal(userData.USER_A_DATA._id);
          body.email.should.equal(userData.USER_A_DATA.email);
          body.name.should.equal(userData.USER_A_DATA.name);
          done();
        })
        .catch(function (err) {
          should.fail();
          done();
        });
    });
  });

  describe('/mentorList', function () {
    it('request /mentorList without access_token.', done => {
      unauthorizedAccessTest(API_BASE_URL + '/mentorList', done);
    });

    it('request /mentorList with access_token.', done => {
      rp({
        method: 'GET',
        uri: `${API_BASE_URL}/mentorList`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_A_DATA.access_token,
        },
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
    it('request /id/:id without access_token.', done => {
      unauthorizedAccessTest(`${API_BASE_URL}/id/${userData.USER_A_DATA._id}`, done);
    });

    it('request /id/:id with access_token.', done => {
      rp({
        method: 'GET',
        uri: `${API_BASE_URL}/id/${userData.USER_A_DATA._id}`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_A_DATA.access_token,
        },
      })
        .then(function (result) {
          result.statusCode.should.equal(200);
          let body = result.body;
          body._id.should.equal(userData.USER_A_DATA._id);
          body.email.should.equal(userData.USER_A_DATA.email);
          body.name.should.equal(userData.USER_A_DATA.name);
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

  describe('/localSignUp', function () {
    it(': Sign up as local login with invalid email format.', done => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/localSignUp`,
        form: userData.USER_C_DATA,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(result => {
          should.fail('status code should be 400');
          done();
        })
        .catch(err => {
          err.statusCode.should.equal(400);
          done();
        });
    });

    it(': Sign up as local login.', done => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/localSignUp`,
        form: userData.USER_E_DATA,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(result => {
          result.statusCode.should.equal(201);
          result.body.user.email.should.equal(userData.USER_E_DATA.email);
          done();
        })
        .catch(err => {
          should.fail();
          done();
        });
    });

    it(': Sign up as local login with existing email.', done => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/localSignUp`,
        form: userData.USER_E_DATA,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_A_DATA.access_token,
        },
      })
        .then(result => {
          result.statusCode.should.equal(201);
          done();
        })
        .catch(err => {
          should.fail();
          done();
        });
    });
  });

  describe('/localSignIn', function () {
    it(': Sign in as local login with not existing account.', done => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/localSignIn`,
        form: userData.USER_D_DATA,
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(result => {
          should.fail('status code should be 400');
          done();
        })
        .catch(err => {
          err.statusCode.should.equal(400);
          done();
        });
    });

    it(': Sign in as local login with existing account.', done => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/localSignIn`,
        form: userData.USER_E_DATA,
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(result => {
          result.statusCode.should.equal(200);
          done();
        })
        .catch(err => {
          should.fail();
          done();
        });
    });
  });

  describe('/secretCode', function () {
    it(': Request a new secret code with not existing account.', done => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/secretCode`,
        form: {
          email: userData.USER_D_DATA.email,
        },
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(result => {
          should.fail('status code should be 400');
          done();
        })
        .catch(err => {
          err.statusCode.should.equal(400);
          done();
        });
    });

    it(': Request a new secret code with existing account.', done => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/secretCode`,
        form: {
          email: userData.USER_E_DATA.email,
        },
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(result => {
          result.statusCode.should.equal(201);
          userData.SECRET_CODE = result.body.secretCode;
          done();
        })
        .catch(err => {
          should.fail();
          done();
        });
    });
  });

  describe('/resetPassword', () => {
    it(': Reset password with not existing user.', done => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/resetPassword`,
        form: userData.USER_D_DATA,
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(result => {
          should.fail();
          done();
        })
        .catch(err => {
          err.statusCode.should.equal(400);
          done();
        });
    });

    it(': Reset password with existing user.', done => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/resetPassword`,
        form: {
          email: userData.USER_E_DATA.email,
          password: userData.USER_E_DATA.password,
          secretCode: userData.SECRET_CODE,
        },
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(result => {
          result.statusCode.should.equal(200);
          done();
        })
        .catch(err => {
          should.fail();
          done();
        });
    });
  });
});

describe('/job', function () {
  it('request /job without session cookie.', done => {
    unauthorizedAccessTest(`${API_BASE_URL}/job`, done);
  });

  it('request /job with session cookie.', done => {
    rp({
      method: 'GET',
      uri: `${API_BASE_URL}/job`,
      resolveWithFullResponse: true,
      json: true,
      headers: {
        access_token: userData.USER_A_DATA.access_token,
      },
    })
      .then(function (result) {
        result.statusCode.should.equal(200);
        const body = result.body;
        body.area.toString().should.equal(jobData.area.toString());
        body.years.toString().should.equal(jobData.years.toString());
        body.education_background.toString()
          .should.equal(jobData.education_background.toString());
        done();
      })
      .catch(function (err) {
        should.fail();
        done();
      });
  });
});

describe('/editJob', function () {
  it('request /editJob with session cookie.', done => {
    rp({
      method: 'POST',
      uri: `${API_BASE_URL}/editJob`,
      form: signupData.data.job,
      resolveWithFullResponse: true,
      json: true,
      headers: {
        access_token: userData.USER_A_DATA.access_token,
      },
    })
      .then(function (result) {
        result.statusCode.should.equal(200);
        result.body.msg.should.equal(userCallback.SUCCESS_EDIT);
        done();
      })
      .catch(function (err) {
        should.fail();
        done();
      });
  });
});

describe('/editHelp', function () {
  it('request /editHelp with session cookie.', done => {
    rp({
      method: 'POST',
      uri: `${API_BASE_URL}/editHelp`,
      form: signupData.data.help,
      resolveWithFullResponse: true,
      json: true,
      headers: {
        access_token: userData.USER_A_DATA.access_token,
      },
    })
      .then(function (result) {
        result.statusCode.should.equal(200);
        result.body.msg.should.equal(userCallback.SUCCESS_EDIT);
        done();
      })
      .catch(function (err) {
        should.fail();
        done();
      });
  });
});

describe('/editPersonality', function () {
  it('request /editPersonality with session cookie.', done => {
    rp({
      method: 'POST',
      uri: `${API_BASE_URL}/editPersonality`,
      form: signupData.data.personality,
      resolveWithFullResponse: true,
      json: true,
      headers: {
        access_token: userData.USER_A_DATA.access_token,
      },
    })
      .then(function (result) {
        result.statusCode.should.equal(200);
        result.body.msg.should.equal(userCallback.SUCCESS_EDIT);
        done();
      })
      .catch(function (err) {
        should.fail();
        done();
      });
  });
});

describe('/setRequestStatus', function () {
  it('request /setRequestStatus with invalid parameter.', done => {
    rp({
      method: 'POST',
      uri: `${API_BASE_URL}/editMentorMode`,
      form: { mentorMode: null },
      resolveWithFullResponse: true,
      json: true,
      headers: {
        access_token: userData.USER_A_DATA.access_token,
      },
    })
      .then(function (result) {
        should.fail();
        done();
      })
      .catch(function (err) {
        err.statusCode.should.equal(400);
        err.response.body.err_point.should.equal(userCallback.ERR_INVALID_PARAMS);
        done();
      });
  });

  it('request /setRequestStatus with valid parameter.', done => {
    rp({
      method: 'POST',
      uri: `${API_BASE_URL}/editMentorMode`,
      form: { mentorMode: mentorMode },
      resolveWithFullResponse: true,
      json: true,
      headers: {
        access_token: userData.USER_A_DATA.access_token,
      },
    })
      .then(function (result) {
        result.statusCode.should.equal(200);
        result.body.msg.should.equal(userCallback.SUCCESS_UPDATE);
        done();
      })
      .catch(function (err) {
        should.fail();
        done();
      });
  });
});

describe('/getRequestStatus', function () {
  it('request /mentorMode with session cookie.', done => {
    rp({
      method: 'GET',
      uri: `${API_BASE_URL}/mentorMode`,
      resolveWithFullResponse: true,
      json: true,
      headers: {
        access_token: userData.USER_A_DATA.access_token,
      },
    })
      .then(function (result) {
        result.statusCode.should.equal(200);
        result.body.result.should.equal(mentorMode);
        done();
      })
      .catch(function (err) {
        should.fail();
        done();
      });
  });
});

function unauthorizedAccessTest(uri, done) {
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
