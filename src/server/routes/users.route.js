import express from 'express';
import jwtUtil from '../utils/jwt.util';
import * as user from '../controllers/users.controller';

/*
 * Define the URL routing for http://yoda-domain.com/users/*
 */

const apiProtector = jwtUtil.apiProtector;
const router = express.Router();

//POST method

/**
 * @api {post} /users/localSignUp Request Local Sign up
 * @apiName localSignUp
 * @apiGroup User
 *
 * @apiDescription Local Sign up
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 201 Created
 *     {
 *       "__v": 0,
 *       "email": "papermoon703@naver.com",
 *       "password": "e4b6175c13a783b78327ea9150fb4206",
 *       "platform_type": 0,
 *       "_id": "58215029ca264380d4458fea",
 *       "reg_date": "2016-11-08T04:10:17.513Z",
 *       "personality": [],
 *       "expertise": [],
 *       "career": [],
 *       "experience": [],
 *       "education": []
 *     }
 *
 * @apiErrorExample {json} Bad Request
 *     HTTP/1.1 400 Failure
 *     {
 *       "err_msg": "This email is already in use."
 *     }
 *
 * @apiParam {String} email Email address that would used as ID
 * @apiParam {String} password Password that would used
 *
 */
router.post('/localSignUp', user.localSignUp);

/**
 * @api {post} /users/localSignIn Request Local Sign in
 * @apiName localSignIn
 * @apiGroup User
 *
 * @apiDescription Local Sign in
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200
 *     {
 *       "msg": "Sign in success.",
 *       "user": {
 *         "_id": "58215029ca264380d4458fea",
 *         "email": "papermoon703@naver.com",
 *         "password": "e4b6175c13a783b78327ea9150fb4206",
 *         "platform_type": 0,
 *         "__v": 0,
 *         "stamp_login": "2016-11-08T04:10:17.560Z",
 *         "reg_date": "2016-11-08T04:10:17.513Z",
 *         "personality": [],
 *         "expertise": [],
 *         "career": [],
 *         "experience": [],
 *         "education": []
 *       }
 *     }
 *
 * @apiErrorExample {json} No matching user
 *      HTTP/1.1 400
 *      {
 *        "err_msg": "No such account exists."
 *      }
 *
 * @apiParam {String} email Email address that would used as ID
 * @apiParam {String} password Password that would used
 *
 */
router.post('/localSignIn', user.localSignIn);

/**
 * @api {post} /users/signIn Request Sign in
 * @apiName signIn
 * @apiGroup User
 *
 * @apiDescription If you sign in first, server will register user automatically. After that, server will sign user in.
 *
 * @apiParam {String} access_token access_token gained from Platform API.
 * @apiParam {Number} platform_type Platform that user used when join { Facebook: 1,  LinkedIn: 2 }.
 *
 */
router.post('/signIn', user.signIn);

/**
 * @api {post} /users/signout Request Sign out
 * @apiName signout
 * @apiGroup User
 *
 * @apiDescription If you sign out, server will destroy user session.
 *
 * @apiParam {String} deviceToken deviceToken from fcm.
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *        Sign out success.
 *     }
 *
 * @apiErrorExample {json}
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "err_point": "Failed to sign out."
 *     }
 */
router.post('/signOut', apiProtector, user.signout);

/**
 * @api {post} /users/secretCode Request a secret code
 * @apiName requestSecretCode
 * @apiGroup User
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 201 Created
 *     {
 *       "secretCode": "7166ecafaa1f6e614cc507d94a0162d338f017ba920cdaeae817e81b0c1e98dd"
 *     }
 *
 * @apiErrorExample {json} Bad Request
 *     HTTP/1.1 400
 *     {
 *       "err_msg": "No such account exists."
 *     }
 *
 * @apiErrorExample {json} Bad Request
 *     HTTP/1.1 400
 *     {
 *       "err_msg": "The parameter is is wrong."
 *     }
 *
 * @apiErrorExample {json} Secret Code Problem
 *     HTTP/1.1 400 Fail
 *     {
 *       "err_msg": "Server can`t give any secret code. Sorry."
 *     }
 *
 * @apiDescription Random secret code would return. The same code would be sent to user by mail.
 *
 * @apiParam {String} email Email address of user to reset the password
 *
 */
router.post('/secretCode', user.requestSecretCode);

