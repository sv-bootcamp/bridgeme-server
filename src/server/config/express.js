'use strict';

import http             from 'http'
import express          from 'express'
import morgan           from 'morgan'
import compress         from 'compression'
import bodyParser       from 'body-parser'
import methodOverride   from 'method-override'
import users        from '../routes/users.route';

export default function () {
    var app = express();
	var server = http.createServer(app);
	
	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	// Use the 'body-parser' and 'method-override' middleware functions
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

    app.use('/users',users)

	return server;
} 
