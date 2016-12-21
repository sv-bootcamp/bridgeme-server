import fs from 'fs';
import mongoose from 'mongoose';
import '../models/answer.model';
import '../models/key.model';
import '../models/survey.model';
import '../models/users.model';
import '../models/match.model';
import '../models/secretCode.model';

const HOST_NAME = process.env.NODE_ENV !== 'test' ? '172.17.0.2' : 'localhost';
const DATABASE_BASE_URL = `mongodb://${HOST_NAME}:27017/`;
const DATABASE_ENV_URL = {
  development: 'BridgeMe',
  test: 'BridgeMeTest',
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
