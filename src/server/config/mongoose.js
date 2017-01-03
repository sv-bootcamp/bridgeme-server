import mongoose from 'mongoose';
import '../models/answer.model';
import '../models/filter.model';
import '../models/survey.model';
import '../models/users.model';
import '../models/match.model';
import '../models/secretCode.model';

export default function () {
  mongoose.Promise = global.Promise;
  mongoose.connect(`${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, () => {
    if (process.env.NODE_ENV === 'test') {
      mongoose.connection.db.dropDatabase();
    }
  });
}
