process.env.NODE_ENV = 'test';

import mongoose from 'mongoose';

/*
 * Prepare for mongodb connection to test.
 */

beforeEach(done => {
  function clearDB() {
    // for (var i in mongoose.connection.collections) {
    //   mongoose.connection.collections[i].remove(function () {});
    // }

    return done();
  }

  if (mongoose.connection.readyState === 0) {
    mongoose.connect('mongodb://localhost:27017/yoda-test', function (err) {
      if (err) {
        throw err;
      }

      return clearDB();
    });
  } else {
    return clearDB();
  }
});

afterEach(done => {
  mongoose.disconnect();
  return done();
});
