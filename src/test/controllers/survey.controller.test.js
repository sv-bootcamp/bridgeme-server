import surveyData from '../fixtures/surveyItem/survey.data.js';
import '../../server/models/survey.model';
import * as controller from '../../server/controllers/survey.controller';
import http_mocks from 'node-mocks-http';
import mongoose from 'mongoose';
import should from 'should';

/*
 * Test for users.controller.
 */

const Survey = mongoose.model('survey');

function buildResponse() {
  return http_mocks.createResponse({ eventEmitter: require('events').EventEmitter });
}

describe('Test for survey.controller', function () {
  describe('#getRequest()', function () {
    it('should get parameter type err.', function (done) {
      let res = buildResponse();
      let req  = http_mocks.createRequest({
        method: 'GET',
        url: '/survey/request/strangeparam',
      });

      res.on('end', function () {
        let data = JSON.parse(res._getData());
        data.err_point.should.equal('Parameter /:type/ is not correct');
        done();
      });

      controller.getRequest(req, res);
    });

    // it('should get mentor survey.', function (done) {
    //   let res = buildResponse();
    //   let req  = http_mocks.createRequest({
    //     method: 'GET',
    //     url: '/survey/request/mentor',
    //     params: {
    //       type: 'mentor',
    //     },
    //   });
    //
    //   res.on('end', function () {
    //     console.log(res._getData());
    //     let data = JSON.parse(res._getData());
    //
    //     data[0].survey_id.should.equal('B001-1');
    //     done();
    //   });
    //
    //   controller.getRequest(req, res);
    // });
  });

  describe('#saveAnswer()', function () {
    // TODO: Add a test
  });

  describe('#saveQuestion()', function () {
    // TODO: Add a test
  });
});
