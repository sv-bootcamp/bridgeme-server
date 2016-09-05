import express from 'express';
import * as match from '../controllers/match.controller';

const router = express.Router();

router.post('/request', match.requestMentoring);
router.post('/accept', match.acceptRequest);
router.post('/reject', match.rejectRequest);

router.get('/activity', match.getActivity);

export default router;
