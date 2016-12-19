import express from 'express';
import jwtUtil from '../utils/jwt.util';
import * as match from '../controllers/match.controller';

/*
 * Define the URL routing for http://yoda-domain.com/match/*
 */

const apiProtector = jwtUtil.apiProtector;
const router = express.Router();

//POST method

/**
 * @api {post} /match/mentorList Request Mentor's list with career/expertise filter
 * @apiName getMentorList
 * @apiGroup User
 *
 * @apiParam {json} Parameter Sample when you request list with no filter.
 *     {
 *       initial: true
 *     }
 *
 * @apiParam {json} Parameter Sample when you request list with filters.
 *     {
 *       "expertise" : [
 *         {
 *           "select" : "Get a new job",
 *           "index" : 1
 *         },
 *         {
 *           "select": "Career change",
 *           "index": 4
 *         }
 *       ],
 *       "career" : {
 *         "area" : "Design",
 *         "role" : "Visual/UI Designer",
 *         "years" : "All",
 *         "education_background" : "All"
 *       }
 *     }
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
router.post('/mentorList', apiProtector, match.getMentorList);

/**
 * @api {post} /match/mentorList/count Request expected user number per expertise with career filter
 * @apiName countExpectedExpertiseMatching
 * @apiGroup User
 *
 *
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
router.post('/mentorList/count', apiProtector, match.countExpectedExpertiseMatching);

/**
 * @api {post} /match/request Send request to mentor
 * @apiName requestMentoring
 * @apiDescription Mentee request mentoring to mentor via message.
 * @apiGroup Match
 *
 * @apiParam {String} mentor_id ObjectId of mentor who want to get mentoring service.
 * @apiParam String subjects Request contains this subjects.
 * @apiParam String contents Request contains this contents.
 *
 * @apiParamExample {json} Parameter Sample
 *     {
 *         "mentor_id": "5818312039",
 *         "subjects" : "Get a new job",
 *         "contents" : "Hi, I want your help!",
 *     }
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 201 OK
 *     {
 *       "msg": "RequestMentoring - Request success."
 *     }
 * @apiErrorExample {json} Fail
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "err_point": "SendMail - Fail to Send an email."
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "err_point": {err_msg}
 *     }
 */
router.post('/request', apiProtector, match.requestMentoring);

/**
 * @api {post} /match/response Send response to mentee
 * @apiName responseMentoring
 * @apiDescription Mentor response mentoring to mentee.
 * @apiGroup Match
 *
 * @apiParam {String} match_id ObjectId of match to response.
 * @apiParam {Number} option {accept : 1 , reject : 0}
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *       "msg": "Success"
 *     }
 * @apiErrorExample {json} Fail
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "err_point": {err_msg}
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "err_point": {err_msg}
 *     }
 */
router.post('/response', apiProtector, match.responseMentoring);

//GET method

/**
 * @api {get} /match/activity Request User Activity list
 * @apiName getMyActivity
 * @apiDescription Request All list of User Activity.
 * @apiGroup Match
 *
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *        "pending": [],
 *        "accepted": [],
 *        "rejected": [],
 *        "requested": [
 *          {
 *            "_id": "57d24596b0b2b32740fd28bf",
 *            "message": {
 *              "subjects": "Get a new job",
 *              "contents": "hi"
 *            },
 *            "status": 2,
 *            "request_date": "2016-09-09T05:16:06.432Z",
 *            "detail": [
 *              {
 *                "_id": "57d242d9f92c4e26e12d129c",
 *                "email": "teosyon@nate.com",
 *                "name": "Seong Min Park",
 *                "platform_id": "1087989824589437",
 *                "platform_type": 1,
 *                "locale": "ko_KR",
 *                "timezone": 9,
 *                "profile_picture": "https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/1014078_521172781271147_1753395622_n.jpg?oh=d79b1541b1aeec580110ba9e03f2e739&oe=584B8CAC",
 *                "regDate": "2016-09-09T05:04:25.543Z",
 *                " __v": 0
 *              }
 *            ]
 *          }
 *        ]
 *      }
 * @apiErrorExample {json} Fail
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "err_point": {err_msg}
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "err_point": {err_msg}
 *     }
 */
router.get('/activity', apiProtector, match.getMyActivity);

export default router;
