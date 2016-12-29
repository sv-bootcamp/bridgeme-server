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

const API_BASE_URL = `http://localhost:${process.env.PORT}/survey`;

describe('Test Survey API', () => {
  describe('/create', () => {
    it(': Save mentee survey.', (done) => {
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
          should.fail(err);
          done();
        });
    });

    it(': Save mentor survey.', (done) => {
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
          should.fail(err);
          done();
        });
    });
  });

  describe('/request/:type', () => {
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
        .then((result) => {
          should.fail();
          done();
        })
        .catch((err) => {
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
        .then((result) => {
          result.statusCode.should.equal(200);
          result.body.survey_id.should.equal(menteeData.surveyA001_1.survey_id);
          done();
        })
        .catch((err) => {
          should.fail(err);
          done();
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
        .then((result) => {
          result.statusCode.should.equal(200);
          result.body.survey_id.should.equal(mentorData.surveyB001_1.survey_id);
          done();
        })
        .catch((err) => {
          should.fail(err);
          done();
        });
    });
  });

  describe('/answer', () => {
    it(': Save answer.', (done) => {
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
          should.fail(err);
          done();
        });
    });
  });
});
