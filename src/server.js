"use strict";

// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Load the module dependencies
import mongoose from './server/config/mongoose';
import express from './server/config/express';

const db = mongoose();
const app = express();

app.listen(process.env.PORT || 3000, () => {
  console.log('Yoda is listening on port '+ process.env.PORT || 3000);
});

module.exports = app;