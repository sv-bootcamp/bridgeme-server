import should from 'should';
import mongoose from 'mongoose';
import '../../server/models/survey.model';
import rp from 'request-promise';
import mockAnswerData from '../fixtures/answerA001_1';
import mockSurveyData_mentor from '../fixtures/surveyA001_1';

/*
 * Test for survey.controller - Eval Framework.
 */

const Survey = mongoose.model('survey');
const API_BASE_URL = 'http://localhost:8000/survey';

describe('Test Survey controller', function () {
  describe('Save survey.', function () {
    //TODO: kyua will comlete
    // it(': Save survey.', function (done) {
    //
    // });
  });

  describe('Get request survey.', function () {
    //TODO: save survey first
    //TODO : complete get survey
    //TODO: sarah will comlete

    it(': Invalid parameter.', function (done) {
      done();
    });

    // it(': Valid parameter mentor.', function (done) {
    //
    // });
    //
    // it(': Valid parameter mentee.', function (done) {
    //
    // });

  });

  describe('Save answer.', function () {
    //TODO: kyua will comlete
    it(': Save right answer.', function (done) {
      var options = {
        method: 'POST',
        uri: API_BASE_URL + '/answer',
        form: mockAnswerData.answerA001_1,
        resolveWithFullResponse: true,
        json: true,
      };

      rp(options)
        .then((result) => {
          result.statusCode.should.equal(200);
          result.body.survey_id.should.equal(mockAnswerData.answerA001_1.survey_id);
          done();
        })
        .catch((err) => {
          err.statusCode.should.equal(401);
          done();
        });
    });
  });

  describe('Save survey.', function () {
    //TODO: kyua will comlete
    it(': Save survey.', function (done) {
      var options = {
        method: 'POST',
        uri: API_BASE_URL + '/create',
        form: mockSurveyData_mentor.surveyA001_1,
        resolveWithFullResponse: true,
        json: true,
      };

      rp(options)
        .then((result) => {
          result.statusCode.should.equal(200);
          result.body.survey_id.should.equal(mockSurveyData_mentor.surveyA001_1.survey_id);
          done();
        })
        .catch((err) => {

        })
    });
  });
});
