'use strict';

import path from 'path';
import fs from 'fs';

const normalizedPath = path.join(__dirname, 'controllers');

fs.readdirSync(normalizedPath).forEach((file) => {
  require('./controllers/' + file);
});
