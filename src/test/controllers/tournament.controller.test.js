import should from 'should';
import '../../server/models/users.model';
import rp from 'request-promise';
import userData from '../fixtures/userData';

/*
 * Test for Tournament API
 */

const API_BASE_URL = `http://localhost:${process.env.PORT}/tournament`;

describe('Test Tournament API', () => {

  describe('/list/:area', () => {
    it('request /list/:id with invalid area.', (done) => {
      rp({
        method: 'GET',
        uri: `${API_BASE_URL}/list/INVALID_AREA`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_E_DATA.access_token,
        },
      })
        .then((result) => {
          result.statusCode.should.equal(200);
          result.body.length.should.equal(0);
          done();
        })
        .catch((err) => {
          should.fail(err);
          done();
        });
    });

    it('request /list/:id with valid All area.', (done) => {
      rp({
        method: 'GET',
        uri: `${API_BASE_URL}/list/All`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_E_DATA.access_token,
        },
      })
        .then((result) => {
          result.statusCode.should.equal(200);
          result.body.length.should.equal(1);
          done();
        })
        .catch((err) => {
          should.fail();
          done();
        });
    });

    it('request /list/:id with valid Design area.', (done) => {
      rp({
        method: 'GET',
        uri: `${API_BASE_URL}/list/Design`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_E_DATA.access_token,
        },
      })
        .then((result) => {
          result.statusCode.should.equal(200);
          result.body.length.should.equal(1);
          done();
        })
        .catch((err) => {
          should.fail();
          done();
        });
    });
  });
});
