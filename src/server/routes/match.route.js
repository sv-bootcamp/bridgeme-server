import express from 'express';
import * as match from '../controllers/match.controller';

/*
 * Define the URL routing for http://yoda-domain.com/match/*
 */

const router = express.Router();

//POST method
router.post('/request', match.requestMentoring);
router.post('/response', match.responseMentoring);

//GET method
router.get('/activity', match.getMyActivity);

export default router;
