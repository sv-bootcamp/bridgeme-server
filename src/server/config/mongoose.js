import mongoose from 'mongoose';
import '../models/answer.model';
import '../models/survey.model';
import '../models/users.model';
import '../models/match.model';

export default function () {
  mongoose.Promise = global.Promise;
  const db = {
    dev: mongoose.connect('mongodb://localhost:27017/yoda'),
    test: mongoose.connect('mongodb://localhost:27017/yoda-test'),
  };
  return db;
}
