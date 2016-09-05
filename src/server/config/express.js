import bodyParser from 'body-parser';
import compress from 'compression';
import express from 'express';
import http from 'http';
import methodOverride from 'method-override';
import morgan from 'morgan';
import match from '../routes/match.route';
import survey from '../routes/survey.route';
import users from '../routes/users.route';

export default function() {
  const app = express();
  const server = http.createServer(app);

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production') {
    app.use(compress());
  }

  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(express.static('../public'));
  app.use('/users', users);
  app.use('/match', match);
  app.use('/survey', survey);

  return server;
}
