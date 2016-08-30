'use strict';

import express from 'express';
import * as user from '../controllers/users.controller';

/**
 * Define the URL routing for http://yoda-domain.com/users/*
 */

const router = express.Router();

router.get('/all', user.getAll);
router.get('/me', user.getMyProfile);
router.get('/id/:_id', user.getById);

router.post('/signin', user.signin);

export default router;
