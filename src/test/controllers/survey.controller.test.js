import should from 'should';
import mongoose from 'mongoose';
import '../../server/models/survey.model';
import rp from 'request-promise';

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
    // it(': Save answer.', function (done) {
    //
    // });
  });
});
