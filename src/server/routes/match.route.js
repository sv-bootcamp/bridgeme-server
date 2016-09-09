import express from 'express';
import * as match from '../controllers/match.controller';

/*
 * Define the URL routing for http://yoda-domain.com/match/*
 */

const router = express.Router();

//POST method

/**
 * @api {post} /match/request Send request to mentor
 * @apiName requestMentoring
 * @apiDescription Mentee request mentoring to mentor.
 * @apiGroup Match
 *
 * @apiParam {String} mentor_id ObjectId of mentor who want to get mentoring service.
 * @apiParam {Number} content Email contains this content.
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *       "msg": "SendMail - Success to Send an email."
 *     }
 * @apiErrorExample {json} Fail
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "err_point": "SendMail - Fail to Send an email."
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "srr_point": "Authentication failed. Please sign in first."
 *     }
 */
router.post('/request', match.requestMentoring);
router.post('/response', match.responseMentoring);

//GET method

router.get('/activity', match.getMyActivity);

export default router;
