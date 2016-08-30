'use strict';

import express from 'express';
import * as user from '../controllers/users.controller';

/*
 * Define the URL routing for http://yoda-domain.com/users/*
 */

const router = express.Router();

router.get('/all', user.getAll);
router.get('/mentorlist', user.getMentorList);

export default router;
