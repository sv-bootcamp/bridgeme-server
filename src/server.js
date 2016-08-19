'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import mongoose from './server/config/mongoose'
import express from './server/config/express'

const db = mongoose();
const app = express();

app.listen(process.env.PORT || 8000, () => {
  console.log('Yoda is listening on port ' + (process.env.PORT || 8000));
});

module.exports = app;
