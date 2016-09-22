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
    it(': Save answer.', function (done) {
      var options = {
        method: POST,
        uriL API_BASE_URL + '/answer',
        form: {
          survey_id: "A001-1",
          questions: [
            {
              question_index: 0,
              question: "이 멘토를 통해서 얻고자 하는 것은?",
              answers: [
                {
                  answer_index: 0,
                  is_free_form: false,
                  content: "지원 과정",
                },
                {
                  answer_index: 5,
                  is_free_form: true,
                  content: "다른 의견",
                },
              ],
            },
          ],
        },
        resolveWithFullResponse: true,
        json: true,
      };

      rp(options)
        .then((result) => {

        })
        .catch((err) => {
          err.statusCode.should.equal(400);
          done();
        });
    });
  });

  describe('Save survey.', function () {
    //TODO: kyua will comlete
    // it(': Save survey.', function (done) {
    //
    // });
  });
});
