import express from 'express';
import * as match from '../controllers/survey.controller';

const router = express.Router();

router.post('/answer', match.requestAnswer);

router.get('/mentor', match.getSurvey);
router.get('/mentee', match.getSurvey);

export default router;
