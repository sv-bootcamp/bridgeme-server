import express from 'express';
import * as image from '../controllers/image.controller';

/*
 * Define the URL routing for http://yoda-domain.com/users/*
 */

const router = express.Router();

router.post('/image', image.uploadImage);

export default router;
