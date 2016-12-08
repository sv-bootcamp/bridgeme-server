import * as pushUtil from '../utils/push.util';
import mongoose from 'mongoose';
import userCallback from '../config/json/user.callback';

const Key = mongoose.model('key');

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
  Key.findOne({ name: 'sendBirdAppId' }).exec()
    .then((sendBirdAppIdObject) => {
      res.status(200).json({ key: sendBirdAppIdObject.key });
    })
    .catch((err) => {
      res.status(400).json({ err_point: userCallback.ERR_MONGOOSE, err: err });
    });
}
