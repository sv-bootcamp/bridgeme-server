import express from 'express';
import * as user from '../controllers/users.controller';

/*
 * Define the URL routing for http://yoda-domain.com/users/*
 */

const router = express.Router();

//POST method

/**
 * @api {post} /users/local_signup Request Local Sign up
 * @apiName local_signup
 * @apiGroup User
 *
 * @apiDescription Local Sign up
 *
 * @apiParam {String} email Email address that would used as ID
 * @apiParam {String} password Password that would used
 *
 */
router.post('/local_signup', user.localSignUp);

/**
 * @api {post} /users/local_signin Request Local Sign in
 * @apiName local_signin
 * @apiGroup User
 *
 * @apiDescription Local Sign in
 *
 * @apiParam {String} email Email address that would used as ID
 * @apiParam {String} password Password that would used
 *
 */
router.post('/local_signin', user.localSignIn);

/**
 * @api {post} /users/signin Request Sign in
 * @apiName signin
 * @apiGroup User
 *
 * @apiDescription If you sign in first, server will register user automatically. After that, server will sign user in.
 *
 * @apiParam {String} access_token access_token gained from Platform API.
 * @apiParam {Number} platform_type Platform that user used when join { Facebook: 1,  LinkedIn: 2 }.
 *
 */
router.post('/signin', user.signIn);

/**
 * @api {post} /users/reset_password Request a secret code for reset the password.
 * @apiName reset_password
 * @apiGroup User
 *
 * @apiDescription Random secret code would return. The same code would be sent to user by mail.
 *
 * @apiParam {String} email Email address of user to reset the password
 *
 */
router.post('/secret_code', user.requestSecretCode);

/**
 * @api {post} /users/reset_password Request a secret code for reset the password.
 * @apiName reset_password
 * @apiGroup User
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *       "msg": "The password had been changed successfully."
 *     }
 *
 * @apiDescription Random secret code would return. The same code would be sent to user by mail.
 *
 * @apiParam {String} email Email address of user to reset the password
 *
 */
router.post('/reset_password', user.resetPassword);

//GET method

/**
 * @api {get} /users/all Request All User info
 * @apiName getAll
 * @apiGroup User
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *        User1's Info
 *      },
 *      {
 *        User2's Info
 *      },
 *      {
 *        User3's Info
 *      },....
 *     ]
 *
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "err_point": "Authentication failed. Please sign in first."
 *     }
 */
router.get('/all', user.getAll);

/**
 * @api {get} /users/id/:id Request User info
 * @apiName getProfileById
 * @apiGroup User
 *
 * @apiSuccessExample {json} Success
 *      HTTP/1.1 200 OK
 *     {
 *       "_id": "57d214b87bdc0820732da371",
 *       "email": "lyw0149@naver.com",
 *       "name": "Yangwoo Lee",
 *       "platform_id": "10205720438113883",
 *       "platform_type": 1,
 *       "locale": "ko_KR",
 *       "timezone": 9,
 *       "profile_picture": "https://scontent.xx.fbcdn.net/v/t1.0-1/...",
 *       "__v": 0,
 *       "date": "2016-09-09T01:47:36.628Z"
 *     }
 *
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "err_point": "Authentication failed. Please sign in first."
 *     }
 */
router.get('/id/:_id', user.getProfileById);

/**
 * @api {get} /users/me Request My info
 * @apiName getMyProfile
 * @apiGroup User
 *
 * @apiParam {String} _id ObjectId of User.
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "57d214b87bdc0820732da371",
 *       "email": "lyw0149@naver.com",
 *       "name": "Yangwoo Lee",
 *       "platform_id": "10205720438113883",
 *       "platform_type": 1,
 *       "locale": "ko_KR",
 *       "timezone": 9,
 *       "profile_picture": "https://scontent.xx.fbcdn.net/v/t1.0-1/...",
 *       "__v": 0,
 *       "date": "2016-09-09T01:47:36.628Z"
 *     }
 *
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "err_point": "Authentication failed. Please sign in first."
 *     }
 */
router.get('/me', user.getMyProfile);

/**
 * @api {get} /users/mentorlist Request Mentor's list
 * @apiName getMentorList
 * @apiGroup User
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *        Mentor1's Info
 *      },
 *      {
 *        Mentor2's Info
 *      },
 *      {
 *        Mentor3's Info
 *      },....
 *     ]
 *
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "err_point": "Authentication failed. Please sign in first."
 *     }
 *
 */
router.get('/mentorlist', user.getMentorList);

export default router;
