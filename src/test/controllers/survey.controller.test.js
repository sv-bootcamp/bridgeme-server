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

describe('Test for survey.controller', function () {
  describe('#getRequest()', function () {
    // TODO:
  });

  describe('#getSurvey()', function () {

  });

  describe('#saveAnswer()', function () {
    // TODO: Add a test
  });

  describe('#saveQuestion()', function () {
    // TODO: Add a test
  });
});
