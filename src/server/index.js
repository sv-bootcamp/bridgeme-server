process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import bodyParser from 'body-parser';
import compress from 'compression';
import express from 'express';
import mongoose from './config/mongoose';
import morgan from 'morgan';
import methodOverride from 'method-override';
import session from 'express-session';
import users from './routes/users.route';
import survey from './routes/survey.route';

const MongoStore = require('connect-mongostore')(session);

export default (cb) => {
  const app = express();
  const db = mongoose();

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
  app.use('/survey', survey);

  const server = app.listen(8000, cb ? cb : () => {
    /* eslint-disable no-console */
    console.log(`Listening on port 8000`);
    /* eslint-enable */
  });

  return server;
};
