//import should from 'should';
import controller from '../../server/controllers/survey.controller';
import surveyData from '../fixtures/surveyItem/survey.data.js';
import mongoose from 'mongoose';
import '../../server/models/survey.model';

import chai from 'chai';
import server from '../../server/index';
//let should = chai.should();


/*
 * Test for users.controller.
 */

const Survey = mongoose.model('survey');

describe('Test for survey.controller', function () {
  describe('#getRequest()', function () {
    // TODO:
  });

  describe('#getSurvey()', function () {
    //it('should get appropriate surveyItem using surveyId', function (done) {
    // Survey.create(surveyData.surveyQuestion, function (err, surveyItem) {
    //   should.not.exist(err);
    //
    //
    //
    //   // let req, res, spy;
    //   // req = res = {};
    //   // spy = res.send = sinon.spy();
    //   //
    //   // controller.getSurvey(res, surveyItem.survey_id);
    //   // expect(spy.calledOnce).to.equal(true);
    //
    //   done();
    // });

    // chai.request(server)
    //   .get('/survey/mentor')
    //   .end(function (err, res) {
    //     res.should.have.status(200);
    //     done();
    //   });
    //});
  });

  describe('#saveAnswer()', function () {
    // TODO: Add a test
  });

  describe('#saveQuestion()', function () {
    // TODO: Add a test
  });
});
