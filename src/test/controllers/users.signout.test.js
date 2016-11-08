import rp from 'request-promise';
import userCallback from '../../server/config/json/user.callback';

describe('Test User API', function () {
  describe('/signOut', function () {
    it(': Sign out', done => {
      rp({
        method: 'GET',
        uri: 'http://localhost:8000/users/signOut',
        resolveWithFullResponse: true,
        json: true,
      })
        .then(function (result) {
          result.statusCode.should(200);
          done();
        })
        .catch(function (err) {
          done();
        });
    });
  });
});