/**
 * @api {post} /users/resetPassword Reset the password
 * @apiName resetPassword
 * @apiGroup User
 *
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "msg": "The password had been changed successfully."
 *     }
 *
 * @apiErrorExample {json}
 *     HTTP/1.1 400
 *     {
 *       "err_msg": "This secret code had expired.."
 *     }
 *
 * @apiErrorExample {json}
 *     HTTP/1.1 400
 *     {
 *       "err_msg": "This secret code had expired.."
 *     }
 *
 * @apiDescription If the secret code is valid, the password will be updated.
 *
 * @apiParam {String} email Email address of user to reset the password
 * @apiParam {String} password Password New password
 * @apiParam {String} secretCode Secret code that user entered
 *
 */
router.post('/resetPassword', user.resetPassword);

/**
 * @api {post} /users/editGeneral Request Edit general information
 * @apiName editGeneral
 * @apiGroup User
 *
 *  * @apiParamExample {json} Parameter Sample
 *     {
 *         "name": "조사라",
 *         "email": "joytutu29@naver.com",
 *         "languages": "Korean, English",
 *         "location": "",
 *         "about": "Hi, I am Sarah",
 *         "experience" : [],
 *         "education" : [
 *              {
 *                  "type" : "High School",
 *                  "school" : {
 *                      "name" : "노은고등학교"
 *                  }
 *              },
 *              {
 *                  "type" : "College",
 *                  "concentration" : [
 *                      {
 *                          "name" : "IT공학과"
 *                      }
 *                  ],
 *                  "school" : {
 *                      "name" : "숙명여자대학교 Sookmyung Women's University"
 *                  }
 *              }
 *         ],
 *         "image" : "iVBOAAzCAYAAADiTxxnHl0LT5jVteHlN+5q+JCKBJ"
 *     }
 * @apiDescription {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *       "msg": "Update success"
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "err_point": {err_msg}
 *     }
 *
 * @apiParam {String} name Name of User.
 * @apiParam {String} email Information of user email.
 * @apiParam {String} languages Information of user languages.
 * @apiParam {String} location Information of user location.
 * @apiParam {String} about One short sentence about User.
 * @apiParam {Array} experience Information of user work history.
 * @apiParam {Array} education Information of user education history.
 * @apiParam {String} image Information of user image.
 *
 */
router.post('/editGeneral', apiProtector, user.editGeneralProfile);

/**
 * @api {post} /users/editCareer Request Edit career information
 * @apiName editCareer
 * @apiGroup User
 *
 *  * @apiParamExample {json} Parameter Sample
 *     {
 *         "career" : [
 *              {
 *                  "area" : "Design",
 *                  "role" : "Visual / UI",
 *                  "years" : "0-2 years",
 *                  "education_background" : "Bachelor's"
 *              }
 *         ],
 *     }
 * @apiDescription {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *       "msg": "Sign up success."
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "err_point": {err_msg}
 *     }
 *
 * @apiParam {Array} career Information of user career.
 *
 */
router.post('/editCareer', apiProtector, user.editCareer);

/**
 * @api {post} /users/editExpertise Request Edit expertise information
 * @apiName editExpertise
 * @apiGroup User
 *
 *  * @apiParamExample {json} Parameter Sample
 *     {
 *         "expertise" : [
 *              {
 *                  "select" : "Requirement",
 *                  "index" : 0
 *              },
 *              {
 *                  "select" : "Resume",
 *                  "index" : 1
 *              },
 *              {
 *                  "select" : "Portfolio",
 *                  "index" : 2
 *              }
 *         ],
 *     }
 * @apiDescription {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *       "msg": "Sign up success."
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "err_point": {err_msg}
 *     }
 *
 * @apiParam {Array} expertise Information of user expertise.
 * @apiParam {Array} personality Information of user personality.
 *
 */
router.post('/editExpertise', apiProtector, user.editExpertise);

/**
 * @api {post} /users/editPersonality Request Edit personality information
 * @apiName editPersonality
 * @apiGroup User
 *
 *  * @apiParamExample {json} Parameter Sample
 *     {
 *         "personality" : [
 *              {
 *                  "option" : "Extroverts",
 *                  "score" : 0
 *              },
 *                  "option" : "Introverts",
 *                  "score" : 0
 *              },
 *                  "option" : "Sensors",
 *                  "score" : 1
 *              },
 *                  "option" : "Thinkers",
 *                  "score" : 1
 *              },
 *                  "option" : "Judgers",
 *                  "score" : 2
 *              },
 *                  "option" : "Listener",
 *                  "score" : 2
 *              },
 *                  "option" : "Energetic",
 *                  "score" : 2
 *              },
 *                  "option" : "Unexacting",
 *                  "score" : 1
 *              },
 *                  "option" : "Traditional",
 *                  "score" : 1
 *              }
 *         ]
 *     }
 * @apiDescription {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *       "msg": "Sign up success."
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "err_point": {err_msg}
 *     }
 *
 * @apiParam {Array} personality Information of user personality.
 *
 */
