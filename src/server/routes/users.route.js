'use strict';

import express from 'express';
import * as users from '../controllers/users.controller';

const router = express.Router();

router.get('/insertMock', users.saveTest);
router.get('/all', users.getAll);

export default router;
