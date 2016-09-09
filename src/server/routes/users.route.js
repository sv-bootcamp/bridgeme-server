import express from 'express';
import * as user from '../controllers/users.controller';

/*
 * Define the URL routing for http://yoda-domain.com/users/*
 */

const router = express.Router();

//POST method

/**
 * @api {post} /users/signin Request All User's Profile
 * @apiName signin
 * @apiGroup User
 *
 * @apiParam {String} access_token access_token gained from Platform API.
 * @apiParam {Number} platform_type Platform that user used when join
 { Facebook: 1,  LinkedIn: 2 }.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/signIn', user.signin);

//GET method

/**
* @api {get} /users/all Request All User's Profile
* @apiName getAll
* @apiGroup User
*
* @apiParam {Number} id Users unique ID.
*
* @apiSuccess {String} firstname Firstname of the User.
* @apiSuccess {String} lastname  Lastname of the User.
*/
router.get('/all', user.getAll);
/**
 * @api {get} /users/id/:id Request User information
 * @apiName getProfileById
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.get('/id/:_id', user.getProfileById);
/**
 * @api {get} /users/me Request my information
 * @apiName getMyProfile
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {User} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.get('/me', user.getMyProfile);

router.get('/mentorlist', user.getMentorList);

export default router;
