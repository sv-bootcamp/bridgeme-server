'use strict';

import path from 'path';
import fs from 'fs';

const normalizedPath = path.join(__dirname, 'node');

fs.readdirSync(normalizedPath).forEach((file) => {
  require('./node/' + file);
});
