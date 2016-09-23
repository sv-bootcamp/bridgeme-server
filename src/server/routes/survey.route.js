import express from 'express';
import * as survey from '../controllers/survey.controller';

/*
 * Define the URL routing for http://yoda-domain.com/survey/*
 */

const router = express.Router();

//POST method

/**
 * @api {post} /survey/answer Save user's survey answer
 * @apiName saveAnswer
 * @apiDescription After the user finishes all of the survey questions,
 * request this method to save answers.
 * @apiGroup Survey
 *
 * @apiParamExample {json} Parameter Sample
 *     {
 *       "survey_id": "A001-1",
 *       "questions": [
 *         {
 *           "question_index": 0,
 *           "question": "이 멘토를 통해서 얻고자 하는 것은?",
 *           "answers": [
 *             {
 *               "answer_index": 0,
 *               "is_free_form": false,
 *               "content": "지원 과정"
 *             },
 *             {
 *               "answer_index": 5,
 *               "is_free_form": true,
 *               "content": "다른 의견"
 *             }
 *           ]
 *          }
 *       ]
 *     }
 *
 * @apiParam {String} survey_id Id of Survey that given
 * @apiParam {Number} question_index Index of each question (start with 0)
 * @apiParam {String} question Question's content
 * @apiParam {Number} answer_index Index of each answer (start with 0)
 * @apiParam {Boolean} is_free_form true: Description, false: Static
 * @apiParam {String} content Content of Answer
 *
 * @apiSuccess {String} survey_id Saved answer's survey id as a proof of success
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *       "survey_id": "A-001"
 *     }
 * @apiErrorExample {json} Fail
 *     HTTP/1.1 401 No matching user
 *     {
 *       "err_point": "User Not Found - No Matching user",
 *       "err": {Detail error message}
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Wrong Format
 *     {
 *       "err_point": "Cannot save answer",
 *       "err": {Detail error message}
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Invalid Access
 *     {
 *       "err_point": "Session Error"
 *     }
 */
router.post('/answer', survey.saveAnswer);

//GET method

/**
 * @api {post} /survey/create Save new survey
 * @apiName saveSurvey
 * @apiDescription Store new survey
 * @apiGroup Survey
 *
 * @apiParamExample {json} Parameter Sample
 *     {
 *       "survey_id": "A001-1",
 *       "questions": [
 *         {
 *           "question_index": 0,
 *           "question": "이 멘토를 통해서 얻고자 하는 것은?",
 *           "answers": [
 *             {
 *               "answer_index": 0,
 *               "is_free_form": false,
 *               "content": "지원 과정",
 *               "next_question_index": 1
 *             },
 *             {
 *               "answer_index": 5,
 *               "is_free_form": true,
 *               "content": "다른 의견",
 *               "next_question_index": 1
 *             }
 *           ]
 *          }
 *       ]
 *     }
 *
 * @apiParam {String} survey_id Id of Survey that given
 * @apiParam {Number} question_index Index of each question (start with 0)
 * @apiParam {String} question Question's content
 * @apiParam {Number} answer_index Index of each answer (start with 0)
 * @apiParam {Boolean} is_free_form true: Description, false: Static
 * @apiParam {String} content Content of Answer
 * @apiParam {Number} next_question_index Next question when this answer had picked
 *
 * @apiSuccess {String} survey_id Saved survey's id as a proof of success
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *       "survey_id": "A-001"
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Wrong Format
 *     {
 *       "err_point": "Cannot save question",
 *       "err": "Parameter /:type/ is not correct"
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 401 Saving Error
 *     {
 *       "err_point": "Cannot save question",
 *       "err": {Detail Error Message}
 *     }
 */
router.post('/create', survey.saveSurvey);

/**
 * @api {get} /survey/request Retrieve Survey
 * @apiName getRequest
 * @apiDescription Request new survey for mentor or mentee
 * @apiGroup Survey
 *
 * @apiParam {String} type Define the user as "mentor" or "mentee"
 *
 * @apiSuccess {String} survey_id Saved answer's survey id as a proof of success
 * @apiSuccess {Array} questions Retrieved Survey questions
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *       "survey_id": "A-001",
 *       "questions": [
 *         {
 *           "question_index": 0,
 *           "question": "이 멘토를 통해서 얻고자하는 목표는?",
 *           "allow_multiple_answer": true,
 *           "answers": [
 *             {
 *               "title": "유학",
 *               "options": [
 *                 {
 *                   "answer_index": 0,
 *                   "is_free_form": false,
 *                   "content": "지원 과정",
 *                   "next_question_index": 1
 *                 }
 *               ]
 *             },
 *             {
 *               "options": [
 *                 {
 *                   "answer_index": 1,
 *                   "is_free_form': true,
 *                   "content": "기타",
 *                   "next_question_index": 1
 *                 }
 *               ]
 *             }
 *           ]
 *         }
 *       ]
 *     }
 * @apiErrorExample {json} Not in the sample group
 *     HTTP/1.1 204 Not a Sample
 *     {null}
 * @apiErrorExample {json} No matching survey
 *     HTTP/1.1 401 No Such an Survey Exist
 *     {
 *       "err_point": "Survey Not Found - No Matching survey_id",
 *       "err": {Detail error message}
 *     }
 * @apiErrorExample {json} Wrong Parameter
 *     HTTP/1.1 400 Parameter is wrong or undefined
 *     {
 *       "err_point": "Parameter /:type/ is not correct"
 *     }
 */
router.get('/request/:type', survey.getRequest);

export default router;
