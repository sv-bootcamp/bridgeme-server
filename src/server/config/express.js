'use strict';

import http from 'http';
import express from 'express';
import morgan from 'morgan';
import compress from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import users from '../routes/users.route';
var session = require('express-session');
var MongoStore = require('connect-mongostore')(session);

export default function() {
  const app = express();
  const server = http.createServer(app);

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production') {
    app.use(compress());
  }

  app.use(session({
      secret: 'yodasalt46787134refgr45refd',
      store: new MongoStore({ db: 'yoda' }),
      resave: false,
      saveUninitialized: false,
      //session expire after 1Day.
      cookie: { maxAge: 3600 * 24 },
    }));

  app.use(bodyParser.urlencoded({
    extended: true,
  }));

  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use('/users', users);

  return server;
}
