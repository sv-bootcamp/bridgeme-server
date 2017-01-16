import express from 'express';
import jwtUtil from '../utils/jwt.util';
import * as tournament from '../controllers/tournament.controller';

const apiProtector = jwtUtil.apiProtector;
const router = express.Router();

//GET method

/**
 * @api {get} /tournament/list/:area Get tournament list.
 * @apiName getTournamentList
 * @apiGroup Tournament
 *
 * @apiParam {String} type Define the area as "Designer" or other else.
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *       "count" : 28,
 *       "list" : [
 *         {
 *           Mentor1's Info
 *         },
 *         {
 *           Mentor2's Info
 *         },
 *         {
 *           Mentor3's Info
 *         },....
 *       ]
 *     }
 *
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "err_point": {err_msg}
 *     }
 *
 */
router.get('/list/:area', apiProtector, tournament.getTournamentList);

export default router;
