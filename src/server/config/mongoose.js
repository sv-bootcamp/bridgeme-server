'use strict';

import mongoose from 'mongoose'
import '../models/users.model' ;

export default function() {
    mongoose.Promise = global.Promise;
	const db = mongoose.connect('mongodb://localhost/yoda');
	return db;
}