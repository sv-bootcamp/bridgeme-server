import should from 'should';
import mongoose from 'mongoose';
import '../../server/models/survey.model';
import rp from 'request-promise';

/*
 * Test for survey.controller - Eval Framework.
 */

const Survey = mongoose.model('survey');
const API_BASE_URL = 'http://localhost:8000/survey';
const FB_LONG_LIVED_ACCESS_TOKEN = 'EAAaAu6BRYD4BALZCP5ZAREwtNVZA5sTLcsoEP0oG0gsrwA3ZCzxTPPQ5BMFfG44A9eRoUoZB00prufczZCylhIoujY14lV3NIGRCriZC5iBtpAj6ZA8pC8pjtC75ca9kS3FU3V31gBzotZAOJXhI0YDw4ZBzsHNkq7UsMZD';


describe('Test Survey controller', function () {
  describe('Save survey.', function () {
    //TODO: kyua will comlete
    // it(': Save survey.', function (done) {
    //
    // });
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
        // form: {
        //   access_token: FB_LONG_LIVED_ACCESS_TOKEN,
        // },
        resolveWithFullResponse: true,
        json: true,
      };

      rp(options)
        .then(function (result) {

        })
        .catch(function (err) {
          err.statusCode.should.equal(400);
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
          console.log(result);
          //result.statusCode.should.equal(200);
          done();
        })
        .catch(function (err) {
          console.log(err);
          done();
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
          console.log(result);
          //result.statusCode.should.equal(200);
          done();
        })
        .catch(function (err) {
          console.log(err);
          done();
        });
    });

  });

  describe('Save answer.', function () {
    //TODO: kyua will comlete
    // it(': Save answer.', function (done) {
    //
    // });
  });
});
