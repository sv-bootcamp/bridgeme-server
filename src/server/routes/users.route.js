import express from 'express';
import * as user from '../controllers/users.controller';

/*
 * Define the URL routing for http://yoda-domain.com/users/*
 */

const router = express.Router();

//POST method
router.post('/signIn', user.signin);

//GET method
router.get('/all', user.getAll);
router.get('/id/:_id', user.getProfileById);
router.get('/me', user.getMyProfile);
router.get('/mentorlist', user.getMentorList);

export default router;
