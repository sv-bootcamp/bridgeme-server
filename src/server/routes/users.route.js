'use strict';

import express from 'express';
import * as user from '../controllers/users.controller';

const router = express.Router();

router.get('/insertMock', user.insertMockData);
router.get('/all', user.getAll);

export default router;
