import test from 'tape';
import requestah from 'requestah';
let r = requestah(8000);
let _id;
import mockData from '../../server/config/json/mockData.js';

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

