import express from 'express';
import * as image from '../controllers/image.controller';

/*
 * Define the URL routing for http://yoda-domain.com/image/*
 */

const router = express.Router();

//POST method

/**
 * @api {post} /image/upload Request upload Image
 * @apiName upload
 * @apiGroup Image
 *
 * @apiDescription If you upload image, server will update profile.
 *
 * @apiParam {String} url Url for image to upload.
 *
 */
router.post('/upload', image.uploadImage);

export default router;
