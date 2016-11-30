import express from 'express';
import * as chat from '../controllers/chat.controller';

const router = express.Router();

//get message object from Sendbird server and send push notificaiton.
router.post('/callback', chat.callback);

//get Sendbird appKey for access in client.
router.get('/appkey', chat.getAppKey);

export default router;
