import test from 'tape';
import requestah from 'requestah';
let r = requestah(8000);
import mockData from '../../server/config/json/mockData.js';

let _id;

test('User register test', t => {
  r.post('/users/signin', mockData.mockUserData, res=> {
    let body = JSON.parse(res.body);
    t.equal(body.successCode, 1);
    _id = body.result._id;
    t.end();
  });
});

test('user signin test', t => {
  r.post('/users/signin', mockData.mockUserData, res=> {
    let body = JSON.parse(res.body);
    t.equal(body.successCode, 1);
    t.end();
  });
});

test('Retrieve user by _id test.', t => {
    r.get('/users/' + _id, res=> {
      let body = JSON.parse(res.body);
      t.equal(body[0].email, mockData.mockUserData.email);
      t.end();
    });
  });

