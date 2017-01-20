import express from 'express';
import mongoose from './config/mongoose';

import bodyParser from 'body-parser';
import chat from './routes/chat.route';
import compress from 'compression';
import match from './routes/match.route';
import methodOverride from 'method-override';
import morgan from 'morgan';
import survey from './routes/survey.route';
import tournament from './routes/tournament.route';
import users from './routes/users.route';

export default (cb) => {
  const app = express();
  const db = mongoose();
  const limit = '5mb';

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
  }

  app.use(bodyParser.json({ limit: limit }));
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: limit,
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  app.use('/users', users);
  app.use('/survey', survey);
  app.use('/match', match);
  app.use('/chat', chat);
  app.use('/tournament', tournament);

  app.use(express.static(__dirname + '/apidoc'));

  const server = app.listen(process.env.PORT, cb ? cb : () => {
    /* eslint-disable no-console */
    console.log(`Listening on port ${process.env.PORT}`);
    /* eslint-enable */
  });

  return server;
};
