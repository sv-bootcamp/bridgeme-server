import rp from 'request-promise';
import should from 'should';
import userCallback from '../../server/config/json/user.callback';

/*
 * Test for Image API
 */

const API_BASE_URL = 'http://localhost:8000/image';

describe('Test Image API', function () {
  describe('/upload', function () {
    it(': upload image', done => {
      rp({
        method: 'POST',
        uri: API_BASE_URL + '/upload',
        form: {
          url: 'src/test/fixtures/test.png',
        },
        jar: true,
        resolveWithFullResponse: true,
        json: true,
      })
        .then(function (result) {
          result.statusCode.should.equal(200);
          result.body.msg.should.equal(userCallback.SUCCESS_PROFILE_UPDATE);
          done();
        })
        .catch(function (err) {
          should.fail();
          done();
        });
    });
  });
});
