process.env.NODE_ENV = 'test';
import server from '../server/index';

/*
 * Prepare for mongodb connection to test.
 */

let app;

it('server open test.', function (done) {
  this.timeout(5000);
  app = server(()=> {
    done();
  });
});
