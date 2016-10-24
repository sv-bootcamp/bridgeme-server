import mongoose from 'mongoose';
import '../models/answer.model';
import '../models/survey.model';
import '../models/users.model';
import '../models/match.model';

const DATABASE_BASE_URL = 'mongodb://localhost:27017/';
const DATABASE_ENV_URL = {
  development: 'yoda',
  test: 'yoda-test',
};

export default function () {
  mongoose.Promise = global.Promise;
  mongoose.connect(DATABASE_BASE_URL + DATABASE_ENV_URL[process.env.NODE_ENV], () => {
    if (process.env.NODE_ENV === 'test') {
      mongoose.connection.db.dropDatabase();
    }
  });
  return DATABASE_ENV_URL[process.env.NODE_ENV];
}
