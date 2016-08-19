'use strict'

import express from 'express';
import * as Users from '../controllers/users.controller';

const router = express.Router();

router.get('/insertMock', Users.saveTest);
router.get('/all', Users.getAll);

export default router;
