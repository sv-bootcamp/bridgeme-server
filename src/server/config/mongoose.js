'use strict'

import mongoose from 'mongoose';
import '../models/users.model';
import '../models/match.model';

export default function () {
  mongoose.Promise = global.Promise;
  const db = mongoose.connect('mongodb://localhost:27017/yoda');
  return db;
}
