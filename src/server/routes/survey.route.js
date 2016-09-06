import express from 'express';
import * as survey from '../controllers/survey.controller';

const router = express.Router();

router.post('/answer', survey.saveAnswer);
router.get('/saveQuestion', survey.saveQuestion);
router.get('/request/:survey_id', survey.getRequest);

export default router;
