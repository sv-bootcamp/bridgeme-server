import rp from 'request-promise';
import userData from '../fixtures/userData';

describe('Test User API', function () {
  describe('/signOut', function () {
    it(': Sign out', done => {
      rp({
        method: 'GET',
        uri: 'http://localhost:8000/users/signOut',
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_B_DATA.access_token,
        },
      })
        .then(function (result) {
          result.statusCode.should.equal(200);
          done();
        })
        .catch(function (err) {
          should.fail();
          done();
        });
    });
  });
});
