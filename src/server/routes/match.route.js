'use strict';

import express from 'express';
import * as match from '../controllers/match.controller';

const router = express.Router();

router.get('/request', match.requestMentoring);
router.get('/cancel', match.cancelRequest);
router.get('/accept', match.acceptRequest);
router.get('/reject', match.rejectRequest);
router.get('/smtp', match.sendRequestMail);

export default router;
