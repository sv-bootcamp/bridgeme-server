import * as pushUtil from '../utils/push.util';
import mongoose from 'mongoose';
import userCallback from '../config/json/user.callback';

export function callback(req, res, next) {
  const extraData = {
    opponent: {
      name: req.body.sender.name,
      userId: req.body.sender.id,
    },
  };

  pushUtil.sendPush(
    req.body.recipient.id,
    'MESSAGE',
    `${req.body.sender.name} : ${req.body.message}`,
    extraData,
  );
  res.status(200).end();
}

export function getAppId(req, res, next) {
  if (process.env.SENDBIRD_APP_ID) {
    res.status(200).json({ key: process.env.SENDBIRD_APP_ID });
  } else {
    res.status(400).json({ err_point: userCallback.ERR_UNDEFINED_KEY });
  }
}

