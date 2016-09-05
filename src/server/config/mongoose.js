import mongoose from 'mongoose';
import '../models/answer.model';
import '../models/survey.model';
import '../models/users.model';
import '../models/match.model';

const mongodb_port = 27017;

export default function () {
  mongoose.Promise = global.Promise;
  const db = mongoose.connect('mongodb://localhost:27017/yoda');
  return db;
}

// export default function () {
//   const db: {
//     development: "mongodb://localhost:" + mongodb_port + "/yoda-dev",
//     test: "mongodb://localhost:" + mongodb_port + "/yoda-test",
//   }
//   return db;
// };
