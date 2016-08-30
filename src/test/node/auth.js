import mockData from '../mockData.js';
import requestah from 'requestah';
import test from 'tape';

let r = requestah(8000);

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

