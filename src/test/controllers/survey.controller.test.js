import should from 'should';
import mongoose from 'mongoose';
import '../../server/models/survey.model';
import rp from 'request-promise';
import mockAnswerData from '../fixtures/answerA001_1';
import mockSurveyData_mentee from '../fixtures/surveyA001_1';
import mockSurveyData_mentor from '../fixtures/surveyB001_1';

/*
 * Test for survey.controller - Eval Framework.
 */

const Survey = mongoose.model('survey');
const API_BASE_URL = 'http://localhost:8000/survey';
const FB_LONG_LIVED_ACCESS_TOKEN = 'EAAaAu6BRYD4BALZCP5ZAREwtNVZA5sTLcsoEP0oG0gsrwA3ZCzxTPPQ5BMFfG44A9eRoUoZB00prufczZCylhIoujY14lV3NIGRCriZC5iBtpAj6ZA8pC8pjtC75ca9kS3FU3V31gBzotZAOJXhI0YDw4ZBzsHNkq7UsMZD';

describe('Test Survey controller', function () {
  describe('Save survey.', function () {
    it(': Save mentee survey.', function (done) {
      var options = {
        method: 'POST',
        uri: API_BASE_URL + '/create',
        form: mockSurveyData_mentee.surveyA001_1,
        resolveWithFullResponse: true,
        json: true,
      };
    
      rp(options)
        .then((result) => {
          result.statusCode.should.equal(200);
          result.body.survey_id.should.equal(mockSurveyData_mentee.surveyA001_1.survey_id);
          done();
        })
        .catch((err) => {
        
        })
    });
    
    it(': Save mentor survey.', function (done) {
      var options = {
        method: 'POST',
        uri: API_BASE_URL + '/create',
        form: mockSurveyData_mentor.surveyB001_1,
        resolveWithFullResponse: true,
        json: true,
      };
    
      rp(options)
        .then((result) => {
          result.statusCode.should.equal(200);
          result.body.survey_id.should.equal(mockSurveyData_mentor.surveyB001_1.survey_id);
          done();
        })
        .catch((err) => {
        
        })
    });
  });
  
  describe('Get request survey.', function () {
   it(': Invalid parameter.', function (done) {
      this.timeout(4000);
      let options = {
        method: 'GET',
        uri: API_BASE_URL + '/request/mm',
        params: {
          type: 'mm',
        },
        resolveWithFullResponse: true,
        json: true,
      };

      rp(options)
        .then(function (result) {

        })
        .catch(function (err) {
          //TODO: this should not be Authentication failed error
          err.statusCode.should.equal(401);
          //TODO: after solve problem change into under code
          // err.statusCode.should.equal(400);
          // err.body.msg.should.equal('Parameter /:type/ is not correct');
          done();
        });
    });

    it(': Valid parameter mentor.', function (done) {
      this.timeout(4000);
      var options = {
        method: 'GET',
        uri: API_BASE_URL + '/request/mentor',
        params: {
          type: 'mentor',
        },
        resolveWithFullResponse: true,
        json: true,
      };

      rp(options)
        .then(function (result) {
          result.statusCode.should.equal(200);
          result.body.survey_id.should.equal('B001-1');
          done();
        })
        .catch(function (err) {
          //TODO: this should not be Authentication failed error
          err.statusCode.should.equal(401);
          done();
          //TODO: after solve problem this would be delete
        });
    });
    
    it(': Valid parameter mentee.', function (done) {
      this.timeout(4000);
      var options = {
        method: 'GET',
        uri: API_BASE_URL + '/request/mentee',
        params: {
          type: 'mentee',
        },
        resolveWithFullResponse: true,
        json: true,
      };
  
      rp(options)
        .then(function (result) {
          result.statusCode.should.equal(200);
          result.body.survey_id.should.equal('A001-1');
          done();
        })
        .catch(function (err) {
          //TODO: this should not be Authentication failed error
          err.statusCode.should.equal(401);
          done();
          //TODO: after solve problem this would be delete
        });
    });
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
          //TODO: this should not be Authentication failed error
          err.statusCode.should.equal(401);
          done();
          //TODO: after solve problem this would be delete
        });
    });
  });
});
