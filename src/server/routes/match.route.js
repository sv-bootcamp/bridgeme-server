import express from 'express';
import * as match from '../controllers/match.controller';

const router = express.Router();

router.post('/request', match.requestMentoring);
router.post('/response', match.responseMentoring);

router.get('/activity', match.getMyActivity);

export default router;
