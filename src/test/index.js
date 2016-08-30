'use strict';

import path from 'path';
import fs from 'fs';
import test from 'tape';

const normalizedPath = path.join(__dirname, 'node');

fs.readdirSync(normalizedPath).forEach((file) => {
  require('./node/' + file);
});

test('server off', t => {
  t.pass('it will be pass.');
  t.end();
  process.exit(0);
});
