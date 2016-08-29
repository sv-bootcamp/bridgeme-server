import request from 'request';
import sinon from 'sinon';
import test from 'tape';
import startServer from '../../server';
import requestah from 'requestah';
let r = requestah(8000);
import mockData from '../../server/config/json/mockData.js';
/*
 * Sanity check to make sure that your server starts up without issues.
 */
let _id;

test('application server', t => {
  let server;
  const onServer = () => {
    t.ok(server, 'should expose server instance');
    server.close(t.end);
  };

  server = startServer(onServer);
});

test('User register test', t => {
  let server;
  const onServer = () => {
    r.post('/users/signin', mockData.mockUserData, res=> {
      let body = JSON.parse(res.body);
      t.equal(body.successCode, 1);
      _id = body.result._id;
      server.close(t.end);
    });
  };

  server = startServer(onServer);
});

test('get all user without access token', t => {
  let server;
  const onRequest = (err, res) => {
    t.equal(res.statusCode, 400, 'returns status code 400 without access token');
    server.close(t.end);
  };

  const onServer = () => {
    request({
      method: 'GET',
      url: `http://localhost:8000/users/all`,
    }, onRequest);
  };

  server = startServer(onServer);
});
