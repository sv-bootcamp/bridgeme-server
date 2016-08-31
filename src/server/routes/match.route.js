import express from 'express';
import * as match from '../controllers/match.controller';

const router = express.Router();

router.post('/request', match.requestMentoring);

router.get('/accept', match.acceptRequest);
router.get('/reject', match.rejectRequest);

export default router;
