'use strict'
import mongoose from 'mongoose'

var uri = 'mongodb://localhost/yoda'
var options = {
    server: {
        poolSize: 20        // amount of connection in one instance
    }
}
var db = mongoose.createConnection(uri, options)

db.on('error', (err) => {                   // on: event listener
	if(err){ console.error('db error', err) }
});

db.once('open', () => {            // once: run only 1st time
	console.info('Mongo db connected successfully');
});