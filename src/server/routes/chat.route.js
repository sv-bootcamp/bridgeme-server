import express from 'express';
import * as pushUtil from '../utils/push.util';

const router = express.Router();

router.post('/callback', (req, res, next) => {
  pushUtil.sendPush(
    req.body.recipient.id,
    'MESSAGE',
    `${req.body.sender.name} : ${req.body.message}`
  );
  res.end();
});

export default router;
