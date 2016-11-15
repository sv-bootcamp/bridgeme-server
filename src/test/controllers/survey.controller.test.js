import mockAnswerData from '../fixtures/answerA001_1';
import menteeData from '../fixtures/surveyA001_1';
import mentorData from '../fixtures/surveyB001_1';
import mongoose from 'mongoose';
import rp from 'request-promise';
import should from 'should';
import surveyCallback from '../../server/config/json/survey.callback';
import userData from '../fixtures/userData';

/*
 * Test for Survey API
 */

const Survey = mongoose.model('survey');

const API_BASE_URL = 'http://localhost:8000/survey';

describe('Test Survey API', function () {
  describe('/create', function () {
    it(': Save mentee survey.', function (done) {
      let options = {
        method: 'POST',
        uri: `${API_BASE_URL}/create`,
        form: menteeData.surveyA001_1,
        resolveWithFullResponse: true,
        json: true,
      };

      rp(options)
        .then((result) => {
          result.statusCode.should.equal(200);
          result.body.survey_id.should.equal(menteeData.surveyA001_1.survey_id);
          done();
        })
        .catch((err) => {

        });
    });

    it(': Save mentor survey.', function (done) {
      let options = {
        method: 'POST',
        uri: `${API_BASE_URL}/create`,
        form: mentorData.surveyB001_1,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_A_DATA.access_token,
        },
      };

      rp(options)
        .then((result) => {
          result.statusCode.should.equal(200);
          result.body.survey_id.should.equal(mentorData.surveyB001_1.survey_id);
          done();
        })
        .catch((err) => {

        });
    });
  });

  describe('/request/:type', function () {
    it('request /request/:type with Invalid parameter.', function (done) {
      this.timeout(4000);
      let options = {
        method: 'GET',
        uri: `${API_BASE_URL}/request/mm`,
        params: {
          type: 'mm',
        },
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_A_DATA.access_token,
        },
      };

      rp(options)
        .then(function (result) {

        })
        .catch(function (err) {
          err.statusCode.should.equal(400);
          err.error.err_point.should.equal(surveyCallback.ERR_INVALID_PARAMS);
          done();
        });
    });

    it('request /request/:type with mentee (Valid parameter).', function (done) {
      this.timeout(4000);
      let options = {
        method: 'GET',
        uri: `${API_BASE_URL}/request/mentee`,
        params: {
          type: 'mentee',
        },
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_A_DATA.access_token,
        },
      };

      rp(options)
        .then(function (result) {
          result.statusCode.should.equal(200);
          result.body.survey_id.should.equal(menteeData.surveyA001_1.survey_id);
          done();
        })
        .catch(function (err) {

        });
    });

    it('request /request/:type with mentor (Valid parameter).', function (done) {
      this.timeout(4000);
      let options = {
        method: 'GET',
        uri: `${API_BASE_URL}/request/mentor`,
        params: {
          type: 'mentor',
        },
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_A_DATA.access_token,
        },
      };

      rp(options)
        .then(function (result) {
          result.statusCode.should.equal(200);
          result.body.survey_id.should.equal(mentorData.surveyB001_1.survey_id);
          done();
        })
        .catch(function (err) {

        });
    });
  });

  describe('/answer', function () {
    it(': Save answer.', function (done) {
      let options = {
        method: 'POST',
        uri: `${API_BASE_URL}/answer`,
        form: mockAnswerData.answerA001_1,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_A_DATA.access_token,
        },
      };

      rp(options)
        .then((result) => {
          result.statusCode.should.equal(200);
          result.body.survey_id.should.equal(mockAnswerData.answerA001_1.survey_id);
          done();
        })
        .catch((err) => {

        });
    });
  });
});
