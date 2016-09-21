process.env.NODE_ENV = 'test';

import mongoose from 'mongoose';

/*
 * Prepare for mongodb connection to test.
 */
import server from '../server/index';
let app;

it('server open test.', function (done) {
  this.timeout(10000);
  app = server(()=> {
    done();
  });
});

