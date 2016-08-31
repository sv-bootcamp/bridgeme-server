import mongoose from 'mongoose'

/*
 * Prepare for mongodb connection to test.
 */

beforeEach(done => {
  function clearDB() {
    /*
     * This part is hided because it always cleanDB even when dev-mode,
     * so if test, dev DB separated, this would be added for test.
     */
    // for (var i in mongoose.connection.collections) {
    //   mongoose.connection.collections[i].remove(function() {});
    // }
    return done();
  }
  
  if (mongoose.connection.readyState === 0) {
    mongoose.connect('mongodb://localhost:27017/yoda', function (err) {
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
