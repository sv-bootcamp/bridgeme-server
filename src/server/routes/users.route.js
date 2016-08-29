'use strict';

import express from 'express';
import * as user from '../controllers/users.controller';

/**
 * Define the URL routing for http://yoda-domain.com/users/*
 */

const router = express.Router();

router.get('/all', user.getAll);
router.get('/insertMock', user.insertMockData);

export default router;