router.post('/editPersonality', apiProtector, user.editPersonality);

/**
 * @api {post} /users/setRequestStatus Request Edit mentorMode
 * @apiName setRequestStatus
 * @apiGroup User
 *
 * @apiParam {Boolean} mentorMode Flag for requestGet.
 *
 */
router.post('/editMentorMode', apiProtector, user.setMentoringRequestStatus);

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
 *       "err_point": {err_msg}
 *     }
 */
router.get('/all', apiProtector, user.getAll);

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
 *       "err_point": {err_msg}
 *     }
 */
router.get('/id/:_id', apiProtector, user.getProfileById);

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
 *       "err_point": {err_msg}
 *     }
 */
router.get('/me', apiProtector, user.getMyProfile);

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
 *       "err_point": {err_msg}
 *     }
 *
 */
router.get('/mentorlist', apiProtector, user.getMentorList);

/**
 * @api {get} /users/career Request user career information
 * @apiName getCareerInfo
 * @apiGroup User
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *        "_id": "58379820f1f616fbdcce97e9",
 *        "education_background": "Bachelor's",
 *        "years": "0-1 years",
 *        "role": "Backend Engineer",
 *        "area": "Software Engineering"
 *      }
 *     ]
 *
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "err_point": {err_msg}
 *     }
 *
 */
router.get('/career', apiProtector, user.getCareerInfo);

/**
 * @api {get} /users/expertise Request user expertise information
 * @apiName getExpertiseInfo
 * @apiGroup User
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *        "_id": "58379822f1f616fbdcce97ec",
 *        "index": 0,
 *        "select": "Study abroad"
 *      },
 *      {
 *        "_id": "58379822f1f616fbdcce97eb",
 *        "index": 2,
 *        "select": "Portfolio & Resume"
 *      },
 *      {
 *        "_id": "58379822f1f616fbdcce97ec",
 *        "index": 4,
 *        "select": "Career change"
 *      }
 *     ]
 *
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "err_point": {err_msg}
 *     }
 *
 */
router.get('/expertise', apiProtector, user.getExpertiseInfo);

/**
 * @api {get} /users/personality Request user personality information
 * @apiName getPersonalityInfo
 * @apiGroup User
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *        "_id": "58379827f1f616fbdcce97fa",
 *        "score": 0,
 *        "option": "Extroverts"
 *      },
 *      {
 *        "_id": "58379827f1f616fbdcce97fa",
 *        "score": 1,
 *        "option": "Intuitive"
 *      },
 *      {
 *        "_id": "58379827f1f616fbdcce97fa",
 *        "score": 0,
 *        "option": "Feelers"
 *      },
 *      {
 *        ...
 *      }
 *     ]
 *
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "err_point": {err_msg}
 *     }
 *
 */
router.get('/personality', apiProtector, user.getPersonalityInfo);

/**
 * @api {get} /users/getRequestStatus Request mentorMode
 * @apiName getRequestStatus
 * @apiGroup User
 *
 * @apiSuccessExample {json} Success
 *      HTTP/1.1 200 OK
 *     {
 *       "result": true
 *     }
 *
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "err_point": {err_msg}
 *     }
 *
 */
router.get('/mentorMode', apiProtector, user.getMentoringRequestStatus);

/**
 * @api {get} /users/accessToken Token: Check
 * @apiName checkAccessToken
 * @apiGroup User
 *
 * @apiDescription Check token is validate or not.
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *       "msg": "Valid access_token."
 *     }
 *
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "err_point": "invalid token"
 *     }
 */
router.post('/accessToken', apiProtector, user.validateAccessToken);

/**
 * @api {put} /users/accessToken Token: Update
 * @apiName updateAccessToken
 * @apiGroup User
 *
 * @apiDescription Update access token if previous token is expired .
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *        "access_token": " {access_token}
 *      }
 *
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "err_point": "invalid token"
 *     }
 */
router.put('/accessToken', user.updateAccessToken);

export default router;
